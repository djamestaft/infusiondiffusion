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
    heroSlides: Array<{
      id: string;
      src: string;
      alt: string;
      caption?: string;
      hotspot?: { x: number; y: number };
    }>;
    collectionTitle: string;
    guidanceEyebrow: string;
    guidanceTitle: string;
    guidanceIntroduction: string;
    guidanceActionLabel: string;
    guidanceSupportingText: string;
    showServiceReassurance: boolean;
    serviceTitle: string;
    serviceIntroduction: string;
    showFounderStory: boolean;
    founderTitle: string;
    founderStory: string;
    founderImage?: { src: string; alt: string };
    showLongevity: boolean;
    longevityTitle: string;
    longevityIntroduction: string;
    longevityConditions: string;
    showCollectionInvitation: boolean;
    collectionInvitationTitle: string;
    collectionInvitationIntroduction: string;
    collectionInvitationActionLabel: string;
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
    heroSlides: [],
    collectionTitle: "A cabinet of atmosphere",
    guidanceEyebrow: "Fragrance guidance",
    guidanceTitle: "Choose by the room, then by the feeling",
    guidanceIntroduction:
      "Begin with how the space is used. Bright citrus and herbs lift active rooms; woods, amber and soft florals settle quieter ones.",
    guidanceActionLabel: "Read the fragrance guide",
    guidanceSupportingText:
      "Every fragrance lists its notes plainly, so you can compare character and intensity before choosing a format.",
    showServiceReassurance: true,
    serviceTitle: "Made meaningful by the details",
    serviceIntroduction:
      "Clear care guidance, transparent delivery expectations and dependable stock information accompany every product.",
    showFounderStory: true,
    founderTitle: "Born from fragrance",
    founderStory:
      "Infusion Diffusion began with a lifelong affair with fragrance, luxury and scent’s power to turn a space into a feeling. More than 130 fragrance oils sourced from around the world were explored before the collection was refined to six distinctive room fragrances.\n\nCreated with the guidance and encouragement of Jacqui Kirchmann, founder of Jacqui Candles – Scented Wax Melts, each fragrance is composed with passion, elegance and soul.",
    showLongevity: true,
    longevityTitle: "Made to linger",
    longevityIntroduction:
      "Our 200ml reed diffusers are designed to fragrance a room for approximately 8–12 months under normal use.",
    longevityConditions:
      "Room temperature, airflow and how often the reeds are turned will shape the pace of diffusion. A slower ritual lets the fragrance become part of the room rather than simply passing through it.",
    showCollectionInvitation: true,
    collectionInvitationTitle: "Six fragrances. A roomful of possibility.",
    collectionInvitationIntroduction:
      "Each fragrance was chosen for the atmosphere it creates—warmth, brightness, stillness, memory. Find the one that feels at home in yours.",
    collectionInvitationActionLabel: "Shop the collection",
  },
};
