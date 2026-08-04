export type SiteSettings = {
  brandName: string;
  eyebrow: string;
  announcement: {
    enabled: boolean;
    message?: string;
    linkLabel?: string;
    linkUrl?: string;
  };
  headline: string;
  introduction: string;
  contactEmail: string;
  callToActionLabel: string;
  seoTitle: string;
  seoDescription: string;
  homepage: {
    heroTitle: string;
    heroIntroduction: string;
    heroActionLabel: string;
    collectionTitle: string;
    guidanceEyebrow: string;
    guidanceTitle: string;
    guidanceIntroduction: string;
    guidanceActionLabel: string;
    guidanceSupportingText: string;
  };
};

export const fallbackSiteSettings: SiteSettings = {
  brandName: "Infusion Diffusion",
  eyebrow: "Home fragrance · Coming soon",
  announcement: {
    enabled: true,
    message: "The first collection is taking shape.",
  },
  headline: "Scent for living.",
  introduction:
    "We are preparing a considered collection of room sprays, reed diffusers, and candles for layered, lived-in rooms.",
  contactEmail: "hello@infusiondiffusion.co.za",
  callToActionLabel: "Say hello",
  seoTitle: "Infusion Diffusion",
  seoDescription:
    "Discover room sprays, reed diffusers, and candles designed to bring considered fragrance into lived-in rooms.",
  homepage: {
    heroTitle: "Fragrance, composed for the rooms you live in",
    heroIntroduction:
      "Diffusers, room sprays and candles shaped by clear scent notes, considered materials and everyday ritual.",
    heroActionLabel: "Shop the collection",
    collectionTitle: "A cabinet of atmosphere",
    guidanceEyebrow: "Fragrance guidance",
    guidanceTitle: "Choose by the room, then by the feeling",
    guidanceIntroduction:
      "Begin with how the space is used. Bright citrus and herbs lift active rooms; woods, amber and soft florals settle quieter ones.",
    guidanceActionLabel: "Read the fragrance guide",
    guidanceSupportingText:
      "Every fragrance lists its notes plainly, so you can compare character and intensity before choosing a format.",
  },
};
