export type StorefrontMedia = {
  src: string;
  alt: string;
  source: string;
  approval: "repository-approved";
  fit: "cover" | "contain";
};

const productMedia: Record<string, StorefrontMedia> = {
  "ambre-egyptian": {
    src: "/images/storefront/approved/products/ambre-egyptian.png",
    alt: "Ambre Egyptian home-fragrance vessel",
    source: "public/images/products/fixtures/ambre-egyptian.png",
    approval: "repository-approved",
    fit: "cover",
  },
  "blanc-de-blanc": {
    src: "/images/storefront/approved/products/blanc-de-blanc.png",
    alt: "Blanc De Blanc home-fragrance vessel",
    source: "public/images/products/fixtures/blanc-de-blanc.png",
    approval: "repository-approved",
    fit: "cover",
  },
  "bois-de-santal": {
    src: "/images/storefront/approved/products/bois-de-santal.png",
    alt: "Bois De Santal home-fragrance vessel",
    source: "public/images/products/fixtures/bois-de-santal.png",
    approval: "repository-approved",
    fit: "cover",
  },
  "ete-mystique": {
    src: "/images/storefront/approved/products/ete-mystique.png",
    alt: "Été Mystique home-fragrance vessel",
    source: "public/images/products/fixtures/ete-mystique.png",
    approval: "repository-approved",
    fit: "cover",
  },
  "noir-de-la-nuit": {
    src: "/images/storefront/approved/products/noir-de-la-nuit.png",
    alt: "Noir De La Nuit home-fragrance vessel",
    source: "public/images/products/fixtures/noir-de-la-nuit.png",
    approval: "repository-approved",
    fit: "cover",
  },
  "santuaire-serein": {
    src: "/images/storefront/approved/products/santuaire-serein.png",
    alt: "Santuaire Serein home-fragrance vessel",
    source: "public/images/products/fixtures/santuaire-serein.png",
    approval: "repository-approved",
    fit: "cover",
  },
};

const homeMedia: StorefrontMedia[] = [
  {
    src: "/images/storefront/approved/home/blanc-de-blanc-travertine.png",
    alt: "Blanc De Blanc fragrance arranged in a travertine interior",
    source:
      "images-for-gallery/gallery-final-candidates/blanc-de-blanc-travertine.png",
    approval: "repository-approved",
    fit: "cover",
  },
  {
    src: "/images/storefront/approved/home/bois-de-santal-emerald.png",
    alt: "Bois De Santal fragrance in a deep green interior",
    source:
      "images-for-gallery/gallery-final-candidates/bois-de-santal-emerald.png",
    approval: "repository-approved",
    fit: "cover",
  },
  {
    src: "/images/storefront/approved/home/santuaire-serein-botanical.png",
    alt: "Santuaire Serein fragrance in a botanical setting",
    source:
      "images-for-gallery/gallery-final-candidates/santuaire-serein-botanical.png",
    approval: "repository-approved",
    fit: "cover",
  },
  {
    src: "/images/storefront/approved/home/santuaire-serein-library.png",
    alt: "Santuaire Serein fragrance arranged in a library interior",
    source:
      "images-for-gallery/gallery-final-candidates/santuaire-serein-library.png",
    approval: "repository-approved",
    fit: "cover",
  },
];

export const approvedHomeSlides = homeMedia.map((media, index) => ({
  id: `approved-home-${index + 1}`,
  src: media.src,
  alt: media.alt,
}));

export const approvedEditorialImage: Pick<StorefrontMedia, "src" | "alt"> =
  homeMedia[1];

export function getApprovedProductMedia(handle: string) {
  const key = handle.toLowerCase().replace(/-\d+(?:ml|g|oz)$/i, "");
  return productMedia[key];
}

export function getApprovedProductMediaForTitle(title: string) {
  const key = title
    .toLowerCase()
    .replace(/\s*-\s*\d+\s*(?:ml|g|oz).*$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return productMedia[key];
}

export const approvedGalleryItems = [
  ...homeMedia.map((media, index) => ({
    id: `approved-campaign-${index + 1}`,
    title: [
      "Blanc De Blanc — Travertine Light",
      "Bois De Santal — Emerald Study",
      "Santuaire Serein — Botanical Light",
      "Santuaire Serein — Library Study",
    ][index],
    caption: "An Infusion Diffusion fragrance study.",
    image: { src: media.src, alt: media.alt },
  })),
  ...[1, 2, 3, 4, 5].map((number) => ({
    id: `approved-market-${number}`,
    title: [
      "At the Indoor Market",
      "The Market Table",
      "Blanc De Blanc at Market",
      "The Collection on Display",
      "A Table of Fragrance",
    ][number - 1],
    caption: "A moment from the Infusion Diffusion collection.",
    image: {
      src: `/images/storefront/approved/gallery/market-${number}.jpeg`,
      alt: "Infusion Diffusion market presentation",
    },
  })),
];
