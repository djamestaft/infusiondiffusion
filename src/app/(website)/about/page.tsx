import type { Metadata } from "next";
import { Suspense } from "react";

import { CombinedAboutTemplate } from "@/components/templates/combined-about";
import { cartNavigationCount } from "@/lib/shopify/cart-contract";
import { readCart } from "@/lib/shopify/cart-session";
import {
  getAboutPage,
  getAboutPageMetadata,
  getGalleryPage,
} from "@/sanity/lib/editorial-pages";
import { getSiteSettings } from "@/sanity/lib/settings";
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
  const [page, gallery, settings, cart] = await Promise.all([
    getAboutPage(options),
    getGalleryPage(options),
    getSiteSettings(options),
    readCart(),
  ]);
  return (
    <CombinedAboutTemplate
      page={page}
      gallery={gallery}
      heroImage={settings.homepage.heroSlides[0]}
      bornStory={settings.homepage.founderStory}
      cartCount={cartNavigationCount(cart)}
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
