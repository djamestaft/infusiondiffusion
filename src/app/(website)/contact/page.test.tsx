import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/shopify/cart-session", () => ({
  readCart: vi.fn(),
}));
vi.mock("@/sanity/lib/editorial-pages", () => ({
  getContactPage: vi.fn(),
  getContactPageMetadata: vi.fn(),
}));
vi.mock("@/sanity/lib/live", () => ({ getDynamicFetchOptions: vi.fn() }));
vi.mock("@/sanity/lib/settings", () => ({ getSiteSettings: vi.fn() }));

import {
  generateMetadata,
  getContactPageData,
  safeContactEmail,
} from "@/app/(website)/contact/page";
import {
  getContactPage,
  getContactPageMetadata,
} from "@/sanity/lib/editorial-pages";
import { getDynamicFetchOptions } from "@/sanity/lib/live";
import { readCart } from "@/lib/shopify/cart-session";
import { getSiteSettings } from "@/sanity/lib/settings";

describe("Contact route safety", () => {
  it("uses the approved mailbox for blank or unsafe global settings", () => {
    expect(safeContactEmail(undefined)).toBe("hello@infusiondiffusion.co.za");
    expect(safeContactEmail("   ")).toBe("hello@infusiondiffusion.co.za");
    expect(safeContactEmail("mailto:unsafe@example.com")).toBe(
      "hello@infusiondiffusion.co.za",
    );
  });

  it("trims a valid global mailbox before it is used in a mailto link", () => {
    expect(safeContactEmail("  studio@example.co.za ")).toBe(
      "studio@example.co.za",
    );
  });

  it("composes Contact editorial content, validated settings, and live cart state", async () => {
    vi.mocked(getDynamicFetchOptions).mockResolvedValue({
      perspective: "drafts",
      stega: true,
    });
    vi.mocked(getContactPage).mockResolvedValue({
      eyebrow: "Editorial contact",
      title: "A Contact title",
      introduction: "An editorial introduction.",
      sections: [{ heading: "Before you write", body: "Helpful detail." }],
      seoTitle: "Contact SEO",
      seoDescription: "Contact description.",
    });
    vi.mocked(getSiteSettings).mockResolvedValue({
      contactEmail: "  studio@example.co.za ",
    } as never);
    vi.mocked(readCart).mockResolvedValue({ totalQuantity: 3 } as never);

    await expect(getContactPageData()).resolves.toMatchObject({
      eyebrow: "Editorial contact",
      title: "A Contact title",
      email: "studio@example.co.za",
      cartCount: 3,
    });
    expect(getContactPage).toHaveBeenCalledWith({
      perspective: "drafts",
      stega: true,
    });
  });

  it("uses Contact editorial metadata in the published perspective", async () => {
    vi.mocked(getDynamicFetchOptions).mockResolvedValue({
      perspective: "published",
      stega: false,
    });
    vi.mocked(getContactPageMetadata).mockResolvedValue({
      eyebrow: "",
      title: "Contact",
      introduction: "Introduction",
      sections: [],
      seoTitle: "Contact | Infusion Diffusion",
      seoDescription: "Approved contact description.",
    });

    await expect(generateMetadata()).resolves.toMatchObject({
      title: { absolute: "Contact | Infusion Diffusion" },
      description: "Approved contact description.",
      openGraph: {
        locale: "en_ZA",
        type: "article",
      },
    });
    expect(getContactPageMetadata).toHaveBeenCalledWith("published");
  });
});
