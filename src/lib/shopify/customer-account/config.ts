import "server-only";
import { createHash } from "node:crypto";

export function readCustomerConfig(
  env: Record<string, string | undefined> = process.env,
) {
  if (env.SHOPIFY_CUSTOMER_SESSION_ENABLED !== "true") return null;
  const required = (key: string) => {
    const value = env[key]?.trim();
    if (!value) throw new Error("Customer session configuration is incomplete");
    return value;
  };
  const origin = new URL(required("SHOPIFY_CUSTOMER_ORIGIN"));
  if (
    origin.protocol !== "https:" ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  )
    throw new Error("Invalid customer origin");
  const domain = required("SHOPIFY_STORE_DOMAIN");
  if (!/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(domain))
    throw new Error("Invalid Shopify domain");
  const redisUrl = new URL(required("UPSTASH_REDIS_REST_URL"));
  if (
    redisUrl.protocol !== "https:" ||
    !redisUrl.hostname.endsWith(".upstash.io") ||
    redisUrl.username ||
    redisUrl.password ||
    redisUrl.pathname !== "/" ||
    redisUrl.search ||
    redisUrl.hash
  )
    throw new Error("Invalid session store");
  const key = required("SHOPIFY_CUSTOMER_SESSION_KEY");
  if (!/^[a-f0-9]{64}$/i.test(key))
    throw new Error("Invalid customer encryption key");
  const clientId = required("SHOPIFY_CUSTOMER_CLIENT_ID");
  return {
    origin: origin.origin,
    domain,
    clientId,
    clientSecret: required("SHOPIFY_CUSTOMER_CLIENT_SECRET"),
    key,
    redisUrl: redisUrl.origin,
    redisToken: required("UPSTASH_REDIS_REST_TOKEN"),
    // Separate stores/environments/clients even when sharing a Redis database.
    prefix:
      "customer:" +
      createHash("sha256")
        .update(`${origin.origin}:${domain}:${clientId}`)
        .digest("hex")
        .slice(0, 24),
    callback: `${origin.origin}/account/callback`,
    logout: `${origin.origin}/account`,
  };
}
export type CustomerConfig = NonNullable<ReturnType<typeof readCustomerConfig>>;
export const SESSION_SECONDS = 7 * 24 * 60 * 60;
export const SESSION_COOKIE = "__Host-infusion-customer";
export const TRANSACTION_COOKIE = "__Host-infusion-customer-login";
export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax" as const,
  path: "/",
};

export function safeReturnPath(value: string | null) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\u0000-\u0020]/.test(value) ||
    /%[0-9a-f]{2}/i.test(value) ||
    /^\/account\/(login|callback|logout)(?:[/?#]|$)/.test(value)
  )
    return "/account";
  return value;
}
