import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/server", () => ({ connection: vi.fn() }));
vi.mock("@/lib/shopify/account-entry", () => ({ getAccountEntry: vi.fn() }));
vi.mock("@/lib/shopify/cart-session", () => ({ readCart: vi.fn() }));

import { connection } from "next/server";
import { getAccountEntry } from "@/lib/shopify/account-entry";
import { readCart } from "@/lib/shopify/cart-session";
import { getAccountPageData, metadata } from "@/app/(website)/account/page";

describe("account route", () => {
  it.each([
    [{ status: "disabled" }, "disabled"],
    [{ status: "configuration-missing" }, "configuration-missing"],
    [{ status: "not-provisioned" }, "not-provisioned"],
    [
      {
        status: "available",
        destination: "https://accounts.example.test/account",
      },
      "available",
    ],
  ] as const)(
    "passes normalized %s state and cart count after the runtime boundary",
    async (entry, status) => {
      vi.mocked(getAccountEntry).mockResolvedValueOnce(entry);
      vi.mocked(readCart).mockResolvedValueOnce({ totalQuantity: 2 } as never);
      await expect(getAccountPageData()).resolves.toMatchObject({
        entry: { status },
        cartCount: 2,
      });
      expect(connection).toHaveBeenCalled();
    },
  );

  it("has accurate private account metadata", () => {
    expect(metadata).toMatchObject({
      title: "Your account | Infusion Diffusion",
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
