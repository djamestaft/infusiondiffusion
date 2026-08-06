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

const text = (value: string | null | undefined, fallback: string) =>
  value?.trim() || fallback;
export function withEditorialFallback(
  page: EditorialPageInput | null,
  fallback: EditorialPage,
): EditorialPage {
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

export type AboutChapterRole =
  "origin" | "development" | "collaborator" | "principles";
export type AboutPortrait = {
  src: string;
  alt: string;
  hotspot?: { x?: number; y?: number };
};
export type AboutPage = {
  title: string;
  introduction: string;
  chapters: Array<{
    role: AboutChapterRole;
    heading: string;
    body: string;
    image?: AboutPortrait;
  }>;
  seoTitle: string;
  seoDescription: string;
};
const aboutRoles: AboutChapterRole[] = [
  "origin",
  "development",
  "collaborator",
  "principles",
];
export const fallbackAboutPage: AboutPage = {
  title: "The story behind the atmosphere.",
  introduction:
    "A considered collection shaped by a lasting fascination with fragrance, refined for the rooms we live in.",
  chapters: [
    {
      role: "origin",
      heading: "Born from fragrance",
      body: "Infusion Diffusion began with a lifelong affair with fragrance, luxury and scent’s power to turn a space into a feeling.",
    },
    {
      role: "development",
      heading: "From more than 130 oils to six fragrances",
      body: "More than 130 fragrance oils sourced from around the world were explored before the collection was refined to six distinctive room fragrances. The result is a focused cabinet of atmosphere: clear enough to choose with confidence, expressive enough to change the feeling of a room.",
    },
    {
      role: "collaborator",
      heading: "Guidance and encouragement",
      body: "The collection was created with the guidance and encouragement of Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts.",
    },
    {
      role: "principles",
      heading: "Composed for lived-in rooms",
      body: "Infusion Diffusion treats scent as a considered part of an interior. Each fragrance is presented with clarity, restraint and a belief that luxury is earned through material detail, proportion and trust.",
    },
  ],
  seoTitle: "About Infusion Diffusion | Infusion Diffusion",
  seoDescription:
    "Discover the Infusion Diffusion story, from more than 130 fragrance oils to six fragrances composed for lived-in rooms.",
};
type AboutInput = {
  title?: string | null;
  introduction?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  sections?: Array<{
    role?: string | null;
    heading?: string | null;
    body?: string | null;
    image?: {
      src?: string | null;
      alt?: string | null;
      storefrontRightsConfirmed?: boolean | null;
      hotspot?: { x?: number; y?: number } | null;
    } | null;
  } | null> | null;
};
function normalizeHotspot(
  hotspot: { x?: number; y?: number } | null | undefined,
) {
  return typeof hotspot?.x === "number" &&
    Number.isFinite(hotspot.x) &&
    hotspot.x >= 0 &&
    hotspot.x <= 1 &&
    typeof hotspot?.y === "number" &&
    Number.isFinite(hotspot.y) &&
    hotspot.y >= 0 &&
    hotspot.y <= 1
    ? { x: hotspot.x, y: hotspot.y }
    : { x: 0.5, y: 0.5 };
}

export function withAboutFallback(page: AboutInput | null): AboutPage {
  const sections = page?.sections ?? [];
  return {
    title: text(page?.title, fallbackAboutPage.title),
    introduction: text(page?.introduction, fallbackAboutPage.introduction),
    chapters: aboutRoles.map((role) => {
      const fallback = fallbackAboutPage.chapters.find(
        (chapter) => chapter.role === role,
      )!;
      const authored = sections.find((section) => section?.role === role);
      const image =
        authored?.image?.src &&
        authored.image.alt?.trim() &&
        authored.image.storefrontRightsConfirmed
          ? {
              src: authored.image.src,
              alt: authored.image.alt.trim(),
              hotspot: normalizeHotspot(authored.image.hotspot),
            }
          : undefined;
      return {
        ...fallback,
        heading: text(authored?.heading, fallback.heading),
        body: text(authored?.body, fallback.body),
        image,
      };
    }),
    seoTitle: text(page?.seoTitle, fallbackAboutPage.seoTitle),
    seoDescription: text(
      page?.seoDescription,
      fallbackAboutPage.seoDescription,
    ),
  };
}
export async function getAboutPage(options: DynamicFetchOptions) {
  if (!isSanityConfigured) return fallbackAboutPage;
  try {
    const { data } = await sanityFetch({
      query: EDITORIAL_PAGE_QUERY,
      params: { slug: "about" },
      ...options,
    });
    return withAboutFallback(data as AboutInput | null);
  } catch {
    console.error("Unable to load Sanity About page");
    return fallbackAboutPage;
  }
}
export async function getAboutPageMetadata(
  perspective: DynamicFetchOptions["perspective"],
) {
  if (!isSanityConfigured) return fallbackAboutPage;
  try {
    const { data } = await sanityFetchMetadata({
      query: EDITORIAL_PAGE_QUERY,
      params: { slug: "about" },
      perspective,
    });
    return withAboutFallback(data as AboutInput | null);
  } catch {
    console.error("Unable to load Sanity About metadata");
    return fallbackAboutPage;
  }
}
