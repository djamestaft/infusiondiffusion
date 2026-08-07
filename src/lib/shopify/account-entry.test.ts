import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/shopify/client", () => ({
  storefrontRequest: vi.fn(),
  ShopifyStorefrontError: class ShopifyStorefrontError extends Error {
    code: string;
    constructor(message: string, code: string) {
      super(message);
      this.code = code;
    }
  },
}));

import {
  ShopifyStorefrontError,
  storefrontRequest,
} from "@/lib/shopify/client";
import {
  CUSTOMER_ACCOUNT_QUERY,
  getAccountEntry,
  validateCustomerAccountUrl,
} from "@/lib/shopify/account-entry";

const validDestination =
  "https://accounts.example.test/account/%7Ecustomer?return_to=%2Forders&state=a%2Bb";

describe("account entry boundary", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    delete process.env.SHOPIFY_ACCOUNT_HANDOFF_ENABLED;
    delete process.env.SHOPIFY_E2E_FIXTURES;
  });

  it("does not contact Shopify unless the flag is exactly true", async () => {
    for (const value of [undefined, "", "false", "1", "TRUE"]) {
      process.env.SHOPIFY_ACCOUNT_HANDOFF_ENABLED = value;
      await expect(getAccountEntry()).resolves.toEqual({ status: "disabled" });
    }
    expect(storefrontRequest).not.toHaveBeenCalled();
  });

  it("queries only the account destination and preserves a validated provider value verbatim", async () => {
    process.env.SHOPIFY_ACCOUNT_HANDOFF_ENABLED = "true";
    vi.mocked(storefrontRequest)
      .mockResolvedValueOnce({ shop: { customerAccountUrl: validDestination } })
      .mockResolvedValueOnce({ shop: { customerAccountUrl: null } });
    await expect(getAccountEntry()).resolves.toEqual({
      status: "available",
      destination: validDestination,
    });
    await expect(getAccountEntry()).resolves.toEqual({
      status: "not-provisioned",
    });
    expect(storefrontRequest).toHaveBeenCalledWith(CUSTOMER_ACCOUNT_QUERY);
    expect(validateCustomerAccountUrl(validDestination)).toBe(validDestination);
  });

  it("rejects empty, non-HTTPS, relative, credentialed, and malformed provider destinations", () => {
    for (const value of [
      "",
      "http://accounts.example.test",
      "/account",
      "https://user:pass@accounts.example.test",
      "not a URL",
    ]) {
      expect(() => validateCustomerAccountUrl(value)).toThrow(
        "invalid account destination",
      );
    }
  });

  it("uses the fixture only after the explicit flag and validates its inert HTTPS destination", async () => {
    process.env.SHOPIFY_E2E_FIXTURES = "1";
    await expect(getAccountEntry()).resolves.toEqual({ status: "disabled" });
    process.env.SHOPIFY_ACCOUNT_HANDOFF_ENABLED = "true";
    await expect(getAccountEntry()).resolves.toEqual({
      status: "available",
      destination: "https://accounts.example.test/account",
    });
    expect(storefrontRequest).not.toHaveBeenCalled();
  });

  it("maps only configuration failure and propagates HTTP, GraphQL, version, and malformed provider failures", async () => {
    process.env.SHOPIFY_ACCOUNT_HANDOFF_ENABLED = "true";
    vi.mocked(storefrontRequest).mockRejectedValueOnce(
      new ShopifyStorefrontError("configuration", "CONFIGURATION"),
    );
    await expect(getAccountEntry()).resolves.toEqual({
      status: "configuration-missing",
    });
    for (const code of ["HTTP", "GRAPHQL", "INVALID_RESPONSE"] as const) {
      vi.mocked(storefrontRequest).mockRejectedValueOnce(
        new ShopifyStorefrontError("sanitized upstream failure", code),
      );
      await expect(getAccountEntry()).rejects.toThrow(
        "sanitized upstream failure",
      );
    }
    vi.mocked(storefrontRequest).mockResolvedValueOnce({
      shop: { customerAccountUrl: 42 },
    });
    await expect(getAccountEntry()).rejects.toThrow("invalid response");
  });
});
