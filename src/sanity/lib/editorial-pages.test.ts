import { describe, expect, it, vi } from "vitest";

vi.mock("@/env", () => ({ isSanityConfigured: false }));
vi.mock("@/sanity/lib/live", () => ({
  sanityFetch: vi.fn(),
  sanityFetchMetadata: vi.fn(),
}));

import {
  fallbackFragranceGuide,
  withEditorialFallback,
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
