import type { ShopifyProduct } from "@/lib/shopify/types";

export const shopifyE2EProducts: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/e2e-bois-de-santal",
    handle: "bois-de-santal-200ml",
    title: "Bois De Santal - 200ml",
    description:
      "A warm sandalwood fragrance used to verify the browse-only catalogue journey.",
    vendor: "InfusionDiffusion",
    availableForSale: true,
    priceRange: {
      min: { amount: "430.0", currencyCode: "ZAR" },
      max: { amount: "430.0", currencyCode: "ZAR" },
    },
    variants: [
      {
        id: "gid://shopify/ProductVariant/e2e-bois-de-santal",
        title: "Default Title",
        availableForSale: true,
        price: { amount: "430.0", currencyCode: "ZAR" },
        selectedOptions: [{ name: "Title", value: "Default Title" }],
      },
    ],
    seo: {
      title: "Bois De Santal | Infusion Diffusion",
      description: "A warm sandalwood home fragrance.",
    },
    images: [],
    collections: [],
  },
];
