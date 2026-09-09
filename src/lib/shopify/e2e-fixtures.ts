import type { ShopifyProduct } from "@/lib/shopify/types";

export const shopifyE2EProducts: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/10067989987614",
    handle: "bois-de-santal-200ml",
    title: "Bois De Santal - 200ml",
    description:
      "A warm sandalwood fragrance used to verify the browse-only catalogue journey.",
    vendor: "InfusionDiffusion",
    productType: "Reed diffuser",
    featuredImage: {
      url: "/images/products/fixtures/bois-de-santal.png",
      altText: "Test-only Bois De Santal image fixture",
      width: 1024,
      height: 1024,
    },
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

// Six deterministic products exercise catalogue completeness without a live API.
// These records are only selected by the existing development + CI fixture gate.
for (const [handle, title, productId] of [
  ["santuaire-serein", "Santuaire Serein", "10067255492894"],
  ["ambre-egyptian", "Ambre Egyptian", "10067255558430"],
  ["blanc-de-blanc", "Blanc de Blanc", "10067255394590"],
  ["ete-mystique", "Été Mystique", "10068135641374"],
  ["noir-de-la-nuit", "Noir de la Nuit", "10067255460126"],
]) {
  shopifyE2EProducts.push({
    ...shopifyE2EProducts[0],
    id: `gid://shopify/Product/${productId}`,
    handle: `${handle}-200ml`,
    title: `${title} - 200ml`,
    description: "A complete test-only fragrance description.",
    featuredImage: {
      url: `/images/products/fixtures/${handle}.png`,
      altText: `Test-only ${title} image fixture`,
      width: 1024,
      height: 1024,
    },
    variants: [
      {
        ...shopifyE2EProducts[0].variants[0],
        id: `gid://shopify/ProductVariant/e2e-${handle}`,
      },
    ],
    seo: { title },
  });
}
