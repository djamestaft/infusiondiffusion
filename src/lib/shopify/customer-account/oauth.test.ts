// @vitest-environment node
import { afterEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { discoverCustomerClient } from "./oauth";
import type { CustomerConfig } from "./config";
const config = {
  domain: "example.myshopify.com",
  clientId: "test",
  clientSecret: "secret",
} as CustomerConfig;
const metadata = {
  issuer: "https://shopify.com/authentication/123",
  authorization_endpoint:
    "https://shopify.com/authentication/123/oauth/authorize",
  token_endpoint: "https://shopify.com/authentication/123/oauth/token",
  jwks_uri: "https://shopify.com/authentication/123/.well-known/jwks.json",
  end_session_endpoint: "https://shopify.com/authentication/123/logout",
  response_types_supported: ["code"],
  subject_types_supported: ["public"],
  id_token_signing_alg_values_supported: ["RS256"],
};
afterEach(() => vi.unstubAllGlobals());
it("discovers trusted Shopify metadata and pins the customer API version", async () => {
  vi.stubGlobal(
    "fetch",
    vi
      .fn()
      .mockResolvedValueOnce(Response.json(metadata))
      .mockResolvedValueOnce(
        Response.json({
          graphql_api:
            "https://shopify.com/123/account/customer/api/2026-07/graphql",
        }),
      ),
  );
  expect((await discoverCustomerClient(config)).graphql).toBe(
    "https://shopify.com/123/account/customer/api/2026-07/graphql",
  );
});
it.each([
  "http://shopify.com/x",
  "https://evil.test/oauth/token",
  "https://shopify.com/authentication/999/oauth/token",
])("rejects a mismatched token endpoint %s", async (token_endpoint) => {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(Response.json({ ...metadata, token_endpoint })),
  );
  await expect(discoverCustomerClient(config)).rejects.toThrow();
});
