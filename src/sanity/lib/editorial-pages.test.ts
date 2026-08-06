import { describe, expect, it, vi } from "vitest";

vi.mock("@/env", () => ({ isSanityConfigured: false }));
vi.mock("@/sanity/lib/live", () => ({
  sanityFetch: vi.fn(),
  sanityFetchMetadata: vi.fn(),
}));

import {
  fallbackFragranceGuide,
  withEditorialFallback,
  fallbackAboutPage,
  withAboutFallback,
} from "@/sanity/lib/editorial-pages";

describe("editorial page fallbacks", () => {
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
