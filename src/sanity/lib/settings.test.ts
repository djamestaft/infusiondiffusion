import { beforeEach, describe, expect, it, vi } from "vitest";

const { sanityFetchMock, sanityFetchMetadataMock } = vi.hoisted(() => ({
  sanityFetchMock: vi.fn(),
  sanityFetchMetadataMock: vi.fn(),
}));

vi.mock("@/env", () => ({ isSanityConfigured: true }));
vi.mock("@/sanity/lib/live", () => ({
  sanityFetch: sanityFetchMock,
  sanityFetchMetadata: sanityFetchMetadataMock,
}));

import {
  getSiteSettings,
  getSiteSettingsMetadata,
} from "@/sanity/lib/settings";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { fallbackSiteSettings } from "@/sanity/types";

describe("site settings", () => {
  beforeEach(() => {
    sanityFetchMock.mockReset();
    sanityFetchMetadataMock.mockReset();
  });

  it("fetches page settings inside the supplied live-content perspective", async () => {
    sanityFetchMock.mockResolvedValue({ data: { headline: "From Sanity" } });
    const options = { perspective: "published" as const, stega: false };

    await expect(getSiteSettings(options)).resolves.toEqual({
      ...fallbackSiteSettings,
      headline: "From Sanity",
    });
    expect(sanityFetchMock).toHaveBeenCalledWith({
      query: SITE_SETTINGS_QUERY,
      ...options,
    });
  });

  it("uses a non-stega metadata fetch and preserves fallback fields", async () => {
    sanityFetchMetadataMock.mockResolvedValue({
      data: { seoTitle: "From Sanity" },
    });

    await expect(getSiteSettingsMetadata("published")).resolves.toEqual({
      ...fallbackSiteSettings,
      seoTitle: "From Sanity",
    });
    expect(sanityFetchMetadataMock).toHaveBeenCalledWith({
      query: SITE_SETTINGS_QUERY,
      perspective: "published",
    });
  });

  it("returns complete fallback settings when the dataset is empty", async () => {
    sanityFetchMock.mockResolvedValue({ data: null });

    await expect(
      getSiteSettings({ perspective: "published", stega: false }),
    ).resolves.toEqual(fallbackSiteSettings);
  });

  it("fills missing nested homepage fields without discarding editorial overrides", async () => {
    sanityFetchMock.mockResolvedValue({
      data: { homepage: { heroTitle: "A composed override" } },
    });

    await expect(
      getSiteSettings({ perspective: "published", stega: false }),
    ).resolves.toMatchObject({
      homepage: {
        ...fallbackSiteSettings.homepage,
        heroTitle: "A composed override",
      },
    });
  });
});
