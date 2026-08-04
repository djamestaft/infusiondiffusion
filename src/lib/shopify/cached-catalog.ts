import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { getProduct, getProducts } from "@/lib/shopify/catalog";
import { ShopifyStorefrontError } from "@/lib/shopify/client";

export async function getCachedProducts() {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 900 });
  cacheTag("shopify:products");
  return getProducts();
}

export async function getCachedProduct(handle: string) {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 900 });
  cacheTag("shopify:products", `shopify:product:${handle}`);
  try {
    return await getProduct(handle);
  } catch (error) {
    if (error instanceof ShopifyStorefrontError && error.code === "NOT_FOUND")
      return null;
    throw error;
  }
}
