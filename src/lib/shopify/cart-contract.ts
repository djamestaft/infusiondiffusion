import type { ShopifyMoney } from "@/lib/shopify/types";

export type CartLineContract = {
  id: string;
  merchandiseId: string;
  title: string;
  variantTitle?: string;
  format?: string;
  image?: { src: string; alt: string };
  quantity: number;
  available: boolean;
  total: ShopifyMoney;
};

export type CartContract = {
  totalQuantity: number;
  lines: CartLineContract[];
  subtotal: ShopifyMoney;
  discounts?: Array<{ label: string; amount: ShopifyMoney }>;
  message?: string;
};

export const emptyCart: CartContract = {
  totalQuantity: 0,
  lines: [],
  subtotal: { amount: "0", currencyCode: "ZAR" },
};
