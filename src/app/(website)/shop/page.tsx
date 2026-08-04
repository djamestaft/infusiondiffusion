import type { Metadata } from "next";
import { connection } from "next/server";

import { CollectionTemplate } from "@/components/templates/storefront-templates";
import { getCachedProducts } from "@/lib/shopify/cached-catalog";
import { toProductCard } from "@/lib/shopify/presentation";
import { readCart } from "@/lib/shopify/cart-session";

export const metadata: Metadata = {
  title: "Shop home fragrance | Infusion Diffusion",
  description:
    "Shop Infusion Diffusion home fragrance, with current catalogue pricing and availability.",
};

export default async function ShopPage() {
  await connection();
  const [catalogue, cart] = await Promise.all([
    getCachedProducts(),
    readCart(),
  ]);
  const products = catalogue.map(toProductCard);
  return (
    <CollectionTemplate
      products={products}
      title="The collection"
      description="Considered home fragrance, with current catalogue pricing and availability."
      cartCount={cart.totalQuantity}
    />
  );
}
