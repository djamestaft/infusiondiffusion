import { describe, expect, it, vi } from "vitest";

import type { GALLERY_PAGE_QUERY_RESULT } from "@/sanity/generated";

vi.mock("@/env", () => ({ isSanityConfigured: false }));
vi.mock("@/sanity/lib/live", () => ({
  sanityFetch: vi.fn(),
  sanityFetchMetadata: vi.fn(),
}));

import {
  fallbackContactPage,
  fallbackFragranceGuide,
  withEditorialFallback,
  fallbackAboutPage,
  withAboutFallback,
  malformedGalleryCaption,
  withGalleryFallback,
} from "@/sanity/lib/editorial-pages";

describe("editorial page fallbacks", () => {
  it("uses complete Contact content when Sanity has no document", () => {
    expect(withEditorialFallback(null, fallbackContactPage)).toEqual(
      fallbackContactPage,
    );
  });

  it("restores blank Contact fields and sections from the approved fallback", () => {
    expect(
      withEditorialFallback(
        {
          title: " ",
          introduction: null,
          sections: [{ heading: "", body: "" }],
        },
        fallbackContactPage,
      ),
    ).toEqual(fallbackContactPage);
  });

  it("uses complete guide content when Sanity has no document", () => {
    expect(withEditorialFallback(null, fallbackFragranceGuide)).toEqual(
      fallbackFragranceGuide,
    );
  });

  it("preserves fallback sections when an editor has not added any", () => {
    const page = withEditorialFallback(
      {
        title: "A title from Sanity",
        sections: [],
        image: { src: "https://cdn.sanity.io/image.jpg", alt: "" },
      },
      fallbackFragranceGuide,
    );

    expect(page.title).toBe("A title from Sanity");
    expect(page.sections).toEqual(fallbackFragranceGuide.sections);
    expect(page.image).toBeUndefined();
  });

  it("uses an editor-provided image only when it has alternative text", () => {
    const image = {
      src: "https://cdn.sanity.io/images/project/dataset/image.jpg",
      alt: "A black diffuser vessel on a dark table",
    };

    expect(
      withEditorialFallback({ image }, fallbackFragranceGuide).image,
    ).toEqual(image);
  });

  it("restores copy and metadata omitted from a partial draft", () => {
    const page = withEditorialFallback(
      {
        eyebrow: null,
        title: "   ",
        introduction: null,
        seoTitle: null,
        seoDescription: "",
        sections: [{ heading: "", body: null }, null],
      },
      fallbackFragranceGuide,
    );

    expect(page).toEqual(fallbackFragranceGuide);
  });

  it("trims valid editor-managed scalar and section content", () => {
    const page = withEditorialFallback(
      {
        eyebrow: "  Journal  ",
        title: "  Choosing well  ",
        introduction: "  A useful introduction.  ",
        seoTitle: "  Guide SEO  ",
        seoDescription: "  Guide description.  ",
        sections: [{ heading: "  Begin here  ", body: "  Useful guidance.  " }],
      },
      fallbackFragranceGuide,
    );

    expect(page).toMatchObject({
      eyebrow: "Journal",
      title: "Choosing well",
      introduction: "A useful introduction.",
      seoTitle: "Guide SEO",
      seoDescription: "Guide description.",
      sections: [{ heading: "Begin here", body: "Useful guidance." }],
    });
  });
});

const galleryInput = (sections: unknown) =>
  ({ sections }) as GALLERY_PAGE_QUERY_RESULT;

describe("gallery page normalization", () => {
  it("keeps only rights-confirmed complete items in authored order and trims captions", () => {
    const page = withGalleryFallback(
      galleryInput([
        {
          _key: "one",
          galleryGroup: "campaign",
          heading: "  First  ",
          body: " Caption ",
          image: {
            src: "https://cdn.sanity.io/one.jpg",
            alt: " One ",
            storefrontRightsConfirmed: true,
          },
        },
        {
          _key: "bad",
          galleryGroup: "campaign",
          heading: "Bad",
          body: "Caption",
          image: {
            src: "https://cdn.sanity.io/bad.jpg",
            alt: "",
            storefrontRightsConfirmed: true,
          },
        },
        {
          _key: "two",
          galleryGroup: "campaign",
          heading: "Second",
          body: "Caption two",
          image: {
            src: "https://cdn.sanity.io/two.jpg",
            alt: "Two",
            storefrontRightsConfirmed: true,
          },
        },
      ]),
    );
    expect(page.campaignItems.map((item) => item.id)).toEqual(["one", "two"]);
    expect(page.campaignItems[0]).toMatchObject({
      title: "First",
      caption: "Caption",
      image: { alt: "One" },
    });
  });

  it("preserves valid crop, hotspot, and projected dimensions", () => {
    const page = withGalleryFallback(
      galleryInput([
        {
          _key: "crop",
          galleryGroup: "market",
          heading: "Crop",
          body: "Caption",
          image: {
            src: "https://cdn.sanity.io/crop.jpg",
            alt: "A factual crop",
            storefrontRightsConfirmed: true,
            hotspot: { x: 0.3, y: 0.6 },
            crop: { left: 0.1, top: 0.2, right: 0.1, bottom: 0.1 },
            dimensions: { width: 1280, height: 720, aspectRatio: 16 / 9 },
          },
        },
      ]),
    );
    expect(page.marketItems[0].image).toMatchObject({
      hotspot: { x: 0.3, y: 0.6 },
      crop: { left: 0.1, top: 0.2, right: 0.1, bottom: 0.1 },
      dimensions: { width: 1280, height: 720, aspectRatio: 16 / 9 },
    });
  });

  it("uses the caption fallback for a malformed legacy campaign item", () => {
    const page = withGalleryFallback(
      galleryInput([
        {
          _key: "legacy",
          galleryGroup: null,
          heading: "Legacy",
          body: " ",
          image: {
            src: "https://cdn.sanity.io/legacy.jpg",
            alt: "A factual legacy image",
            storefrontRightsConfirmed: true,
          },
        },
      ]),
    );
    expect(page.campaignItems[0].caption).toBe(malformedGalleryCaption);
  });

  it("splits explicit groups while preserving order within each group", () => {
    const page = withGalleryFallback(
      galleryInput([
        {
          _key: "campaign-one",
          galleryGroup: "campaign",
          heading: "Campaign one",
          body: "Caption",
          image: {
            src: "https://cdn.sanity.io/campaign-one.jpg",
            alt: "Campaign image one",
            storefrontRightsConfirmed: true,
          },
        },
        {
          _key: "market-one",
          galleryGroup: "market",
          heading: "Market one",
          body: "Caption",
          image: {
            src: "https://cdn.sanity.io/market-one.jpg",
            alt: "Market image one",
            storefrontRightsConfirmed: true,
          },
        },
        {
          _key: "campaign-two",
          galleryGroup: "campaign",
          heading: "Campaign two",
          body: "Caption",
          image: {
            src: "https://cdn.sanity.io/campaign-two.jpg",
            alt: "Campaign image two",
            storefrontRightsConfirmed: true,
          },
        },
        {
          _key: "market-two",
          galleryGroup: "market",
          heading: "Market two",
          body: "Caption",
          image: {
            src: "https://cdn.sanity.io/market-two.jpg",
            alt: "Market image two",
            storefrontRightsConfirmed: true,
          },
        },
      ]),
    );

    expect(page.campaignItems.map(({ id }) => id)).toEqual([
      "campaign-one",
      "campaign-two",
    ]);
    expect(page.marketItems.map(({ id }) => id)).toEqual([
      "market-one",
      "market-two",
    ]);
  });

  it("omits unknown groups and incomplete or unconfirmed items", () => {
    const page = withGalleryFallback(
      galleryInput([
        {
          _key: "unknown",
          galleryGroup: "other",
          heading: "Unknown",
          body: "Caption",
          image: {
            src: "https://cdn.sanity.io/unknown.jpg",
            alt: "Unknown image",
            storefrontRightsConfirmed: true,
          },
        },
        {
          _key: "unconfirmed",
          galleryGroup: "market",
          heading: "Unconfirmed",
          body: "Caption",
          image: {
            src: "https://cdn.sanity.io/unconfirmed.jpg",
            alt: "Unconfirmed image",
            storefrontRightsConfirmed: false,
          },
        },
        {
          _key: "missing-title",
          galleryGroup: "campaign",
          heading: " ",
          body: "Caption",
          image: {
            src: "https://cdn.sanity.io/missing.jpg",
            alt: "Incomplete image",
            storefrontRightsConfirmed: true,
          },
        },
      ]),
    );

    expect(page.campaignItems).toEqual([]);
    expect(page.marketItems).toEqual([]);
  });

  it("bounds valid Gallery items at ten across both groups", () => {
    const page = withGalleryFallback(
      galleryInput(
        Array.from({ length: 12 }, (_, index) => ({
          _key: `${index}`,
          galleryGroup: index % 2 ? "market" : "campaign",
          heading: `Item ${index}`,
          body: "Caption",
          image: {
            src: `https://cdn.sanity.io/${index}.jpg`,
            alt: "Factual image",
            storefrontRightsConfirmed: true,
          },
        })),
      ),
    );
    expect(page.campaignItems).toHaveLength(5);
    expect(page.marketItems).toHaveLength(5);
  });
});

describe("About page fallbacks", () => {
  it("returns the exact ordered text-first fallback", () => {
    expect(withAboutFallback(null)).toEqual(fallbackAboutPage);
    expect(fallbackAboutPage.chapters.map((chapter) => chapter.role)).toEqual([
      "origin",
      "development",
      "collaborator",
      "principles",
    ]);
  });
  it("merges authored role copy and permits only rights-confirmed media", () => {
    const page = withAboutFallback({
      sections: [
        {
          role: "development",
          heading: "  Authored development ",
          body: "  Authored body ",
          image: {
            src: "https://cdn.sanity.io/portrait.jpg",
            alt: "A factual working portrait",
            storefrontRightsConfirmed: true,
          },
        },
        { role: "unknown", heading: "Ignored", body: "Ignored" },
      ],
    });
    expect(page.chapters[1]).toMatchObject({
      heading: "Authored development",
      body: "Authored body",
      image: { alt: "A factual working portrait" },
    });
    expect(page.chapters[0]).toEqual(fallbackAboutPage.chapters[0]);
  });
  it("omits unconfirmed media without affecting its chapter copy", () => {
    const page = withAboutFallback({
      sections: [
        {
          role: "origin",
          heading: "",
          body: "",
          image: {
            src: "https://cdn.sanity.io/portrait.jpg",
            alt: "Portrait",
            storefrontRightsConfirmed: false,
          },
        },
      ],
    });
    expect(page.chapters[0]).toEqual(fallbackAboutPage.chapters[0]);
  });
});

it("ignores duplicate and out-of-order roles while retaining canonical order", () => {
  const page = withAboutFallback({
    sections: [
      {
        role: "principles",
        heading: "Principles draft",
        body: "Principles body",
      },
      { role: "origin", heading: "Origin draft", body: "Origin body" },
      { role: "origin", heading: "Duplicate", body: "Ignored" },
    ],
  });
  expect(page.chapters.map((chapter) => chapter.role)).toEqual([
    "origin",
    "development",
    "collaborator",
    "principles",
  ]);
  expect(page.chapters[0].heading).toBe("Origin draft");
  expect(page.chapters[2]).toEqual(fallbackAboutPage.chapters[2]);
});

it("normalizes an invalid portrait focal point to the centered FIT position", () => {
  const page = withAboutFallback({
    sections: [
      {
        role: "origin",
        heading: "Origin",
        body: "Body",
        image: {
          src: "https://cdn.sanity.io/portrait.jpg",
          alt: "A factual portrait",
          storefrontRightsConfirmed: true,
          hotspot: { x: 2, y: Number.NaN },
        },
      },
    ],
  });
  expect(page.chapters[0].image?.hotspot).toEqual({ x: 0.5, y: 0.5 });
});
