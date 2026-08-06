import type { Metadata } from "next";
import { Suspense } from "react";

import { AboutTemplate } from "@/components/templates/storefront-templates";
import { readCart } from "@/lib/shopify/cart-session";
import {
  getAboutPage,
  getAboutPageMetadata,
} from "@/sanity/lib/editorial-pages";
import { getDynamicFetchOptions } from "@/sanity/lib/live";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const page = await getAboutPageMetadata(perspective);
  return {
    title: { absolute: page.seoTitle },
    description: page.seoDescription,
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      locale: "en_ZA",
      type: "article",
    },
  };
}

async function AboutContent() {
  const options = await getDynamicFetchOptions();
  const [page, cart] = await Promise.all([getAboutPage(options), readCart()]);
  return (
    <AboutTemplate
      title={page.title}
      introduction={page.introduction}
      chapters={page.chapters}
      cartCount={cart.totalQuantity}
    />
  );
}

export default function AboutPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-content-surface min-h-dvh" aria-busy="true" />
      }
    >
      <AboutContent />
    </Suspense>
  );
}
