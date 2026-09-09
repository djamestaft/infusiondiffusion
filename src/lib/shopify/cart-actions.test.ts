import { beforeEach, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/shopify/cart", () => ({
  getCart: vi.fn(),
  createCart: vi.fn(),
  addCartLines: vi.fn(),
  toPublicCart: vi.fn((cart) => cart),
}));
vi.mock("@/lib/shopify/cart-session", () => ({
  readCartId: vi.fn(),
  writeCartId: vi.fn(),
}));
import { addToCartAction } from "@/app/(website)/cart/actions";
import { createCart, getCart } from "./cart";
import { readCartId, writeCartId } from "./cart-session";

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(readCartId).mockResolvedValue("gid://shopify/Cart/expired");
});

it("replaces only a confirmed expired cart through the add action", async () => {
  vi.mocked(getCart).mockResolvedValueOnce(null);
  vi.mocked(createCart).mockResolvedValueOnce({
    id: "gid://shopify/Cart/new",
  } as never);
  await addToCartAction("gid://shopify/ProductVariant/123");
  expect(createCart).toHaveBeenCalledWith("gid://shopify/ProductVariant/123");
  expect(writeCartId).toHaveBeenCalledWith("gid://shopify/Cart/new");
});

it("does not replace a saved cart when its lookup fails", async () => {
  vi.mocked(getCart).mockRejectedValueOnce(new Error("upstream failed"));
  await expect(
    addToCartAction("gid://shopify/ProductVariant/123"),
  ).rejects.toThrow();
  expect(createCart).not.toHaveBeenCalled();
  expect(writeCartId).not.toHaveBeenCalled();
});
