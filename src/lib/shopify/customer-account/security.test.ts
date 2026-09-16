// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
import { readCustomerConfig, safeReturnPath } from "./config";
import { seal, unseal, newIdentifier } from "./crypto";
import { normalizeProfile } from "./profile";
const env = {
  SHOPIFY_CUSTOMER_SESSION_ENABLED: "true",
  SHOPIFY_STORE_DOMAIN: "example.myshopify.com",
  SHOPIFY_CUSTOMER_CLIENT_ID: "client",
  SHOPIFY_CUSTOMER_CLIENT_SECRET: "secret",
  SHOPIFY_CUSTOMER_ORIGIN: "https://store.example",
  SHOPIFY_CUSTOMER_SESSION_KEY: "ab".repeat(32),
  UPSTASH_REDIS_REST_URL: "https://example.upstash.io",
  UPSTASH_REDIS_REST_TOKEN: "redis-token",
};
describe("customer security boundaries", () => {
  it("is off unless explicitly enabled and completely configured", () => {
    expect(readCustomerConfig({})).toBeNull();
    expect(() =>
      readCustomerConfig({ ...env, SHOPIFY_CUSTOMER_CLIENT_SECRET: "" }),
    ).toThrow();
    expect(readCustomerConfig(env)?.origin).toBe("https://store.example");
  });
  it.each([
    "http://store.example",
    "https://user:pass@store.example",
    "https://store.example/path",
    "https://store.example?x=1",
  ])("rejects unsafe origin %s", (origin) => {
    expect(() =>
      readCustomerConfig({ ...env, SHOPIFY_CUSTOMER_ORIGIN: origin }),
    ).toThrow();
  });
  it.each([
    "https://evil.test",
    "//evil.test",
    "/\\evil.test",
    "/%2f%2fevil.test",
    "/account/callback?code=x",
    "/account/logout",
    "/shop\n",
  ])("rejects unsafe return %s", (path) =>
    expect(safeReturnPath(path)).toBe("/account"),
  );
  it("preserves safe product and collection returns", () =>
    expect(safeReturnPath("/shop?sort=price")).toBe("/shop?sort=price"));
  it("encrypts tokens with context binding and rejects tampering", () => {
    const ciphertext = seal(
      { accessToken: "private" },
      env.SHOPIFY_CUSTOMER_SESSION_KEY,
      "session:one",
    );
    expect(ciphertext).not.toContain("private");
    expect(
      unseal(ciphertext, env.SHOPIFY_CUSTOMER_SESSION_KEY, "session:one"),
    ).toEqual({ accessToken: "private" });
    expect(() =>
      unseal(ciphertext, env.SHOPIFY_CUSTOMER_SESSION_KEY, "session:two"),
    ).toThrow();
    expect(() =>
      unseal("x" + ciphertext, env.SHOPIFY_CUSTOMER_SESSION_KEY, "session:one"),
    ).toThrow();
    expect(newIdentifier()).toMatch(/^[a-zA-Z0-9_-]{43}$/);
  });
  it("normalizes only customer display data and derives Unicode name initials", () => {
    expect(
      normalizeProfile({
        id: "gid://shopify/Customer/1",
        firstName: " Élodie ",
        lastName: " 李 ",
        emailAddress: { emailAddress: "test@example.test" },
        secret: "never",
      }),
    ).toEqual({
      name: "Élodie 李",
      email: "test@example.test",
      initials: "É李",
    });
    expect(normalizeProfile({ firstName: "👩🏽‍💻", lastName: null })).toEqual({
      name: "👩🏽‍💻",
      email: null,
      initials: "👩🏽‍💻",
    });
    expect(
      normalizeProfile({ emailAddress: { emailAddress: "test@example.test" } })
        .initials,
    ).toBeNull();
  });
});
