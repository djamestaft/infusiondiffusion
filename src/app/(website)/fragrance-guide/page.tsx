import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";

import { FragranceGuideTemplate } from "@/components/templates/fragrance-guide";
import { cartNavigationCount } from "@/lib/shopify/cart-contract";
import { readCart } from "@/lib/shopify/cart-session";
import { getGuideProducts } from "@/lib/fragrance-guide/catalog";
import { absoluteStorefrontTitle, storefrontTitle } from "@/lib/metadata-title";
import { getFragranceGuideMetadata } from "@/sanity/lib/editorial-pages";
import { getDynamicFetchOptions } from "@/sanity/lib/live";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const page = await getFragranceGuideMetadata(perspective);
  return {
    title: absoluteStorefrontTitle(page.seoTitle),
    description: page.seoDescription,
    openGraph: {
      title: storefrontTitle(page.seoTitle),
      description: page.seoDescription,
      locale: "en_ZA",
      type: "article",
    },
  };
}

async function FragranceGuideContent() {
  await connection();
  const [cart, products] = await Promise.all([readCart(), getGuideProducts()]);

  return (
    <FragranceGuideTemplate
      cartCount={cartNavigationCount(cart)}
      products={products}
    />
  );
}

export default function FragranceGuidePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-content-surface min-h-dvh" aria-busy="true" />
      }
    >
      <FragranceGuideContent />
    </Suspense>
  );
}
