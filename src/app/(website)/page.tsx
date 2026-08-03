import type { Metadata } from "next";

import { HoldingPage } from "@/components/holding-page";
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

export default async function HomePage() {
  const options = await getDynamicFetchOptions();
  const settings = await getSiteSettings(options);
  return <HoldingPage settings={settings} />;
}
