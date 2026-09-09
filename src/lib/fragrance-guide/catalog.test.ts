import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
const getCachedProducts = vi.hoisted(() => vi.fn());
vi.mock("@/lib/shopify/cached-catalog", () => ({ getCachedProducts }));
import { getGuideProducts } from "./catalog";
beforeEach(() => vi.clearAllMocks());
it("resolves by GID with current handles and minimal public fields", async () => {
  getCachedProducts.mockResolvedValue([
    {
      id: "gid://shopify/Product/10067255558430",
      title: "Current title",
      handle: "changed-handle",
      availableForSale: false,
      priceRange: { secret: "not returned" },
    },
    { id: "gid://shopify/Product/999", title: "Unmapped product" },
  ]);
  expect(await getGuideProducts()).toEqual([
    {
      id: "gid://shopify/Product/10067255558430",
      title: "Current title",
      handle: "changed-handle",
      availableForSale: false,
    },
  ]);
});
it("keeps missing products distinct from a source failure", async () => {
  getCachedProducts.mockResolvedValue([]);
  expect(await getGuideProducts()).toEqual([]);
  getCachedProducts.mockRejectedValue(new Error("private upstream details"));
  const log = vi.spyOn(console, "error").mockImplementation(() => {});
  expect(await getGuideProducts()).toBeNull();
  expect(log).toHaveBeenCalledExactlyOnceWith(
    "Unable to load fragrance guide products.",
  );
  log.mockRestore();
});
