// @vitest-environment node
import { generateKeyPairSync, createSign } from "node:crypto";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import * as oidc from "openid-client";
import { discoverCustomerClient, sessionFromTokens } from "./oauth";
vi.mock("server-only", () => ({}));
const store = vi.hoisted(() => ({
  claimLogin: vi.fn(),
  remove: vi.fn(),
  commitLogin: vi.fn(),
}));
vi.mock("./store", () => ({
  SessionStore: class {
    claimLogin = store.claimLogin;
    remove = store.remove;
    commitLogin = store.commitLogin;
  },
}));
import { accountCallback } from "./handlers";
import {
  SESSION_COOKIE,
  TRANSACTION_COOKIE,
  readCustomerConfig,
} from "./config";
const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const badKeys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const issuer = "https://shopify.com/authentication/123";
const clientId = "client-id_with.punctuation";
const clientSecret = "secret-with_punctuation";
const server = {
  issuer,
  authorization_endpoint: issuer + "/oauth/authorize",
  token_endpoint: issuer + "/oauth/token",
  jwks_uri: issuer + "/.well-known/jwks.json",
  end_session_endpoint: issuer + "/logout",
  response_types_supported: ["code"],
  subject_types_supported: ["public"],
  id_token_signing_alg_values_supported: ["RS256"],
};
const transaction = {
  state: "state",
  nonce: "nonce",
  verifier: "x".repeat(43),
  returnTo: "/shop",
  expiresAt: Date.now() + 600000,
};
const callback = () =>
  new NextRequest(
    "https://store.example/account/callback?code=test&state=state",
    { headers: { cookie: `${TRANSACTION_COOKIE}=${"x".repeat(43)}` } },
  );
const jwt = (
  overrides: Record<string, unknown> = {},
  badSignature = false,
  headerOverrides: Record<string, unknown> = {},
) => {
  const parts = [
    { alg: "RS256", kid: "test", typ: "JWT", ...headerOverrides },
    {
      iss: issuer,
      aud: clientId,
      sub: "customer-one",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 300,
      nonce: "nonce",
      ...overrides,
    },
  ].map((o) => Buffer.from(JSON.stringify(o)).toString("base64url"));
  const data = parts.join(".");
  return (
    data +
    "." +
    createSign("RSA-SHA256")
      .update(data)
      .sign(badSignature ? badKeys.privateKey : keys.privateKey, "base64url")
  );
};
function network(
  overrides: Record<string, unknown> = {},
  badSignature = false,
  tokenOverrides: Record<string, unknown> = {},
) {
  const fetcher = vi.fn(
    async (input: string | URL | Request, init?: RequestInit) => {
      const url = String(input);
      if (url.endsWith("/.well-known/openid-configuration"))
        return Response.json(server);
      if (url.endsWith("/.well-known/customer-account-api"))
        return Response.json({
          graphql_api:
            "https://shopify.com/123/account/customer/api/2026-07/graphql",
        });
      if (url === server.jwks_uri)
        return Response.json({
          keys: [
            {
              ...keys.publicKey.export({ format: "jwk" }),
              kid: "test",
              alg: "RS256",
              use: "sig",
            },
          ],
        });
      if (url === server.token_endpoint) {
        expect(new Headers(init?.headers).get("authorization")).toBe(
          "Basic " +
            Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
        );
        const body = new URLSearchParams(String(init?.body));
        expect(body.get("client_id")).toBe(clientId);
        if (body.get("grant_type") === "refresh_token") {
          expect(body.get("refresh_token")).toBe("private-refresh");
        } else {
          expect(body.get("code_verifier")).toBe(transaction.verifier);
          expect(body.get("redirect_uri")).toBe(
            "https://store.example/account/callback",
          );
        }
        expect(body.has("client_secret")).toBe(false);
        return Response.json({
          token_type: "Bearer",
          access_token: "private-access",
          refresh_token: "private-refresh",
          id_token: jwt(overrides, badSignature),
          expires_in: 3600,
          ...tokenOverrides,
        });
      }
      throw new Error("Unexpected request");
    },
  );
  vi.stubGlobal("fetch", fetcher);
  return fetcher;
}
beforeEach(() => {
  for (const [key, value] of Object.entries({
    SHOPIFY_CUSTOMER_SESSION_ENABLED: "true",
    SHOPIFY_STORE_DOMAIN: "example.myshopify.com",
    SHOPIFY_CUSTOMER_ORIGIN: "https://store.example",
    SHOPIFY_CUSTOMER_CLIENT_ID: clientId,
    SHOPIFY_CUSTOMER_CLIENT_SECRET: clientSecret,
    SHOPIFY_CUSTOMER_SESSION_KEY: "ab".repeat(32),
    UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
    UPSTASH_REDIS_REST_TOKEN: "redis",
  }))
    vi.stubEnv(key, value);
  store.claimLogin.mockResolvedValue({ raw: "encrypted", value: transaction });
  store.commitLogin.mockResolvedValue(true);
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  vi.restoreAllMocks();
});
it("uses literal Shopify Basic credentials with punctuation, verifies identity and rotates the cookie", async () => {
  network();
  const r = await accountCallback(callback());
  expect(r.headers.get("location")).toBe("https://store.example/shop");
  const cookie = r.cookies.get(SESSION_COOKIE)!;
  expect(cookie.value).toMatch(/^[\w-]{43}$/);
  expect(r.headers.get("set-cookie")).toContain("HttpOnly");
  expect(r.headers.get("set-cookie")).toContain("Secure");
  expect(r.headers.get("set-cookie")).not.toContain("private");
  expect(store.commitLogin).toHaveBeenCalledWith(
    "x".repeat(43),
    "encrypted",
    cookie.value,
    expect.objectContaining({ subject: "customer-one" }),
    604800,
  );
});
it("accepts a signed numeric Shopify subject and retains the original signed token", async () => {
  const original = jwt({ sub: 123456789 });
  network({}, false, { id_token: original });
  const r = await accountCallback(callback());
  expect(r.headers.get("location")).toBe("https://store.example/shop");
  const session = store.commitLogin.mock.calls[0][3];
  expect(session.subject).toBe("123456789");
  expect(session.idToken).toBe(original);
  const payload = JSON.parse(
    Buffer.from(session.idToken.split(".")[1], "base64url").toString(),
  );
  expect(payload.sub).toBe(123456789);
});
it.each([
  undefined,
  null,
  false,
  {},
  [],
  0,
  -1,
  1.5,
  Number.MAX_SAFE_INTEGER + 1,
])("rejects a malformed numeric subject %s", async (sub) => {
  network({ sub });
  await accountCallback(callback());
  expect(store.commitLogin).not.toHaveBeenCalled();
});
it.each([
  { nonce: "wrong" },
  { iss: "https://evil.test" },
  { aud: "another-client" },
  { exp: 1 },
  { nonce: undefined },
  { iat: undefined },
  { nbf: Math.floor(Date.now() / 1000) + 3600 },
  { auth_time: "invalid" },
  { aud: [clientId, "untrusted"] },
  { aud: [clientId, "untrusted"], azp: "untrusted" },
])("preserves claim validation for numeric subjects %s", async (overrides) => {
  network({ sub: 123456789, ...overrides });
  await accountCallback(callback());
  expect(store.commitLogin).not.toHaveBeenCalled();
});
it("rejects a forged numeric-subject token", async () => {
  network({ sub: 123456789 }, true);
  await accountCallback(callback());
  expect(store.commitLogin).not.toHaveBeenCalled();
});
it.each([{ alg: "HS256" }, { alg: "none" }, { kid: "unknown-key" }])(
  "rejects numeric-subject tokens with invalid signing headers %s",
  async (headers) => {
    network({}, false, { id_token: jwt({ sub: 123456789 }, false, headers) });
    await accountCallback(callback());
    expect(store.commitLogin).not.toHaveBeenCalled();
  },
);
it("normalizes numeric refresh identity and rejects customer changes", async () => {
  const original = jwt({ sub: 123456789 });
  network({}, false, { id_token: original });
  const { client } = await discoverCustomerClient(readCustomerConfig()!);
  const tokens = await oidc.refreshTokenGrant(client, "private-refresh");
  expect(tokens.id_token).toBe(original);
  const previous = {
    accessToken: "old",
    refreshToken: "private-refresh",
    idToken: "old-id",
    subject: "123456789",
    tokenExpiresAt: 0,
    expiresAt: Date.now() + 86400000,
  };
  expect(sessionFromTokens(tokens, previous.expiresAt, previous).subject).toBe(
    "123456789",
  );
  expect(() =>
    sessionFromTokens(tokens, previous.expiresAt, {
      ...previous,
      subject: "another-customer",
    }),
  ).toThrow("Customer identity mismatch");
});
it("preserves string subjects exactly, including leading zeros", async () => {
  network({ sub: "00123456789" });
  await accountCallback(callback());
  expect(store.commitLogin.mock.calls[0][3].subject).toBe("00123456789");
});
it("does not accept numeric subjects from other identity providers", async () => {
  network({ sub: 123456789, iss: "https://identity.example" });
  const client = new oidc.Configuration(
    { ...server, issuer: "https://identity.example" },
    clientId,
    {},
    (_as, _client, body, headers) => {
      body.set("client_id", clientId);
      headers.set(
        "Authorization",
        "Basic " +
          Buffer.from(`${clientId}:${clientSecret}`).toString("base64"),
      );
    },
  );
  client[oidc.customFetch] = (url, init) => fetch(url, init as RequestInit);
  await expect(
    oidc.refreshTokenGrant(client, "private-refresh"),
  ).rejects.toMatchObject({
    code: "OAUTH_INVALID_RESPONSE",
    cause: { message: 'unexpected JWT "sub" (subject) claim type' },
  });
});
it("still requires the original ID token on login", async () => {
  network({}, false, { id_token: undefined });
  await accountCallback(callback());
  expect(store.commitLogin).not.toHaveBeenCalled();
});
it.each([
  { nonce: "wrong" },
  { iss: "https://evil.test" },
  { aud: "another-client" },
  { exp: 1 },
])("rejects mismatched identity claims %s", async (overrides) => {
  network(overrides);
  const r = await accountCallback(callback());
  expect(r.cookies.get(SESSION_COOKIE)).toBeUndefined();
  expect(store.commitLogin).not.toHaveBeenCalled();
});
it("rejects a forged ID-token signature", async () => {
  network({}, true);
  const r = await accountCallback(callback());
  expect(r.cookies.get(SESSION_COOKIE)).toBeUndefined();
  expect(store.commitLogin).not.toHaveBeenCalled();
});
it("rejects replayed or missing transactions without contacting Shopify", async () => {
  store.claimLogin.mockResolvedValue(null);
  const f = network();
  expect(
    (await accountCallback(callback())).cookies.get(SESSION_COOKIE),
  ).toBeUndefined();
  expect(f).not.toHaveBeenCalled();
});
it("rejects mismatched state without contacting Shopify", async () => {
  store.claimLogin.mockResolvedValue({
    value: { ...transaction, state: "wrong" },
  });
  const f = network();
  await accountCallback(callback());
  expect(f).not.toHaveBeenCalled();
});
it("does not install a cookie when logout revoked the pending login", async () => {
  store.commitLogin.mockResolvedValue(false);
  network();
  expect(
    (await accountCallback(callback())).cookies.get(SESSION_COOKIE),
  ).toBeUndefined();
});
it("requires refresh and expiry data for a persistent session", async () => {
  network({}, false, { refresh_token: undefined, expires_in: undefined });
  await accountCallback(callback());
  expect(store.commitLogin).not.toHaveBeenCalled();
});

it("reports the callback failure stage without logging transaction secrets", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  store.claimLogin.mockRejectedValue(new Error("private-session-and-code"));
  network();
  const response = await accountCallback(callback());
  expect(response.headers.get("location")).toBe(
    "https://store.example/account?notice=error",
  );
  expect(log).toHaveBeenCalledWith(
    "[customer-account] " +
      JSON.stringify({ stage: "callback.claim-login", code: "unknown" }),
  );
  expect(JSON.stringify(log.mock.calls)).not.toContain(
    "private-session-and-code",
  );
});
it("reports an allowlisted JWT failure code without logging its claims", async () => {
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  network({ nonce: "private-wrong-nonce" });
  await accountCallback(callback());
  expect(log).toHaveBeenCalledWith(
    expect.stringContaining('"stage":"callback.exchange"'),
  );
  expect(log).toHaveBeenCalledWith(
    expect.stringContaining('"code":"OAUTH_JWT_CLAIM_COMPARISON_FAILED"'),
  );
  expect(JSON.stringify(log.mock.calls)).not.toContain("private-wrong-nonce");
  expect(JSON.stringify(log.mock.calls)).not.toContain("private-access");
});

it("sends literal Basic credentials and a body client ID when refreshing", async () => {
  network();
  const { client } = await discoverCustomerClient(readCustomerConfig()!);
  const tokens = await oidc.refreshTokenGrant(client, "private-refresh");
  expect(tokens.access_token).toBe("private-access");
});
