import { isSanityConfigured } from "@/env";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { fallbackSiteSettings, type SiteSettings } from "@/sanity/types";

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSanityConfigured) return fallbackSiteSettings;

  try {
    const { data } = await sanityFetch({ query: SITE_SETTINGS_QUERY });
    const settings = data as Partial<SiteSettings> | null;
    return { ...fallbackSiteSettings, ...(settings ?? {}) };
  } catch (error) {
    console.error("Unable to load Sanity site settings", error);
    return fallbackSiteSettings;
  }
}
