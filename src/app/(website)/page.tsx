import type { Metadata } from "next";

import { HoldingPage } from "@/components/holding-page";
import { getSiteSettings } from "@/sanity/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
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

export default async function HomePage() {
  const settings = await getSiteSettings();
  return <HoldingPage settings={settings} />;
}
