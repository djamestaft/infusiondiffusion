import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { AccountEntry } from "./account-entry";
afterEach(cleanup);
it("shows verified initials, name and email with hosted orders and logout", () => {
  render(
    <AccountEntry
      state="available"
      destination="https://shopify.com/123/account"
      customerState={{
        status: "signed-in",
        profile: {
          name: "Devon Taft",
          email: "test@example.test",
          initials: "DT",
        },
      }}
    />,
  );
  expect(screen.getByText("Devon Taft")).toBeVisible();
  expect(screen.getByText("test@example.test")).toBeVisible();
  expect(
    screen.getAllByRole("link", {
      name: "Account, signed in as Devon Taft",
    })[0],
  ).toHaveTextContent("DT");
  expect(
    screen.getByRole("link", { name: "View your orders" }),
  ).toHaveAttribute("href", "https://shopify.com/123/account");
  expect(screen.getByRole("button", { name: "Sign out" })).toBeVisible();
});
it("retains the icon when the authenticated customer has no name", () => {
  render(
    <AccountEntry
      state="available"
      customerState={{
        status: "signed-in",
        profile: { name: null, email: null, initials: null },
      }}
    />,
  );
  expect(screen.getAllByText("Not provided")).toHaveLength(2);
  expect(
    screen.getAllByRole("link", { name: "Account, signed in" })[0],
  ).not.toHaveTextContent("@");
});
it("asks an expired session to sign in again without customer details", () => {
  render(
    <AccountEntry state="available" customerState={{ status: "expired" }} />,
  );
  expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
    "href",
    "/account/login",
  );
  expect(screen.queryByRole("button", { name: "Sign out" })).toBeNull();
});
