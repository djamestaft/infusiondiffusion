import type { ProductCardProps } from "@/components/ui/product-card";

export const productCardFixtures = [
  {
    href: "/products/santuaire-serein",
    name: "Santuaire Serein",
    format: "Reed diffuser · 200ml",
    notes: "Bergamot · jasmine · white musk",
    price: { amount: "420", currencyCode: "ZAR" },
    image: {
      src: "/images/products/fixtures/santuaire-serein.png",
      alt: "Santuaire Serein reed diffuser in an interior setting",
    },
  },
  {
    href: "/products/ambre-egyptian",
    name: "Ambre Egyptian",
    format: "Reed diffuser · 200ml",
    notes: "Amber · spice · warm woods",
    price: { amount: "420", currencyCode: "ZAR" },
    image: {
      src: "/images/products/fixtures/ambre-egyptian.png",
      alt: "Ambre Egyptian reed diffuser in an interior setting",
    },
  },
  {
    href: "/products/blanc-de-blanc",
    name: "Blanc de Blanc",
    format: "Reed diffuser · 200ml",
    notes: "White florals · citrus · soft woods",
    price: { amount: "420", currencyCode: "ZAR" },
    image: {
      src: "/images/products/fixtures/blanc-de-blanc.png",
      alt: "Blanc de Blanc reed diffuser in an interior setting",
    },
  },
  {
    href: "/products/ete-mystique",
    name: "Été Mystique",
    format: "Reed diffuser · 200ml",
    notes: "Citrus · aromatic herbs · musk",
    price: { amount: "420", currencyCode: "ZAR" },
    image: {
      src: "/images/products/fixtures/ete-mystique.png",
      alt: "Été Mystique reed diffuser in an interior setting",
    },
  },
  {
    href: "/products/noir-de-la-nuit",
    name: "Noir de la Nuit",
    format: "Reed diffuser · 200ml",
    notes: "Dark florals · amber · smoky woods",
    price: { amount: "420", currencyCode: "ZAR" },
    image: {
      src: "/images/products/fixtures/noir-de-la-nuit.png",
      alt: "Noir de la Nuit reed diffuser in an interior setting",
    },
  },
  {
    href: "/products/bois-de-santal",
    name: "Bois de Santal",
    format: "Reed diffuser · 200ml",
    notes: "Cardamom · rose · sandalwood",
    price: { amount: "420", currencyCode: "ZAR" },
    image: {
      src: "/images/products/fixtures/bois-de-santal.png",
      alt: "Bois de Santal reed diffuser in an interior setting",
    },
  },
] satisfies ProductCardProps[];
