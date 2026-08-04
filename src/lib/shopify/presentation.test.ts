import { describe, expect, it } from "vitest";

import { toProductCard, toProductDetails } from "@/lib/shopify/presentation";
import type { ShopifyProduct } from "@/lib/shopify/types";

const product: ShopifyProduct = {
  id: "gid://shopify/Product/1",
  handle: "bois-de-santal-200ml",
  title: "Bois De Santal - 200ml",
  description: "A warm sandalwood fragrance. A longer description follows.",
  vendor: "InfusionDiffusion",
  availableForSale: true,
  featuredImage: { url: "https://cdn.shopify.com/product.png" },
  priceRange: {
    min: { amount: "430.0", currencyCode: "ZAR" },
    max: { amount: "430.0", currencyCode: "ZAR" },
  },
  variants: [
    {
      id: "gid://shopify/ProductVariant/1",
      title: "Default Title",
      availableForSale: true,
      price: { amount: "430.0", currencyCode: "ZAR" },
      selectedOptions: [{ name: "Title", value: "Default Title" }],
    },
  ],
  seo: {},
  images: [],
  collections: [],
};

describe("Shopify presentation adapter", () => {
  it("maps Shopify truth into the existing ProductCard contract", () => {
    expect(toProductCard(product)).toMatchObject({
      href: "/products/bois-de-santal-200ml",
      name: "Bois De Santal",
      format: "200ml",
      notes: "A warm sandalwood fragrance.",
      price: { amount: "430.0", currencyCode: "ZAR" },
      availability: "in-stock",
      image: { alt: "Bois De Santal product image" },
    });
  });

  it("hides Shopify Default Title while preserving meaningful variants", () => {
    expect(toProductDetails(product).variants).toEqual([]);
    const result = toProductDetails({
      ...product,
      variants: [
        { ...product.variants[0], id: "one", title: "200ml" },
        {
          ...product.variants[0],
          id: "two",
          title: "Refill",
          availableForSale: false,
        },
      ],
    });
    expect(result.variants).toEqual([
      { id: "one", label: "200ml", available: true },
      { id: "two", label: "Refill", available: false },
    ]);
    expect(result.details).toEqual(
      expect.arrayContaining([
        { label: "Available formats", value: "200ml" },
        { label: "Unavailable", value: "Refill" },
      ]),
    );
  });

  it("does not invent absent catalogue details", () => {
    const result = toProductDetails({
      ...product,
      title: "Untitled fragrance",
      description: "",
      vendor: undefined,
      featuredImage: undefined,
    });
    expect(result.card.image).toBeUndefined();
    expect(result.card.notes).toBe("Fragrance details coming soon");
    expect(result.details).toEqual([]);
  });

  it("pairs a sale compare-at price with the displayed minimum-price variant", () => {
    const expensive = {
      ...product.variants[0],
      id: "expensive",
      price: { amount: "500.0", currencyCode: "ZAR" },
      compareAtPrice: { amount: "550.0", currencyCode: "ZAR" },
    };
    const minimum = {
      ...product.variants[0],
      id: "minimum",
      price: { amount: "430.0", currencyCode: "ZAR" },
      compareAtPrice: { amount: "480.0", currencyCode: "ZAR" },
    };
    expect(
      toProductCard({ ...product, variants: [expensive, minimum] })
        .compareAtPrice,
    ).toEqual({ amount: "480.0", currencyCode: "ZAR" });
  });
});
