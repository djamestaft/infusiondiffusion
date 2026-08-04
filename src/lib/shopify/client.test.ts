import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  ShopifyStorefrontError,
  storefrontRequest,
} from "@/lib/shopify/client";

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env.SHOPIFY_STORE_DOMAIN = "infusiondiffusion.myshopify.com";
  process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN = "private-test-token";
  process.env.SHOPIFY_STOREFRONT_API_VERSION = "2026-07";
});

afterEach(() => {
  process.env = { ...originalEnv };
  vi.restoreAllMocks();
});

describe("storefrontRequest", () => {
  it("sends a private server-side request without exposing the token in the URL", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({ data: { shop: { name: "InfusionDiffusion" } } }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );

    await expect(
      storefrontRequest("query Shop { shop { name } }", {
        buyerIp: "203.0.113.10",
      }),
    ).resolves.toEqual({ shop: { name: "InfusionDiffusion" } });

    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe(
      "https://infusiondiffusion.myshopify.com/api/2026-07/graphql.json",
    );
    expect(String(url)).not.toContain("private-test-token");
    expect(
      new Headers(request?.headers).get("Shopify-Storefront-Private-Token"),
    ).toBe("private-test-token");
    expect(
      new Headers(request?.headers).get("Shopify-Storefront-Buyer-IP"),
    ).toBe("203.0.113.10");
  });

  it("fails closed when configuration is missing", async () => {
    delete process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN;
    await expect(
      storefrontRequest("query { shop { name } }"),
    ).rejects.toMatchObject({ code: "CONFIGURATION" });
  });

  it("normalizes network and HTTP failures without leaking response details", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(
      new Error("token private-test-token"),
    );
    await expect(storefrontRequest("query { shop { name } }")).rejects.toEqual(
      expect.objectContaining({
        code: "HTTP",
        message: "Shopify Storefront API request failed.",
      }),
    );

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ error: "upstream" }), { status: 503 }),
    );
    await expect(
      storefrontRequest("query { shop { name } }"),
    ).rejects.toMatchObject({ code: "HTTP", status: 503 });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response("Service unavailable", { status: 502 }),
    );
    await expect(
      storefrontRequest("query { shop { name } }"),
    ).rejects.toMatchObject({ code: "HTTP", status: 502 });
  });

  it("reports GraphQL and malformed JSON responses explicitly", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ errors: [{ message: "Denied" }] }), {
        status: 200,
      }),
    );
    await expect(
      storefrontRequest("query { shop { name } }"),
    ).rejects.toMatchObject({ code: "GRAPHQL" });

    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response("not-json", { status: 200 }),
    );
    await expect(
      storefrontRequest("query { shop { name } }"),
    ).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });

  it("rejects an API version fall-forward", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ data: { shop: { name: "Store" } } }), {
        status: 200,
        headers: { "X-Shopify-API-Version": "2026-04" },
      }),
    );
    await expect(
      storefrontRequest("query { shop { name } }"),
    ).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
  });

  it("uses a typed error without retaining secret fields", () => {
    const error = new ShopifyStorefrontError("Safe message", "HTTP", 500);
    expect(error).toMatchObject({
      name: "ShopifyStorefrontError",
      message: "Safe message",
      code: "HTTP",
      status: 500,
    });
    expect(JSON.stringify(error)).not.toContain("private-test-token");
  });
});
