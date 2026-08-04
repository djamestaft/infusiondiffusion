import { describe, expect, it } from "vitest";

import {
  isValidCartLineId,
  isValidCartQuantity,
  isValidMerchandiseId,
} from "@/lib/shopify/cart-identifiers";

describe("Shopify cart mutation identifiers", () => {
  it("accepts Shopify's opaque cart-line query suffix", () => {
    expect(
      isValidCartLineId(
        "gid://shopify/CartLine/5ac152b7-e3b6-48e2-8980-71116d95a251?cart=hWNFGwKJeQf5dRBTgPZ3hyUM",
      ),
    ).toBe(true);
  });

  it.each([
    "gid://shopify/CartLine/line with spaces",
    "gid://shopify/CartLine/line?cart=has spaces",
    "gid://shopify/ProductVariant/123",
    "https://example.com/line",
  ])("rejects an invalid cart-line ID: %s", (value) => {
    expect(isValidCartLineId(value)).toBe(false);
  });

  it("keeps merchandise IDs and quantities narrowly bounded", () => {
    expect(
      isValidMerchandiseId("gid://shopify/ProductVariant/50806635888926"),
    ).toBe(true);
    expect(
      isValidMerchandiseId("gid://shopify/ProductVariant/1?cart=secret"),
    ).toBe(false);
    expect(isValidCartQuantity(1)).toBe(true);
    expect(isValidCartQuantity(99)).toBe(true);
    expect(isValidCartQuantity(0)).toBe(false);
    expect(isValidCartQuantity(1.5)).toBe(false);
  });
});
