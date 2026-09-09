import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("@/lib/shopify/cart", () => ({
  getCart: vi.fn(),
  toPublicCart: vi.fn((cart) => cart),
}));
import { getCart } from "@/lib/shopify/cart";
import { emptyCart } from "@/lib/shopify/cart-contract";
import { cookies } from "next/headers";
import {
  checkoutIsEnabled,
  validCartId,
  writeCartId,
  readCart,
} from "@/lib/shopify/cart-session";

describe("validCartId", () => {
  it("reports a failed lookup as unavailable without mutating the saved session", async () => {
    const remove = vi.fn();
    vi.mocked(cookies).mockResolvedValue({
      get: () => ({ value: "gid://shopify/Cart/abc?key=private" }),
      delete: remove,
    } as never);
    vi.mocked(getCart).mockRejectedValueOnce(
      new Error("upstream private detail"),
    );
    const result = await readCart();
    expect(result).toEqual({
      ...emptyCart,
      unavailable: true,
      message: "We could not refresh your bag. Please try again.",
    });
    expect(JSON.stringify(result)).not.toContain("private");
    expect(remove).not.toHaveBeenCalled();
  });
  it("treats a confirmed expired cart as empty without writing cookies during render", async () => {
    const remove = vi.fn(() => {
      throw new Error("Cookies are read-only during render");
    });
    vi.mocked(cookies).mockResolvedValue({
      get: () => ({ value: "gid://shopify/Cart/expired" }),
      delete: remove,
    } as never);
    vi.mocked(getCart).mockResolvedValueOnce(null);
    expect(await readCart()).toEqual(emptyCart);
    expect(remove).not.toHaveBeenCalled();
  });
  it("reads the saved cart again after a temporary lookup failure", async () => {
    vi.mocked(cookies).mockResolvedValue({
      get: () => ({ value: "gid://shopify/Cart/saved" }),
    } as never);
    vi.mocked(getCart)
      .mockRejectedValueOnce(new Error("temporary failure"))
      .mockResolvedValueOnce(emptyCart as never);
    expect((await readCart()).unavailable).toBe(true);
    expect(await readCart()).toEqual(emptyCart);
  });
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
