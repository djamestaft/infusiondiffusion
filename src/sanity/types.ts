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
  eyebrow: "Botanical infusions · Coming soon",
  headline: "Let the good things steep.",
  introduction:
    "We are preparing a considered collection of botanical blends for slower mornings, brighter afternoons, and everything between.",
  contactEmail: "hello@infusiondiffusion.co.za",
  callToActionLabel: "Say hello",
  seoTitle: "Infusion Diffusion",
  seoDescription:
    "Thoughtfully blended infusions, created to bring a little ritual to every day.",
};
