import { describe, expect, it } from "vitest";
import { cartNavigationCount, emptyCart } from "@/lib/shopify/cart-contract";

describe("cartNavigationCount", () => {
  it("returns unknown for unavailable reads, including stale quantities", () => {
    expect(cartNavigationCount({ ...emptyCart, unavailable: true })).toBeNull();
    expect(
      cartNavigationCount({
        ...emptyCart,
        totalQuantity: 3,
        unavailable: true,
      }),
    ).toBeNull();
  });
  it("preserves confirmed empty and populated counts", () => {
    expect(cartNavigationCount(emptyCart)).toBe(0);
    expect(cartNavigationCount({ ...emptyCart, totalQuantity: 3 })).toBe(3);
  });
});
