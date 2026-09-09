import type { Metadata } from "next";
import { Suspense } from "react";

import { FragranceGuideTemplate } from "@/components/templates/fragrance-guide";
import { readCart } from "@/lib/shopify/cart-session";
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
  const cart = await readCart();

  return <FragranceGuideTemplate cartCount={cart.totalQuantity} />;
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
