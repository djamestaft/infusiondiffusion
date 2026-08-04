export interface ShopifyMoney {
  amount: string;
  currencyCode: string;
}

export interface ShopifyImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  sku?: string;
  price: ShopifyMoney;
  compareAtPrice?: ShopifyMoney;
  selectedOptions: ShopifySelectedOption[];
}

export interface ShopifyProductSummary {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType?: string;
  vendor?: string;
  availableForSale: boolean;
  featuredImage?: ShopifyImage;
  priceRange: { min: ShopifyMoney; max: ShopifyMoney };
  variants: ShopifyVariant[];
}

export interface ShopifyProduct extends ShopifyProductSummary {
  seo: { title?: string; description?: string };
  images: ShopifyImage[];
  collections: Array<{ id: string; handle: string; title: string }>;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: ShopifyImage;
  products: ShopifyProductSummary[];
}
