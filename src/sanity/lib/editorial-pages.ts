import {
  approvedEditorialImage,
  approvedGalleryItems,
} from "@/content/storefront-media";
import { isSanityConfigured } from "@/env";
import {
  sanityFetch,
  sanityFetchMetadata,
  type DynamicFetchOptions,
} from "@/sanity/lib/live";
import type { GALLERY_PAGE_QUERY_RESULT } from "@/sanity/generated";
import { EDITORIAL_PAGE_QUERY, GALLERY_PAGE_QUERY } from "@/sanity/lib/queries";

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

export const fallbackContactPage: EditorialPage = {
  eyebrow: "",
  title: "Let’s talk fragrance.",
  introduction:
    "Questions about scent, care, delivery, or choosing a room fragrance? Email us directly and we’ll help you find the clearest next step.",
  sections: [
    {
      heading: "Before you write",
      body: "Include the product or fragrance name when it helps explain your question. Do not send payment details or other sensitive information by email.",
    },
  ],
  seoTitle: "Contact | Infusion Diffusion",
  seoDescription:
    "Questions about scent, care, delivery, or choosing a room fragrance? Email us directly and we’ll help you find the clearest next step.",
};

export const fallbackFragranceGuide: EditorialPage = {
  eyebrow: "Fragrance guide",
  image: approvedEditorialImage,
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
export function getContactPage(options: DynamicFetchOptions) {
  return fetchEditorialPage("contact", options, fallbackContactPage);
}

export async function getContactPageMetadata(
  perspective: DynamicFetchOptions["perspective"],
) {
  if (!isSanityConfigured) return fallbackContactPage;
  try {
    const { data } = await sanityFetchMetadata({
      query: EDITORIAL_PAGE_QUERY,
      params: { slug: "contact" },
      perspective,
    });
    return withEditorialFallback(
      data as EditorialPageInput | null,
      fallbackContactPage,
    );
  } catch {
    console.error("Unable to load Sanity contact metadata");
    return fallbackContactPage;
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

export type GalleryGroup = "campaign" | "market";
export type GalleryItem = {
  id: string;
  title: string;
  caption: string;
  image: {
    src: string;
    alt: string;
    hotspot?: { x: number; y: number };
    crop?: { left: number; top: number; right: number; bottom: number };
    dimensions?: { width: number; height: number; aspectRatio: number };
  };
};
export type GalleryPage = {
  title: string;
  introduction: string;
  closingLine: string;
  campaignItems: GalleryItem[];
  marketItems: GalleryItem[];
  seoTitle: string;
  seoDescription: string;
  unavailable: boolean;
};

export const malformedGalleryCaption =
  "Additional details are unavailable for this image.";
export const fallbackGalleryPage: GalleryPage = {
  title: "Rooms, composed in scent",
  introduction:
    "A study in fragrance, vessel and atmosphere — moments gathered from lived-in rooms.",
  closingLine: "Every room carries its own atmosphere.",
  campaignItems: approvedGalleryItems.slice(0, 3),
  marketItems: approvedGalleryItems.slice(3),
  seoTitle: "Gallery | Infusion Diffusion",
  seoDescription:
    "Explore Infusion Diffusion fragrance, vessel and atmosphere studies from lived-in rooms.",
  unavailable: false,
};

export function withGalleryFallback(
  page: GALLERY_PAGE_QUERY_RESULT,
  unavailable = false,
): GalleryPage {
  const items = (page?.sections ?? [])
    .flatMap((section) => {
      if (!section) return [];
      const id = section._key?.trim();
      const title = section.heading?.trim();
      const src = section.image?.src?.trim();
      const alt = section.image?.alt?.trim();
      const authoredGroup = section.galleryGroup;
      const group: GalleryGroup | undefined =
        authoredGroup == null
          ? "campaign"
          : authoredGroup === "campaign" || authoredGroup === "market"
            ? authoredGroup
            : undefined;
      if (
        !id ||
        !title ||
        !src ||
        !alt ||
        !group ||
        !section.image?.storefrontRightsConfirmed
      ) {
        return [];
      }
      const hotspot = normalizeHotspot(section.image.hotspot);
      const crop = normalizeCrop(section.image.crop);
      const dimensions = normalizeDimensions(section.image.dimensions);
      return [
        {
          group,
          item: {
            id,
            title,
            caption: section.body?.trim() || malformedGalleryCaption,
            image: { src, alt, hotspot, crop, dimensions },
          },
        },
      ];
    })
    .slice(0, 10);
  const fallbackItems = !page && unavailable ? approvedGalleryItems : [];
  return {
    title: text(page?.title, fallbackGalleryPage.title),
    introduction: text(page?.introduction, fallbackGalleryPage.introduction),
    closingLine: fallbackGalleryPage.closingLine,
    campaignItems: items.length
      ? items
          .filter(({ group }) => group === "campaign")
          .map(({ item }) => item)
      : fallbackItems.slice(0, 3),
    marketItems: items.length
      ? items.filter(({ group }) => group === "market").map(({ item }) => item)
      : fallbackItems.slice(3),
    seoTitle: text(page?.seoTitle, fallbackGalleryPage.seoTitle),
    seoDescription: text(
      page?.seoDescription,
      fallbackGalleryPage.seoDescription,
    ),
    unavailable,
  };
}

export async function getGalleryPage(options: DynamicFetchOptions) {
  "use cache";
  if (!isSanityConfigured) return fallbackGalleryPage;
  try {
    const { data } = await sanityFetch({
      query: GALLERY_PAGE_QUERY,
      ...options,
    });
    return withGalleryFallback(data as GALLERY_PAGE_QUERY_RESULT);
  } catch (error) {
    console.error("Unable to load Sanity gallery page", error);
    return withGalleryFallback(null, true);
  }
}
export async function getGalleryPageMetadata(
  perspective: DynamicFetchOptions["perspective"],
) {
  if (!isSanityConfigured) return fallbackGalleryPage;
  try {
    const { data } = await sanityFetchMetadata({
      query: GALLERY_PAGE_QUERY,
      perspective,
    });
    return withGalleryFallback(data as GALLERY_PAGE_QUERY_RESULT);
  } catch {
    console.error("Unable to load Sanity gallery metadata");
    return fallbackGalleryPage;
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
function normalizeDimensions(
  dimensions:
    | {
        width?: number | null;
        height?: number | null;
        aspectRatio?: number | null;
      }
    | null
    | undefined,
) {
  const { width, height, aspectRatio } = dimensions ?? {};
  if (
    typeof width !== "number" ||
    !Number.isFinite(width) ||
    width <= 0 ||
    typeof height !== "number" ||
    !Number.isFinite(height) ||
    height <= 0
  ) {
    return undefined;
  }
  return {
    width,
    height,
    aspectRatio:
      typeof aspectRatio === "number" &&
      Number.isFinite(aspectRatio) &&
      aspectRatio > 0
        ? aspectRatio
        : width / height,
  };
}

function normalizeCrop(
  crop:
    | { left?: number; top?: number; right?: number; bottom?: number }
    | null
    | undefined,
) {
  const { left, top, right, bottom } = crop ?? {};
  const valid = [left, top, right, bottom].every(
    (value) =>
      typeof value === "number" &&
      Number.isFinite(value) &&
      value >= 0 &&
      value < 1,
  );
  return valid && left! + right! < 1 && top! + bottom! < 1
    ? { left: left!, top: top!, right: right!, bottom: bottom! }
    : undefined;
}

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
