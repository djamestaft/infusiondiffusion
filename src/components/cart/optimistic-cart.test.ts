import { describe, expect, it } from "vitest";

import { withOptimisticQuantity } from "@/components/cart/optimistic-cart";
import type { CartContract } from "@/lib/shopify/cart-contract";

const cart: CartContract = {
  totalQuantity: 3,
  subtotal: { amount: "1255", currencyCode: "ZAR" },
  lines: [
    {
      id: "line-1",
      merchandiseId: "variant-1",
      title: "Bois De Santal",
      quantity: 2,
      available: true,
      total: { amount: "860", currencyCode: "ZAR" },
    },
    {
      id: "line-2",
      merchandiseId: "variant-2",
      title: "Blanc De Blanc",
      quantity: 1,
      available: true,
      total: { amount: "395", currencyCode: "ZAR" },
    },
  ],
};

describe("withOptimisticQuantity", () => {
  it("updates the line, total quantity, and subtotal immediately", () => {
    const nextCart = withOptimisticQuantity(cart, "line-1", 3);

    expect(nextCart.totalQuantity).toBe(4);
    expect(nextCart.subtotal.amount).toBe("1685");
    expect(nextCart.lines[0]).toMatchObject({
      quantity: 3,
      total: { amount: "1290", currencyCode: "ZAR" },
    });
  });

  it("removes a line optimistically", () => {
    const nextCart = withOptimisticQuantity(cart, "line-1", 0);

    expect(nextCart.totalQuantity).toBe(1);
    expect(nextCart.lines.map((line) => line.id)).toEqual(["line-2"]);
  });

  it("leaves an unknown line unchanged", () => {
    expect(withOptimisticQuantity(cart, "missing", 2)).toBe(cart);
  });
});
