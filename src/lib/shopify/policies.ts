import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";
import { findPolicy } from "@/lib/policy-links";
import {
  storefrontRequest,
  ShopifyStorefrontError,
} from "@/lib/shopify/client";
import { sanitizePolicyHtml } from "@/lib/shopify/policy-html";

const policySchema = z.object({ body: z.string() }).nullable();
const responseSchema = z.object({
  shop: z.object({
    privacyPolicy: policySchema,
    refundPolicy: policySchema,
    shippingPolicy: policySchema,
    termsOfService: policySchema,
  }),
});

export async function getPolicy(slug: string) {
  "use cache";
  cacheLife({ stale: 60, revalidate: 300, expire: 900 });
  cacheTag("shopify:policies");
  const definition = findPolicy(slug);
  if (!definition) return null;
  // Match the catalog fixture guard: never use test content in production.
  if (
    process.env.NODE_ENV === "development" &&
    process.env.CI === "true" &&
    process.env.SHOPIFY_E2E_FIXTURES === "1"
  ) {
    return {
      title: definition.label,
      html: "<p>Policy fixture for automated journey tests.</p><h2>Contact</h2><p>Contact Dione Smith about your order or privacy request.</p>",
    };
  }
  const response = responseSchema.safeParse(
    await storefrontRequest<unknown>(`
    query StorePolicies {
      shop {
        privacyPolicy { body }
        refundPolicy { body }
        shippingPolicy { body }
        termsOfService { body }
      }
    }
  `),
  );
  if (!response.success)
    throw new ShopifyStorefrontError(
      "Invalid policy response.",
      "INVALID_RESPONSE",
    );
  const raw = response.data.shop[definition.field];
  const html = raw ? sanitizePolicyHtml(raw.body) : "";
  if (!html || !sanitizeHtmlText(html)) {
    throw new ShopifyStorefrontError(
      "This policy is currently unavailable.",
      "NOT_FOUND",
    );
  }
  return { title: definition.label, html };
}

function sanitizeHtmlText(html: string) {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim();
}
