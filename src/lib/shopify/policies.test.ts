import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("./client", async (original) => ({
  ...(await original<typeof import("./client")>()),
  storefrontRequest: vi.fn(),
}));
import { storefrontRequest, ShopifyStorefrontError } from "./client";
import { getPolicy } from "./policies";
const request = vi.mocked(storefrontRequest);
beforeEach(() => {
  request.mockReset();
});
const shop = {
  privacyPolicy: null,
  refundPolicy: null,
  shippingPolicy: null,
  termsOfService: null,
};
describe("published policies", () => {
  it("does not query Shopify for an unknown slug", async () => {
    expect(await getPolicy("invented")).toBeNull();
    expect(request).not.toHaveBeenCalled();
  });
  it("maps the published Shopify policy and sanitizes it", async () => {
    request.mockResolvedValue({
      shop: {
        ...shop,
        shippingPolicy: { body: "<p>Free delivery</p><script>bad()</script>" },
      },
    });
    expect(await getPolicy("shipping")).toEqual({
      title: "Shipping & Delivery",
      html: "<p>Free delivery</p>",
    });
    expect(request).toHaveBeenCalledWith(
      expect.stringContaining("shippingPolicy { body }"),
    );
  });
  it.each([null, { body: "" }, { body: "<script>bad()</script>" }])(
    "rejects missing/empty policy %j",
    async (policy) => {
      request.mockResolvedValue({ shop: { ...shop, shippingPolicy: policy } });
      await expect(getPolicy("shipping")).rejects.toThrow(
        "currently unavailable",
      );
    },
  );
  it("reads updated published text on the next request", async () => {
    request.mockResolvedValueOnce({
      shop: { ...shop, privacyPolicy: { body: "<p>Version one</p>" } },
    });
    request.mockResolvedValueOnce({
      shop: { ...shop, privacyPolicy: { body: "<p>Version two</p>" } },
    });
    expect((await getPolicy("privacy"))?.html).toBe("<p>Version one</p>");
    expect((await getPolicy("privacy"))?.html).toBe("<p>Version two</p>");
    expect(request).toHaveBeenCalledTimes(2);
  });
  it("rejects an invalid API contract", async () => {
    request.mockResolvedValue({ shop: {} });
    await expect(getPolicy("privacy")).rejects.toThrow("Invalid policy");
  });
  it("retries one transport failure without swallowing a persistent failure", async () => {
    const transportError = new ShopifyStorefrontError(
      "Connection failed",
      "HTTP",
    );
    request
      .mockRejectedValueOnce(transportError)
      .mockResolvedValueOnce({
        shop: { ...shop, privacyPolicy: { body: "<p>Privacy</p>" } },
      });
    expect((await getPolicy("privacy"))?.html).toBe("<p>Privacy</p>");
    expect(request).toHaveBeenCalledTimes(2);
    request.mockReset().mockRejectedValue(transportError);
    await expect(getPolicy("privacy")).rejects.toThrow("Connection failed");
    expect(request).toHaveBeenCalledTimes(2);
  });
  it("propagates API outages to the recoverable error boundary", async () => {
    request.mockRejectedValue(new Error("offline"));
    await expect(getPolicy("privacy")).rejects.toThrow("offline");
  });
});
