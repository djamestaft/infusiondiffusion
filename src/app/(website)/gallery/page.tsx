import type { Metadata } from "next";
import { Suspense } from "react";

import {
  GalleryLoadingTemplate,
  GalleryTemplate,
} from "@/components/templates/storefront-templates";
import { readCart } from "@/lib/shopify/cart-session";
import {
  getGalleryPage,
  getGalleryPageMetadata,
} from "@/sanity/lib/editorial-pages";
import { getDynamicFetchOptions } from "@/sanity/lib/live";

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const page = await getGalleryPageMetadata(perspective);
  return {
    title: { absolute: page.seoTitle },
    description: page.seoDescription,
    openGraph: {
      title: page.seoTitle,
      description: page.seoDescription,
      locale: "en_ZA",
      type: "website",
    },
  };
}

async function GalleryContent() {
  const options = await getDynamicFetchOptions();
  const [page, cart] = await Promise.all([getGalleryPage(options), readCart()]);
  return <GalleryTemplate {...page} cartCount={cart.totalQuantity} />;
}

export default function GalleryPage() {
  return (
    <Suspense fallback={<GalleryLoadingTemplate />}>
      <GalleryContent />
    </Suspense>
  );
}
