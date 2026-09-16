// @vitest-environment node
import { generateKeyPairSync, createSign } from "node:crypto";
import { beforeEach, afterEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
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
import { SESSION_COOKIE, TRANSACTION_COOKIE } from "./config";
const keys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const badKeys = generateKeyPairSync("rsa", { modulusLength: 2048 });
const issuer = "https://shopify.com/authentication/123";
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
const jwt = (overrides: Record<string, unknown> = {}, badSignature = false) => {
  const parts = [
    { alg: "RS256", kid: "test", typ: "JWT" },
    {
      iss: issuer,
      aud: "client",
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
          "Basic " + Buffer.from("client:secret").toString("base64"),
        );
        const body = new URLSearchParams(String(init?.body));
        expect(body.get("client_id")).toBe("client");
        expect(body.get("code_verifier")).toBe(transaction.verifier);
        expect(body.get("redirect_uri")).toBe(
          "https://store.example/account/callback",
        );
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
    SHOPIFY_CUSTOMER_CLIENT_ID: "client",
    SHOPIFY_CUSTOMER_CLIENT_SECRET: "secret",
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
});
it("verifies a signed identity then rotates an opaque secure cookie", async () => {
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
