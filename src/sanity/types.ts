export type SiteSettings = {
  brandName: string;
  eyebrow: string;
  headline: string;
  introduction: string;
  contactEmail: string;
  callToActionLabel: string;
  seoTitle: string;
  seoDescription: string;
};

export const fallbackSiteSettings: SiteSettings = {
  brandName: "Infusion Diffusion",
  eyebrow: "Home fragrance · Coming soon",
  headline: "Scent for living.",
  introduction:
    "We are preparing a considered collection of room sprays, reed diffusers, and candles for layered, lived-in rooms.",
  contactEmail: "hello@infusiondiffusion.co.za",
  callToActionLabel: "Say hello",
  seoTitle: "Infusion Diffusion",
  seoDescription:
    "Discover room sprays, reed diffusers, and candles designed to bring considered fragrance into lived-in rooms.",
};
