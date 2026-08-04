import type { Metadata } from "next";
import { Suspense } from "react";

import { HomeTemplate } from "@/components/templates/storefront-templates";
import { getCachedProducts } from "@/lib/shopify/cached-catalog";
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
    getCachedProducts().catch((error) => {
      console.error("Unable to load Shopify homepage products", error);
      return [];
    }),
    readCart(),
  ]);
  const products = catalogue.map(toProductCard);
  const heroImage = products.find((product) => product.image)?.image;

  return (
    <HomeTemplate
      products={products}
      heroImage={heroImage}
      cartCount={cart.totalQuantity}
      content={settings.homepage}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="bg-content-surface min-h-dvh" aria-busy="true" />
      }
    >
      <HomeContent />
    </Suspense>
  );
}
