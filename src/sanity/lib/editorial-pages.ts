import { isSanityConfigured } from "@/env";
import {
  sanityFetch,
  sanityFetchMetadata,
  type DynamicFetchOptions,
} from "@/sanity/lib/live";
import { EDITORIAL_PAGE_QUERY } from "@/sanity/lib/queries";

export type EditorialPage = {
  eyebrow: string;
  title: string;
  introduction: string;
  image?: { src: string; alt: string };
  sections: Array<{ heading: string; body: string }>;
  seoTitle: string;
  seoDescription: string;
};

type EditorialPageInput = {
  eyebrow?: string | null;
  title?: string | null;
  introduction?: string | null;
  image?: { src?: string | null; alt?: string | null } | null;
  sections?: Array<{
    heading?: string | null;
    body?: string | null;
  } | null> | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export const fallbackFragranceGuide: EditorialPage = {
  eyebrow: "Fragrance guide",
  title: "A practical guide to choosing home fragrance",
  introduction:
    "Choose a scent by paying attention to the room, the time of day and the atmosphere you want to return to.",
  sections: [
    {
      heading: "Begin with the room",
      body: "Start with how the room is used. Bright citrus, green herbs and dry woods can keep active spaces feeling clear, while softer woods and florals suit rooms made for rest.",
    },
    {
      heading: "Then choose the feeling",
      body: "Amber, resin and sandalwood bring warmth and depth. White florals soften a room. Smoke and spice add presence when you want the fragrance to feel more enveloping.",
    },
    {
      heading: "Let the format set the rhythm",
      body: "A diffuser creates a steady background, a candle marks out a shorter ritual, and a room spray offers an immediate change. Choose the format that fits how often you use the room and how present you want the scent to feel.",
    },
    {
      heading: "Read the notes plainly",
      body: "Compare the listed notes before choosing. The opening notes shape the first impression, while woods, amber and resin often give a fragrance its lasting character.",
    },
  ],
  seoTitle: "A practical home fragrance guide | Infusion Diffusion",
  seoDescription:
    "Choose home fragrance by room, atmosphere, scent notes, and format with this practical Infusion Diffusion guide.",
};

export function withEditorialFallback(
  page: EditorialPageInput | null,
  fallback: EditorialPage,
): EditorialPage {
  const text = (value: string | null | undefined, fallbackValue: string) =>
    value?.trim() || fallbackValue;
  const sections = page?.sections
    ?.filter((section): section is { heading: string; body: string } =>
      Boolean(section?.heading?.trim() && section.body?.trim()),
    )
    .map((section) => ({
      heading: section.heading.trim(),
      body: section.body.trim(),
    }));
  const image =
    page?.image?.src && page.image.alt?.trim()
      ? { src: page.image.src, alt: page.image.alt.trim() }
      : fallback.image;

  return {
    eyebrow: text(page?.eyebrow, fallback.eyebrow),
    title: text(page?.title, fallback.title),
    introduction: text(page?.introduction, fallback.introduction),
    image,
    sections: sections?.length ? sections : fallback.sections,
    seoTitle: text(page?.seoTitle, fallback.seoTitle),
    seoDescription: text(page?.seoDescription, fallback.seoDescription),
  };
}

async function fetchEditorialPage(
  slug: string,
  options: DynamicFetchOptions,
  fallback: EditorialPage,
) {
  "use cache";

  if (!isSanityConfigured) return fallback;
  try {
    const { data } = await sanityFetch({
      query: EDITORIAL_PAGE_QUERY,
      params: { slug },
      ...options,
    });
    return withEditorialFallback(data as EditorialPageInput | null, fallback);
  } catch (error) {
    console.error(`Unable to load Sanity editorial page: ${slug}`, error);
    return fallback;
  }
}

export function getFragranceGuide(options: DynamicFetchOptions) {
  return fetchEditorialPage("fragrance-guide", options, fallbackFragranceGuide);
}

export async function getFragranceGuideMetadata(
  perspective: DynamicFetchOptions["perspective"],
) {
  if (!isSanityConfigured) return fallbackFragranceGuide;
  try {
    const { data } = await sanityFetchMetadata({
      query: EDITORIAL_PAGE_QUERY,
      params: { slug: "fragrance-guide" },
      perspective,
    });
    return withEditorialFallback(
      data as EditorialPageInput | null,
      fallbackFragranceGuide,
    );
  } catch (error) {
    console.error("Unable to load Sanity fragrance guide metadata", error);
    return fallbackFragranceGuide;
  }
}
