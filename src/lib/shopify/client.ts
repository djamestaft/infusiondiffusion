import "server-only";

import { z } from "zod";

const configSchema = z.object({
  domain: z
    .string()
    .trim()
    .min(1)
    .transform((value) => value.replace(/^https?:\/\//, "").replace(/\/$/, ""))
    .refine(
      (value) => /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(value),
      "Must be a myshopify.com domain",
    ),
  token: z.string().trim().min(1),
  apiVersion: z.literal("2026-07"),
});

export type ShopifyErrorCode =
  "CONFIGURATION" | "HTTP" | "GRAPHQL" | "INVALID_RESPONSE" | "NOT_FOUND";

export class ShopifyStorefrontError extends Error {
  constructor(
    message: string,
    readonly code: ShopifyErrorCode,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ShopifyStorefrontError";
  }
}

function getConfig() {
  const parsed = configSchema.safeParse({
    domain: process.env.SHOPIFY_STORE_DOMAIN,
    token: process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN,
    apiVersion: process.env.SHOPIFY_STOREFRONT_API_VERSION,
  });

  if (!parsed.success) {
    throw new ShopifyStorefrontError(
      "Shopify Storefront API is not configured.",
      "CONFIGURATION",
    );
  }
  return parsed.data;
}

interface StorefrontResponse<T> {
  data?: T;
  errors?: Array<{ message?: string }>;
}

export async function storefrontRequest<T>(
  query: string,
  options: {
    variables?: Record<string, unknown>;
    buyerIp?: string;
    signal?: AbortSignal;
  } = {},
): Promise<T> {
  const config = getConfig();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Shopify-Storefront-Private-Token": config.token,
  };
  if (options.buyerIp) headers["Shopify-Storefront-Buyer-IP"] = options.buyerIp;

  let response: Response;
  try {
    response = await fetch(
      `https://${config.domain}/api/${config.apiVersion}/graphql.json`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ query, variables: options.variables ?? {} }),
        signal: options.signal,
      },
    );
  } catch {
    throw new ShopifyStorefrontError(
      "Shopify Storefront API request failed.",
      "HTTP",
    );
  }

  if (!response.ok) {
    throw new ShopifyStorefrontError(
      "Shopify Storefront API request failed.",
      "HTTP",
      response.status,
    );
  }
  const servedVersion = response.headers.get("X-Shopify-API-Version");
  if (servedVersion && servedVersion !== config.apiVersion) {
    throw new ShopifyStorefrontError(
      "Shopify served an unexpected API version.",
      "INVALID_RESPONSE",
      response.status,
    );
  }

  let payload: StorefrontResponse<T>;
  try {
    payload = (await response.json()) as StorefrontResponse<T>;
  } catch {
    throw new ShopifyStorefrontError(
      "Shopify returned an invalid response.",
      "INVALID_RESPONSE",
      response.status,
    );
  }
  if (payload.errors?.length) {
    throw new ShopifyStorefrontError(
      "Shopify Storefront API returned GraphQL errors.",
      "GRAPHQL",
      response.status,
    );
  }
  if (!payload.data) {
    throw new ShopifyStorefrontError(
      "Shopify returned an invalid response.",
      "INVALID_RESPONSE",
      response.status,
    );
  }
  return payload.data;
}
