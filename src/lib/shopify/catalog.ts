import "server-only";

import { z } from "zod";

import {
  ShopifyStorefrontError,
  storefrontRequest,
} from "@/lib/shopify/client";
import type {
  ShopifyCollection,
  ShopifyImage,
  ShopifyMoney,
  ShopifyProduct,
  ShopifyProductSummary,
  ShopifyVariant,
} from "@/lib/shopify/types";

const moneySchema = z.object({
  amount: z.string().regex(/^\d+(?:\.\d+)?$/),
  currencyCode: z.string().regex(/^[A-Z]{3}$/),
});
const imageSchema = z.object({
  url: z.string().url(),
  altText: z.string().nullish(),
  width: z.number().int().positive().nullish(),
  height: z.number().int().positive().nullish(),
});
const variantSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  availableForSale: z.boolean(),
  sku: z.string().nullish(),
  price: moneySchema,
  compareAtPrice: moneySchema.nullish(),
  selectedOptions: z.array(z.object({ name: z.string(), value: z.string() })),
});
const summarySchema = z.object({
  id: z.string().min(1),
  handle: z.string().min(1),
  title: z.string().min(1),
  description: z.string().default(""),
  productType: z.string().nullish(),
  vendor: z.string().nullish(),
  availableForSale: z.boolean(),
  featuredImage: imageSchema.nullish(),
  priceRange: z.object({
    minVariantPrice: moneySchema,
    maxVariantPrice: moneySchema,
  }),
  variants: z.object({ nodes: z.array(variantSchema) }),
});
const productSchema = summarySchema.extend({
  seo: z.object({
    title: z.string().nullish(),
    description: z.string().nullish(),
  }),
  images: z.object({ nodes: z.array(imageSchema) }),
  collections: z.object({
    nodes: z.array(
      z.object({ id: z.string(), handle: z.string(), title: z.string() }),
    ),
  }),
});
const collectionSchema = z.object({
  id: z.string(),
  handle: z.string(),
  title: z.string(),
  description: z.string().default(""),
  image: imageSchema.nullish(),
  products: z.object({ nodes: z.array(summarySchema) }),
});
const productsResponseSchema = z.object({
  products: z.object({ nodes: z.array(z.unknown()) }),
});
const productResponseSchema = z.object({ product: z.unknown().nullable() });
const collectionResponseSchema = z.object({
  collection: z.unknown().nullable(),
});
const firstSchema = z.number().int().min(1).max(250);

const PRODUCT_FIELDS = `
  id handle title description productType vendor availableForSale
  featuredImage { url altText width height }
  priceRange { minVariantPrice { amount currencyCode } maxVariantPrice { amount currencyCode } }
  variants(first: 100) { nodes { id title availableForSale sku price { amount currencyCode } compareAtPrice { amount currencyCode } selectedOptions { name value } } }
`;

const PRODUCTS_QUERY = `query Products($first: Int!) { products(first: $first, sortKey: TITLE) { nodes { ${PRODUCT_FIELDS} } } }`;
const PRODUCT_QUERY = `query Product($handle: String!) { product(handle: $handle) { ${PRODUCT_FIELDS} seo { title description } images(first: 20) { nodes { url altText width height } } collections(first: 20) { nodes { id handle title } } } }`;
const COLLECTION_QUERY = `query Collection($handle: String!, $first: Int!) { collection(handle: $handle) { id handle title description image { url altText width height } products(first: $first, sortKey: TITLE) { nodes { ${PRODUCT_FIELDS} } } } }`;

function optionalText(value: string | null | undefined) {
  return value?.trim() || undefined;
}
function normalizeMoney(value: z.infer<typeof moneySchema>): ShopifyMoney {
  return { amount: value.amount, currencyCode: value.currencyCode };
}
function normalizeImage(value: z.infer<typeof imageSchema>): ShopifyImage {
  return {
    url: value.url,
    altText: optionalText(value.altText),
    width: value.width ?? undefined,
    height: value.height ?? undefined,
  };
}
function normalizeVariant(
  value: z.infer<typeof variantSchema>,
): ShopifyVariant {
  return {
    id: value.id,
    title: value.title,
    availableForSale: value.availableForSale,
    sku: optionalText(value.sku),
    price: normalizeMoney(value.price),
    compareAtPrice: value.compareAtPrice
      ? normalizeMoney(value.compareAtPrice)
      : undefined,
    selectedOptions: value.selectedOptions,
  };
}
function normalizeSummary(
  value: z.infer<typeof summarySchema>,
): ShopifyProductSummary {
  return {
    id: value.id,
    handle: value.handle,
    title: value.title,
    description: value.description,
    productType: optionalText(value.productType),
    vendor: optionalText(value.vendor),
    availableForSale: value.availableForSale,
    featuredImage: value.featuredImage
      ? normalizeImage(value.featuredImage)
      : undefined,
    priceRange: {
      min: normalizeMoney(value.priceRange.minVariantPrice),
      max: normalizeMoney(value.priceRange.maxVariantPrice),
    },
    variants: value.variants.nodes.map(normalizeVariant),
  };
}
function parse<T>(schema: z.ZodType<T>, value: unknown): T {
  const parsed = schema.safeParse(value);
  if (!parsed.success)
    throw new ShopifyStorefrontError(
      "Shopify returned malformed catalogue data.",
      "INVALID_RESPONSE",
    );
  return parsed.data;
}

export async function getProducts(
  first = 50,
): Promise<ShopifyProductSummary[]> {
  const safeFirst = parse(firstSchema, first);
  const response = await storefrontRequest<unknown>(PRODUCTS_QUERY, {
    variables: { first: safeFirst },
  });
  const data = parse(productsResponseSchema, response);
  return data.products.nodes.map((node) =>
    normalizeSummary(parse(summarySchema, node)),
  );
}

export async function getProduct(handle: string): Promise<ShopifyProduct> {
  const response = await storefrontRequest<unknown>(PRODUCT_QUERY, {
    variables: { handle },
  });
  const data = parse(productResponseSchema, response);
  if (!data.product)
    throw new ShopifyStorefrontError(
      `Shopify product not found: ${handle}`,
      "NOT_FOUND",
      404,
    );
  const product = parse(productSchema, data.product);
  return {
    ...normalizeSummary(product),
    seo: {
      title: optionalText(product.seo.title),
      description: optionalText(product.seo.description),
    },
    images: product.images.nodes.map(normalizeImage),
    collections: product.collections.nodes,
  };
}

export async function getCollection(
  handle: string,
  first = 50,
): Promise<ShopifyCollection> {
  const safeFirst = parse(firstSchema, first);
  const response = await storefrontRequest<unknown>(COLLECTION_QUERY, {
    variables: { handle, first: safeFirst },
  });
  const data = parse(collectionResponseSchema, response);
  if (!data.collection)
    throw new ShopifyStorefrontError(
      `Shopify collection not found: ${handle}`,
      "NOT_FOUND",
      404,
    );
  const collection = parse(collectionSchema, data.collection);
  return {
    id: collection.id,
    handle: collection.handle,
    title: collection.title,
    description: collection.description,
    image: collection.image ? normalizeImage(collection.image) : undefined,
    products: collection.products.nodes.map(normalizeSummary),
  };
}
