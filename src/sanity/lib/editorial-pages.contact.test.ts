import { beforeEach, describe, expect, it, vi } from "vitest";

const { sanityFetch, sanityFetchMetadata } = vi.hoisted(() => ({
  sanityFetch: vi.fn(),
  sanityFetchMetadata: vi.fn(),
}));

vi.mock("@/env", () => ({ isSanityConfigured: true }));
vi.mock("@/sanity/lib/live", () => ({
  sanityFetch,
  sanityFetchMetadata,
}));

import {
  fallbackContactPage,
  getContactPage,
  getContactPageMetadata,
} from "@/sanity/lib/editorial-pages";

describe("Contact editorial reads", () => {
  beforeEach(() => vi.clearAllMocks());

  it("retains valid partial Contact values and fills omitted fields", async () => {
    sanityFetch.mockResolvedValue({
      data: {
        eyebrow: "  Contact studio ",
        title: "  An authored title ",
        introduction: " ",
        sections: [{ heading: "  Authored section ", body: "  Detail " }],
      },
    });

    await expect(
      getContactPage({ perspective: "drafts", stega: true }),
    ).resolves.toMatchObject({
      eyebrow: "Contact studio",
      title: "An authored title",
      introduction: fallbackContactPage.introduction,
      sections: [{ heading: "Authored section", body: "Detail" }],
    });
    expect(sanityFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { slug: "contact" },
        perspective: "drafts",
        stega: true,
      }),
    );
  });

  it("returns the complete Contact fallback when the content read fails", async () => {
    sanityFetch.mockRejectedValue(new Error("unavailable"));
    await expect(
      getContactPage({ perspective: "published", stega: false }),
    ).resolves.toEqual(fallbackContactPage);
  });

  it("uses Contact metadata values for the requested perspective", async () => {
    sanityFetchMetadata.mockResolvedValue({
      data: {
        seoTitle: "  Draft contact SEO ",
        seoDescription: "  Draft description ",
      },
    });

    await expect(getContactPageMetadata("drafts")).resolves.toMatchObject({
      seoTitle: "Draft contact SEO",
      seoDescription: "Draft description",
    });
    expect(sanityFetchMetadata).toHaveBeenCalledWith(
      expect.objectContaining({
        params: { slug: "contact" },
        perspective: "drafts",
      }),
    );
  });

  it("returns Contact metadata fallback when the metadata read fails", async () => {
    sanityFetchMetadata.mockRejectedValue(new Error("unavailable"));
    await expect(getContactPageMetadata("published")).resolves.toEqual(
      fallbackContactPage,
    );
  });
});
