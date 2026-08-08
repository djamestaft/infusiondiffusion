import "server-only";

import { z } from "zod";

import {
  ShopifyStorefrontError,
  storefrontRequest,
} from "@/lib/shopify/client";

const accountResponseSchema = z.object({
  shop: z.object({ customerAccountUrl: z.string().nullable() }),
});

export type AccountEntryResult =
  | { status: "available"; destination: string }
  | { status: "disabled" | "configuration-missing" | "not-provisioned" };

export const CUSTOMER_ACCOUNT_QUERY = `query CustomerAccountUrl { shop { customerAccountUrl } }`;

export function accountHandoffIsEnabled(
  value = process.env.SHOPIFY_ACCOUNT_HANDOFF_ENABLED,
) {
  return value === "true";
}

/** Validates the Shopify-provided hosted destination without constraining vanity domains. */
export function validateCustomerAccountUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new ShopifyStorefrontError(
      "Shopify returned an invalid account destination.",
      "INVALID_RESPONSE",
    );
  }
  if (
    url.protocol !== "https:" ||
    !url.hostname ||
    url.username ||
    url.password
  ) {
    throw new ShopifyStorefrontError(
      "Shopify returned an invalid account destination.",
      "INVALID_RESPONSE",
    );
  }
  return value;
}

export async function getAccountEntry(): Promise<AccountEntryResult> {
  if (!accountHandoffIsEnabled()) return { status: "disabled" };

  if (process.env.SHOPIFY_E2E_FIXTURES === "1") {
    return {
      status: "available",
      destination: validateCustomerAccountUrl(
        "https://accounts.example.test/account",
      ),
    };
  }

  try {
    const response = await storefrontRequest<unknown>(CUSTOMER_ACCOUNT_QUERY);
    const parsed = accountResponseSchema.safeParse(response);
    if (!parsed.success) {
      throw new ShopifyStorefrontError(
        "Shopify returned an invalid response.",
        "INVALID_RESPONSE",
      );
    }
    if (parsed.data.shop.customerAccountUrl === null)
      return { status: "not-provisioned" };
    return {
      status: "available",
      destination: validateCustomerAccountUrl(
        parsed.data.shop.customerAccountUrl,
      ),
    };
  } catch (error) {
    if (
      error instanceof ShopifyStorefrontError &&
      error.code === "CONFIGURATION"
    ) {
      return { status: "configuration-missing" };
    }
    throw error;
  }
}
