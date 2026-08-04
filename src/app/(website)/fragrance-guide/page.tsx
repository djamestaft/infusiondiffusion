import type { Metadata } from "next";
import { Suspense } from "react";

import { EditorialTemplate } from "@/components/templates/storefront-templates";
import { getCachedHomepageProducts } from "@/lib/shopify/cached-catalog";
import { readCart } from "@/lib/shopify/cart-session";
import { toProductCard } from "@/lib/shopify/presentation";
import {
  getFragranceGuide,
  getFragranceGuideMetadata,
} from "@/sanity/lib/editorial-pages";
import { getDynamicFetchOptions } from "@/sanity/lib/live";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const page = await getFragranceGuideMetadata(perspective);
  return {
    title: page.seoTitle,
    description: page.seoDescription,
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      locale: "en_ZA",
      type: "article",
    },
  };
}

async function FragranceGuideContent() {
  const options = await getDynamicFetchOptions();
  const [page, catalogue, cart] = await Promise.all([
    getFragranceGuide(options),
    getCachedHomepageProducts(),
    readCart(),
  ]);
  const provisionalImage = catalogue
    .map(toProductCard)
    .find((item) => item.image)?.image;

  return (
    <EditorialTemplate
      eyebrow={page.eyebrow}
      title={page.title}
      introduction={page.introduction}
      image={page.image ?? provisionalImage}
      sections={page.sections}
      currentHref="/fragrance-guide"
      cartCount={cart.totalQuantity}
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
