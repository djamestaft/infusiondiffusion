import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({
  cacheLife: vi.fn(),
  cacheTag: vi.fn(),
}));
vi.mock("@/lib/shopify/catalog", () => ({
  getProduct: vi.fn(),
  getProducts: vi.fn(),
}));

import { getProducts } from "@/lib/shopify/catalog";
import { ShopifyStorefrontError } from "@/lib/shopify/client";

import { getCachedHomepageProducts } from "./cached-catalog";

const mockedGetProducts = vi.mocked(getProducts);

describe("getCachedHomepageProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("returns Shopify catalogue data when the request succeeds", async () => {
    mockedGetProducts.mockResolvedValue([]);

    await expect(getCachedHomepageProducts()).resolves.toEqual([]);
    expect(mockedGetProducts).toHaveBeenCalledOnce();
  });

  it("returns the homepage fallback when Shopify is not configured", async () => {
    mockedGetProducts.mockRejectedValue(
      new ShopifyStorefrontError("not configured", "CONFIGURATION"),
    );

    await expect(getCachedHomepageProducts()).resolves.toEqual([]);
    expect(console.warn).toHaveBeenCalledWith(
      "Shopify Storefront API is not configured; rendering the homepage catalogue fallback.",
    );
    expect(console.error).not.toHaveBeenCalled();
  });
});
