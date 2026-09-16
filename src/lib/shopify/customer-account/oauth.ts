import "server-only";
import * as oidc from "openid-client";
import { z } from "zod";
import type { CustomerConfig } from "./config";

async function metadata(url: string) {
  const r = await fetch(url, {
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(8000),
  });
  if (!r.ok) throw new Error("Account service unavailable");
  return r.json();
}
export async function discoverCustomerClient(settings: CustomerConfig) {
  const server = await metadata(
    `https://${settings.domain}/.well-known/openid-configuration`,
  );
  const match = /^https:\/\/shopify\.com\/authentication\/(\d+)$/.exec(
    server.issuer ?? "",
  );
  if (!match) throw new Error("Unexpected customer issuer");
  const base = server.issuer;
  for (const [field, path] of Object.entries({
    authorization_endpoint: "/oauth/authorize",
    token_endpoint: "/oauth/token",
    end_session_endpoint: "/logout",
    jwks_uri: "/.well-known/jwks.json",
  })) {
    if (server[field] !== base + path)
      throw new Error("Unexpected customer endpoint");
  }
  const api = await metadata(
    `https://${settings.domain}/.well-known/customer-account-api`,
  );
  if (
    typeof api.graphql_api !== "string" ||
    !new RegExp(
      `^https://shopify\\.com/${match[1]}/account/customer/api/\\d{4}-\\d{2}/graphql$`,
    ).test(api.graphql_api)
  )
    throw new Error("Unexpected customer API");
  const client = new oidc.Configuration(
    server,
    settings.clientId,
    { id_token_signed_response_alg: "RS256" },
    oidc.ClientSecretBasic(settings.clientSecret),
  );
  client.timeout = 8;
  client[oidc.customFetch] = (url, options) =>
    fetch(url, {
      ...options,
      body:
        options.body instanceof Uint8Array
          ? new Uint8Array(options.body).buffer
          : options.body,
      cache: "no-store",
      redirect: "error",
    });
  oidc.enableNonRepudiationChecks(client);
  return {
    client,
    graphql: `https://shopify.com/${match[1]}/account/customer/api/2026-07/graphql`,
    orders: `https://shopify.com/${match[1]}/account/orders`,
  };
}
export const transactionSchema = z.object({
  state: z.string(),
  nonce: z.string(),
  verifier: z.string(),
  returnTo: z.string(),
  expiresAt: z.number(),
});
export const sessionSchema = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
  idToken: z.string().min(1),
  subject: z.string().min(1),
  tokenExpiresAt: z.number(),
  expiresAt: z.number(),
});
export type CustomerSession = z.infer<typeof sessionSchema>;
export function sessionFromTokens(
  tokens: oidc.TokenEndpointResponse & oidc.TokenEndpointResponseHelpers,
  expiresAt: number,
  previous?: CustomerSession,
): CustomerSession {
  const claims = tokens.claims();
  if (previous && claims && claims.sub !== previous.subject)
    throw new Error("Customer identity mismatch");
  const lifetime = tokens.expires_in;
  if (
    typeof lifetime !== "number" ||
    !Number.isFinite(lifetime) ||
    lifetime <= 0
  )
    throw new Error("Missing token expiry");
  return sessionSchema.parse({
    accessToken: tokens.access_token,
    refreshToken: tokens.refresh_token ?? previous?.refreshToken,
    idToken: tokens.id_token ?? previous?.idToken,
    subject: claims?.sub ?? previous?.subject,
    tokenExpiresAt: Date.now() + lifetime * 1000,
    expiresAt,
  });
}
