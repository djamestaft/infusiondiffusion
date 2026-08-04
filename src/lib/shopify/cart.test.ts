import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/shopify/client", () => ({ storefrontRequest: vi.fn() }));
import { storefrontRequest } from "@/lib/shopify/client";
import { createCart, toPublicCart } from "@/lib/shopify/cart";

const request = vi.mocked(storefrontRequest);
const rawCart = {
  id: "gid://shopify/Cart/abc?key=secret",
  checkoutUrl: "https://infusiondiffusion.myshopify.com/checkouts/abc",
  totalQuantity: 1,
  cost: { subtotalAmount: { amount: "400", currencyCode: "ZAR" } },
  lines: {
    nodes: [
      {
        id: "gid://shopify/CartLine/line",
        quantity: 1,
        cost: { totalAmount: { amount: "430", currencyCode: "ZAR" } },
        discountAllocations: [
          {
            title: "Launch",
            discountedAmount: { amount: "30", currencyCode: "ZAR" },
          },
        ],
        merchandise: {
          id: "gid://shopify/ProductVariant/variant",
          title: "Default Title",
          availableForSale: true,
          product: { title: "Bois De Santal", productType: "Reed diffuser" },
        },
      },
    ],
  },
};

describe("Shopify cart normalization", () => {
  beforeEach(() => request.mockReset());
  it("keeps secret cart and checkout fields out of the public DTO and preserves discounts", async () => {
    request.mockResolvedValue({
      cartCreate: {
        cart: rawCart,
        userErrors: [],
        warnings: [{ message: "Quantity adjusted" }],
      },
    });
    const serverCart = await createCart("gid://shopify/ProductVariant/variant");
    const publicCart = toPublicCart(serverCart);
    expect(publicCart).not.toHaveProperty("id");
    expect(publicCart).not.toHaveProperty("checkoutUrl");
    expect(publicCart.discounts).toEqual([
      { label: "Launch", amount: { amount: "30", currencyCode: "ZAR" } },
    ]);
    expect(publicCart.message).toBe("Quantity adjusted");
  });
  it("rejects user errors even when Shopify also returns a cart", async () => {
    request.mockResolvedValue({
      cartCreate: {
        cart: rawCart,
        userErrors: [{ message: "Not available" }],
        warnings: [],
      },
    });
    await expect(
      createCart("gid://shopify/ProductVariant/variant"),
    ).rejects.toThrow("Shopify rejected");
  });
});
