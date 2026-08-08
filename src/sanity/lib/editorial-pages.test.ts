import { describe, expect, it, vi } from "vitest";

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

describe("gallery page normalization", () => {
  it("keeps only rights-confirmed complete items in authored order and trims captions", () => {
    const page = withGalleryFallback({
      sections: [
        {
          _key: "one",
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
          heading: "Second",
          body: "Caption two",
          image: {
            src: "https://cdn.sanity.io/two.jpg",
            alt: "Two",
            storefrontRightsConfirmed: true,
          },
        },
      ],
    });
    expect(page.items.map((item) => item.id)).toEqual(["one", "two"]);
    expect(page.items[0]).toMatchObject({
      title: "First",
      caption: "Caption",
      image: { alt: "One" },
    });
  });

  it("preserves valid Sanity hotspot and crop data for thumbnail safety", () => {
    const page = withGalleryFallback({
      sections: [
        {
          _key: "crop",
          heading: "Crop",
          body: "Caption",
          image: {
            src: "https://cdn.sanity.io/crop.jpg",
            alt: "A factual crop",
            storefrontRightsConfirmed: true,
            hotspot: { x: 0.3, y: 0.6 },
            crop: { left: 0.1, top: 0.2, right: 0.1, bottom: 0.1 },
          },
        },
      ],
    });
    expect(page.items[0].image).toMatchObject({
      hotspot: { x: 0.3, y: 0.6 },
      crop: { left: 0.1, top: 0.2, right: 0.1, bottom: 0.1 },
    });
  });

  it("uses the honest caption fallback only for malformed legacy omissions", () => {
    const page = withGalleryFallback({
      sections: [
        {
          _key: "legacy",
          heading: "Legacy",
          body: " ",
          image: {
            src: "https://cdn.sanity.io/legacy.jpg",
            alt: "A factual legacy image",
            storefrontRightsConfirmed: true,
          },
        },
      ],
    });
    expect(page.items[0].caption).toBe(malformedGalleryCaption);
  });

  it("bounds valid gallery items at ten", () => {
    const page = withGalleryFallback({
      sections: Array.from({ length: 12 }, (_, index) => ({
        _key: `${index}`,
        heading: `Item ${index}`,
        body: "Caption",
        image: {
          src: `https://cdn.sanity.io/${index}.jpg`,
          alt: "Factual image",
          storefrontRightsConfirmed: true,
        },
      })),
    });
    expect(page.items).toHaveLength(10);
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
