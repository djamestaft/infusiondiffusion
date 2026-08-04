import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("@/lib/shopify/client", async (importOriginal) => {
  const original =
    await importOriginal<typeof import("@/lib/shopify/client")>();
  return { ...original, storefrontRequest: vi.fn() };
});

import { getCollection, getProduct, getProducts } from "@/lib/shopify/catalog";
import {
  ShopifyStorefrontError,
  storefrontRequest,
} from "@/lib/shopify/client";

const requestMock = vi.mocked(storefrontRequest);

const productNode = {
  id: "gid://shopify/Product/1",
  handle: "bois-de-santal-200ml",
  title: "Bois De Santal - 200ml",
  description: "A warm sandalwood fragrance.",
  productType: "",
  vendor: "InfusionDiffusion",
  availableForSale: true,
  featuredImage: {
    url: "https://cdn.shopify.com/product.png",
    altText: null,
    width: 1200,
    height: 1600,
  },
  priceRange: {
    minVariantPrice: { amount: "430.0", currencyCode: "ZAR" },
    maxVariantPrice: { amount: "430.0", currencyCode: "ZAR" },
  },
  variants: {
    nodes: [
      {
        id: "gid://shopify/ProductVariant/1",
        title: "Default Title",
        availableForSale: false,
        sku: null,
        price: { amount: "430.0", currencyCode: "ZAR" },
        compareAtPrice: null,
        selectedOptions: [{ name: "Title", value: "Default Title" }],
      },
    ],
  },
};

afterEach(() => vi.clearAllMocks());

describe("Shopify catalogue normalization", () => {
  it("normalizes product summaries and unavailable variants", async () => {
    requestMock.mockResolvedValueOnce({ products: { nodes: [productNode] } });
    const products = await getProducts();
    expect(products[0]).toMatchObject({
      id: productNode.id,
      handle: productNode.handle,
      productType: undefined,
      featuredImage: { altText: undefined, width: 1200 },
      priceRange: { min: { amount: "430.0", currencyCode: "ZAR" } },
      variants: [{ availableForSale: false, sku: undefined }],
    });
  });

  it("normalizes a detailed product with optional SEO and collection data", async () => {
    requestMock.mockResolvedValueOnce({
      product: {
        ...productNode,
        seo: { title: null, description: "Sandalwood home fragrance" },
        images: { nodes: [productNode.featuredImage] },
        collections: {
          nodes: [
            {
              id: "gid://shopify/Collection/1",
              handle: "reed-diffusers",
              title: "Reed Diffusers",
            },
          ],
        },
      },
    });
    await expect(getProduct(productNode.handle)).resolves.toMatchObject({
      seo: { title: undefined, description: "Sandalwood home fragrance" },
      images: [{ url: productNode.featuredImage.url }],
      collections: [{ handle: "reed-diffusers" }],
    });
  });

  it("normalizes collection products", async () => {
    requestMock.mockResolvedValueOnce({
      collection: {
        id: "gid://shopify/Collection/1",
        handle: "reed-diffusers",
        title: "Reed Diffusers",
        description: "",
        image: null,
        products: { nodes: [productNode] },
      },
    });
    await expect(getCollection("reed-diffusers")).resolves.toMatchObject({
      handle: "reed-diffusers",
      image: undefined,
      products: [{ handle: productNode.handle }],
    });
  });

  it("uses explicit not-found errors", async () => {
    requestMock.mockResolvedValueOnce({ product: null });
    await expect(getProduct("missing")).rejects.toEqual(
      expect.objectContaining<Partial<ShopifyStorefrontError>>({
        code: "NOT_FOUND",
        status: 404,
      }),
    );
    requestMock.mockResolvedValueOnce({ collection: null });
    await expect(getCollection("missing")).rejects.toMatchObject({
      code: "NOT_FOUND",
      status: 404,
    });
  });

  it("rejects malformed commerce data instead of inventing values", async () => {
    requestMock.mockResolvedValueOnce({
      products: { nodes: [{ ...productNode, priceRange: null }] },
    });
    await expect(getProducts()).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });

    requestMock.mockResolvedValueOnce({
      products: {
        nodes: [
          {
            ...productNode,
            priceRange: {
              minVariantPrice: { amount: "free", currencyCode: "ZZZZ" },
              maxVariantPrice: { amount: "430.0", currencyCode: "ZAR" },
            },
          },
        ],
      },
    });
    await expect(getProducts()).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });

  it("rejects malformed operation envelopes and invalid page sizes", async () => {
    requestMock.mockResolvedValueOnce({ products: null });
    await expect(getProducts()).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
    await expect(getProducts(0)).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
    await expect(getCollection("reed-diffusers", 251)).rejects.toMatchObject({
      code: "INVALID_RESPONSE",
    });
  });
});
