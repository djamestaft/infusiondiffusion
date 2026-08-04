import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
import { cookies } from "next/headers";
import {
  checkoutIsEnabled,
  validCartId,
  writeCartId,
} from "@/lib/shopify/cart-session";

describe("validCartId", () => {
  it("accepts an opaque Shopify cart ID including its secret key", () =>
    expect(validCartId("gid://shopify/Cart/abc123?key=secret")).toBe(true));
  it.each([
    "",
    "gid://shopify/Product/1",
    "https://example.com",
    "gid://shopify/Cart/has spaces",
  ])("rejects %s", (value) => expect(validCartId(value)).toBe(false));
  it("writes the cart key only as an HttpOnly same-site cookie", async () => {
    const set = vi.fn();
    vi.mocked(cookies).mockResolvedValue({ set } as never);
    await writeCartId("gid://shopify/Cart/abc?key=secret");
    expect(set).toHaveBeenCalledWith(
      "infusion_cart",
      expect.any(String),
      expect.objectContaining({ httpOnly: true, sameSite: "lax", path: "/" }),
    );
  });
  it("keeps hosted checkout disabled unless explicitly enabled", () => {
    const previous = process.env.SHOPIFY_CHECKOUT_ENABLED;
    delete process.env.SHOPIFY_CHECKOUT_ENABLED;
    expect(checkoutIsEnabled()).toBe(false);
    process.env.SHOPIFY_CHECKOUT_ENABLED = "true";
    expect(checkoutIsEnabled()).toBe(true);
    if (previous === undefined) delete process.env.SHOPIFY_CHECKOUT_ENABLED;
    else process.env.SHOPIFY_CHECKOUT_ENABLED = previous;
  });
});
