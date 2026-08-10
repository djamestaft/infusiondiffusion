import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { AccountEntry } from "@/components/account/account-entry";

const destination = "https://accounts.example.test/account?return_to=%2Forders";
afterEach(cleanup);
describe("AccountEntry", () => {
  it("uses one H1, a same-tab hosted anchor, and no local credential or order UI", () => {
    render(
      <AccountEntry
        state="available"
        destination={destination}
        cartCount={3}
      />,
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const handoff = screen.getByRole("link", {
      name: "Continue to your account",
    });
    expect(handoff).toHaveAttribute("href", destination);
    expect(handoff).not.toHaveAttribute("target");
    expect(screen.getAllByRole("link", { name: "Cart, 3 items" })).toHaveLength(
      2,
    );
    expect(screen.getByRole("contentinfo")).toBeVisible();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    expect(document.querySelector("form")).toBeNull();
    expect(
      screen.queryByText(/order history|quick reorder/i),
    ).not.toBeInTheDocument();
  });

  it.each([
    ["disabled", "Account access is not currently available"],
    ["configuration-missing", "Account access is not currently available"],
    ["not-provisioned", "Account destination is not available"],
  ] as const)(
    "renders the truthful static %s recovery state",
    (state, copy) => {
      render(<AccountEntry state={state} />);
      expect(screen.getByText(copy)).toBeVisible();
      expect(screen.queryByRole("alert")).not.toBeInTheDocument();
      expect(
        screen.queryByRole("link", { name: "Continue to your account" }),
      ).not.toBeInTheDocument();
      expect(
        screen.getByRole("link", { name: "Continue shopping" }),
      ).toHaveAttribute("href", "/shop");
    },
  );

  it("announces only provider failure and supplies native retry", () => {
    render(<AccountEntry state="error" onRetry={() => undefined} />);
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Nothing was submitted",
    );
    expect(screen.getByRole("button", { name: "Try again" })).toBeVisible();
  });

  it("keeps one semantic H1 and aria-busy during loading", () => {
    render(<AccountEntry state="loading" />);
    expect(screen.getByRole("main")).toHaveAttribute("aria-busy", "true");
    expect(
      screen.getByRole("heading", { level: 1, name: "Your account" }),
    ).toBeInTheDocument();
  });

  it("keeps long content in a wrapping, readable structure", () => {
    render(
      <AccountEntry state="available" destination={destination} longContent />,
    );
    expect(screen.getByText(/accountaccessinformation/)).toHaveClass(
      "break-words",
    );
  });
});
