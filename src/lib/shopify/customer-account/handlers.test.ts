// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { NextRequest } from "next/server";
import {
  accountLogin,
  accountCallback,
  accountLogout,
  accountProfile,
} from "./handlers";
afterEach(() => vi.unstubAllEnvs());
it("retains hosted fallback with the new feature disabled", async () => {
  vi.stubEnv("SHOPIFY_CUSTOMER_SESSION_ENABLED", "false");
  expect(
    (
      await accountLogin(new NextRequest("https://store.example/account/login"))
    ).headers.get("location"),
  ).toBe("https://store.example/account");
  expect(
    await (
      await accountProfile(new NextRequest("https://store.example/api/account"))
    ).json(),
  ).toEqual({ status: "signed-out" });
});
it("fails closed without reflecting secrets or submitted provider errors", async () => {
  vi.stubEnv("SHOPIFY_CUSTOMER_SESSION_ENABLED", "true");
  const response = await accountCallback(
    new NextRequest(
      "https://store.example/account/callback?error_description=private",
    ),
  );
  expect(response.headers.get("location")).toBe(
    "https://store.example/account?notice=error",
  );
  expect(response.headers.get("cache-control")).toContain("no-store");
  expect(await response.text()).not.toContain("private");
});
it("rejects a cross-origin logout before contacting services", async () => {
  vi.stubEnv("SHOPIFY_CUSTOMER_SESSION_ENABLED", "true");
  const response = await accountLogout(
    new NextRequest("https://store.example/account/logout", {
      method: "POST",
      headers: { origin: "https://evil.test" },
    }),
  );
  expect(response.status).toBe(403);
});
