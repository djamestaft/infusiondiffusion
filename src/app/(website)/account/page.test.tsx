import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: vi.fn() }));
vi.mock("@/lib/shopify/account-entry", () => ({ getAccountEntry: vi.fn() }));
vi.mock("@/lib/shopify/cart-session", () => ({ readCart: vi.fn() }));

import { connection } from "next/server";
import { getAccountEntry } from "@/lib/shopify/account-entry";
import { readCart } from "@/lib/shopify/cart-session";
import {
  AccountContent,
  getAccountPageData,
  metadata,
} from "@/app/(website)/account/page";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe("account route", () => {
  it.each([
    [{ status: "disabled" }, "Account access is not currently available"],
    [
      { status: "configuration-missing" },
      "Account access is not currently available",
    ],
    [{ status: "not-provisioned" }, "Account destination is not available"],
    [
      {
        status: "available",
        destination: "https://accounts.example.test/account",
      },
      "Continue to your account",
    ],
  ] as const)(
    "renders normalized %s state through AccountEntry",
    async (entry, expectedControl) => {
      vi.mocked(getAccountEntry).mockResolvedValueOnce(entry);
      vi.mocked(readCart).mockResolvedValueOnce({ totalQuantity: 2 } as never);

      render(await AccountContent());

      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Your account",
      );
      expect(screen.getByText(expectedControl)).toBeVisible();
      expect(connection).toHaveBeenCalled();
      if (entry.status === "available") {
        expect(
          screen.getByRole("link", { name: expectedControl }),
        ).toHaveAttribute("href", entry.destination);
      } else {
        expect(
          screen.queryByRole("link", { name: "Continue to your account" }),
        ).not.toBeInTheDocument();
      }
    },
  );

  it("returns normalized data and the cart count after the runtime boundary", async () => {
    vi.mocked(getAccountEntry).mockResolvedValueOnce({ status: "disabled" });
    vi.mocked(readCart).mockResolvedValueOnce({ totalQuantity: 2 } as never);

    await expect(getAccountPageData()).resolves.toMatchObject({
      entry: { status: "disabled" },
      cartCount: 2,
    });
    expect(connection).toHaveBeenCalled();
  });

  it("has accurate private account metadata", () => {
    expect(metadata).toMatchObject({
      title: { absolute: "Your account | Infusion Diffusion" },
      robots: { index: false, follow: false },
    });
  });

  it("lets provider failures reach the error boundary", async () => {
    vi.mocked(getAccountEntry).mockRejectedValueOnce(
      new Error("provider failure"),
    );
    vi.mocked(readCart).mockResolvedValueOnce({ totalQuantity: 0 } as never);
    await expect(getAccountPageData()).rejects.toThrow("provider failure");
  });
});
