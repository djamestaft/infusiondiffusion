import { isSanityConfigured } from "@/env";
import {
  sanityFetch,
  sanityFetchMetadata,
  type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { fallbackSiteSettings, type SiteSettings } from "@/sanity/types";

function withFallback(settings: Partial<SiteSettings> | null): SiteSettings {
  const homepage = Object.fromEntries(
    Object.entries(settings?.homepage ?? {}).filter(([key, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === "string") return value.trim().length > 0;
      if (key === "founderImage") {
        const image = value as { src?: string; alt?: string };
        return Boolean(image.src?.trim() && image.alt?.trim());
      }
      return true;
    }),
  ) as Partial<SiteSettings["homepage"]>;

  const providerHeroSlides = (settings?.homepage?.heroSlides ?? [])
    .filter((slide) =>
      Boolean(slide?.id && slide?.src?.trim() && slide?.alt?.trim()),
    )
    .slice(0, 3);
  homepage.heroSlides = providerHeroSlides.length
    ? providerHeroSlides.map((slide, index) => ({
        ...slide,
        fallbackSrc: fallbackSiteSettings.homepage.heroSlides[index]?.src,
        fallbackAlt: fallbackSiteSettings.homepage.heroSlides[index]?.alt,
      }))
    : fallbackSiteSettings.homepage.heroSlides;

  return {
    ...fallbackSiteSettings,
    ...(settings ?? {}),
    homepage: {
      ...fallbackSiteSettings.homepage,
      ...homepage,
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
