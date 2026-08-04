import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { getProduct, getProducts } from "@/lib/shopify/catalog";
import { ShopifyStorefrontError } from "@/lib/shopify/client";
import { shopifyE2EProducts } from "@/lib/shopify/e2e-fixtures";

const useE2EFixtures =
  process.env.NODE_ENV === "development" &&
  process.env.CI === "true" &&
  process.env.SHOPIFY_E2E_FIXTURES === "1";

export async function getCachedProducts() {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 900 });
  cacheTag("shopify:products");
  if (useE2EFixtures) return shopifyE2EProducts;
  return getProducts();
}

export async function getCachedHomepageProducts() {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 900 });
  cacheTag("shopify:products");
  if (useE2EFixtures) return shopifyE2EProducts;
  try {
    return await getProducts();
  } catch (error) {
    if (
      error instanceof ShopifyStorefrontError &&
      error.code === "CONFIGURATION"
    ) {
      console.warn(
        "Shopify Storefront API is not configured; rendering the homepage catalogue fallback.",
      );
      return [];
    }
    console.error("Unable to load Shopify homepage products", error);
    return [];
  }
}

export async function getCachedProduct(handle: string) {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 900 });
  cacheTag("shopify:products", `shopify:product:${handle}`);
  if (useE2EFixtures)
    return (
      shopifyE2EProducts.find((product) => product.handle === handle) ?? null
    );
  try {
    return await getProduct(handle);
  } catch (error) {
    if (error instanceof ShopifyStorefrontError && error.code === "NOT_FOUND")
      return null;
    throw error;
  }
}
