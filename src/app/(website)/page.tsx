import type { Metadata } from "next";
import { Suspense } from "react";

import {
  HomeTemplate,
  StorefrontLoadingTemplate,
} from "@/components/templates/storefront-templates";
import { getCachedHomepageProducts } from "@/lib/shopify/cached-catalog";
import { readCart } from "@/lib/shopify/cart-session";
import { toProductCard } from "@/lib/shopify/presentation";
import { getDynamicFetchOptions } from "@/sanity/lib/live";
import {
  getSiteSettings,
  getSiteSettingsMetadata,
} from "@/sanity/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const settings = await getSiteSettingsMetadata(perspective);
  return {
    title: settings.seoTitle,
    description: settings.seoDescription,
    openGraph: {
      title: settings.seoTitle,
      description: settings.seoDescription,
      locale: "en_ZA",
      type: "website",
    },
  };
}

async function HomeContent() {
  const options = await getDynamicFetchOptions();
  const [settings, catalogue, cart] = await Promise.all([
    getSiteSettings(options),
    getCachedHomepageProducts(),
    readCart(),
  ]);
  const products = catalogue.map(toProductCard);
  const heroImage = products.find((product) => product.image)?.image;

  return (
    <HomeTemplate
      products={products}
      heroImage={heroImage}
      heroSlides={settings.homepage.heroSlides}
      founderImage={settings.homepage.founderImage}
      cartCount={cart.totalQuantity}
      content={settings.homepage}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<StorefrontLoadingTemplate kind="home" />}>
      <HomeContent />
    </Suspense>
  );
}
