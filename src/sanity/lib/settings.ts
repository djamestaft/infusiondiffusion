import { isSanityConfigured } from "@/env";
import {
  sanityFetch,
  sanityFetchMetadata,
  type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { fallbackSiteSettings, type SiteSettings } from "@/sanity/types";

function withFallback(settings: Partial<SiteSettings> | null): SiteSettings {
  return {
    ...fallbackSiteSettings,
    ...(settings ?? {}),
    homepage: {
      ...fallbackSiteSettings.homepage,
      ...(settings?.homepage ?? {}),
    },
  };
}

export async function getSiteSettings(
  options: DynamicFetchOptions,
): Promise<SiteSettings> {
  "use cache";

  if (!isSanityConfigured) return fallbackSiteSettings;

  try {
    const { data } = await sanityFetch({
      query: SITE_SETTINGS_QUERY,
      ...options,
    });
    return withFallback(data as Partial<SiteSettings> | null);
  } catch (error) {
    console.error("Unable to load Sanity site settings", error);
    return fallbackSiteSettings;
  }
}

export async function getSiteSettingsMetadata(
  perspective: DynamicFetchOptions["perspective"],
): Promise<SiteSettings> {
  if (!isSanityConfigured) return fallbackSiteSettings;

  try {
    const { data } = await sanityFetchMetadata({
      query: SITE_SETTINGS_QUERY,
      perspective,
    });
    return withFallback(data as Partial<SiteSettings> | null);
  } catch (error) {
    console.error("Unable to load Sanity site settings metadata", error);
    return fallbackSiteSettings;
  }
}
