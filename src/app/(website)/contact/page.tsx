import type { Metadata } from "next";
import { Suspense } from "react";

import {
  ContactLoadingTemplate,
  ContactTemplate,
} from "@/components/templates/storefront-templates";
import { readCart } from "@/lib/shopify/cart-session";
import {
  getContactPage,
  getContactPageMetadata,
} from "@/sanity/lib/editorial-pages";
import { getDynamicFetchOptions } from "@/sanity/lib/live";
import { getSiteSettings } from "@/sanity/lib/settings";

const fallbackEmail = "hello@infusiondiffusion.co.za";

export function safeContactEmail(value: string | null | undefined) {
  const email = value?.trim();
  return email &&
    /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+$/i.test(email)
    ? email
    : fallbackEmail;
}

export async function generateMetadata(): Promise<Metadata> {
  const { perspective } = await getDynamicFetchOptions();
  const page = await getContactPageMetadata(perspective);
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

export async function getContactPageData() {
  const options = await getDynamicFetchOptions();
  const [page, settings, cart] = await Promise.all([
    getContactPage(options),
    getSiteSettings(options),
    readCart(),
  ]);
  return {
    eyebrow: page.eyebrow,
    title: page.title,
    introduction: page.introduction,
    sections: page.sections,
    email: safeContactEmail(settings.contactEmail),
    cartCount: cart.totalQuantity,
  };
}

async function ContactContent() {
  return <ContactTemplate {...await getContactPageData()} />;
}

export default function ContactPage() {
  return (
    <Suspense fallback={<ContactLoadingTemplate />}>
      <ContactContent />
    </Suspense>
  );
}
