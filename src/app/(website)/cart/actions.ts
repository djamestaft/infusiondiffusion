"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CartContract } from "@/lib/shopify/cart-contract";
import {
  addCartLines,
  createCart,
  getCart,
  removeCartLine,
  updateCartLine,
  toPublicCart,
  type ShopifyCart,
} from "@/lib/shopify/cart";
import {
  checkoutIsEnabled,
  readCart,
  readCartId,
  writeCartId,
} from "@/lib/shopify/cart-session";
import {
  isValidCartLineId,
  isValidCartQuantity,
  isValidMerchandiseId,
} from "@/lib/shopify/cart-identifiers";

function safeMerchandiseId(value: string) {
  if (!isValidMerchandiseId(value))
    throw new Error("That cart request is invalid.");
  return value;
}
function safeLineId(value: string) {
  if (!isValidCartLineId(value))
    throw new Error("That cart request is invalid.");
  return value;
}
function safeQuantity(value: number) {
  if (!isValidCartQuantity(value))
    throw new Error("Choose a quantity from 1 to 99.");
  return value;
}
function refresh() {
  revalidatePath("/cart");
  revalidatePath("/shop");
}

export async function addToCartAction(
  merchandiseId: string,
): Promise<CartContract> {
  safeMerchandiseId(merchandiseId);
  const cartId = await readCartId();
  let cart: ShopifyCart;
  if (cartId) {
    const current = await getCart(cartId);
    cart = current
      ? await addCartLines(cartId, merchandiseId)
      : await createCart(merchandiseId);
  } else {
    cart = await createCart(merchandiseId);
  }
  await writeCartId(cart.id);
  refresh();
  return toPublicCart(cart);
}
export async function updateLineAction(lineId: string, quantity: number) {
  try {
    const cartId = await readCartId();
    if (!cartId) return readCart();
    const cart = await updateCartLine(
      cartId,
      safeLineId(lineId),
      safeQuantity(quantity),
    );
    refresh();
    return toPublicCart(cart);
  } catch {
    throw new Error("CART_UPDATE_FAILED");
  }
}
export async function removeLineAction(lineId: string) {
  try {
    const cartId = await readCartId();
    if (!cartId) return readCart();
    const cart = await removeCartLine(cartId, safeLineId(lineId));
    refresh();
    return toPublicCart(cart);
  } catch {
    throw new Error("CART_REMOVE_FAILED");
  }
}
export async function checkoutAction(): Promise<never> {
  if (!checkoutIsEnabled()) throw new Error("Checkout is not available yet.");
  const cartId = await readCartId();
  if (!cartId) redirect("/cart");
  const cart = await getCart(cartId);
  if (!cart?.checkoutUrl) redirect("/cart");
  const target = new URL(cart.checkoutUrl);
  const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(
    /^https?:\/\//,
    "",
  ).replace(/\/$/, "");
  if (target.protocol !== "https:" || target.hostname !== domain)
    throw new Error("Shopify returned an invalid checkout destination.");
  redirect(target.toString());
}
