import "server-only";

import { cookies } from "next/headers";
import { emptyCart, type CartContract } from "@/lib/shopify/cart-contract";
import { getCart, toPublicCart } from "@/lib/shopify/cart";

const COOKIE = "infusion_cart";
const opaqueId = /^gid:\/\/shopify\/Cart\/[A-Za-z0-9_-]+(?:\?[^\s#]{1,256})?$/;
export function validCartId(value: unknown): value is string {
  return (
    typeof value === "string" && value.length <= 512 && opaqueId.test(value)
  );
}
export async function readCartId() {
  const value = (await cookies()).get(COOKIE)?.value;
  return validCartId(value) ? value : undefined;
}
export async function writeCartId(id: string) {
  if (!validCartId(id)) throw new Error("Invalid cart session.");
  (await cookies()).set(COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}
export async function clearCartId() {
  (await cookies()).delete(COOKIE);
}
export async function readCart(): Promise<CartContract> {
  const id = await readCartId();
  if (!id) return emptyCart;
  try {
    const cart = await getCart(id);
    if (!cart) {
      await clearCartId();
      return emptyCart;
    }
    return toPublicCart(cart);
  } catch {
    return {
      ...emptyCart,
      message: "We could not refresh your bag. Please try again.",
    };
  }
}
export function checkoutIsEnabled() {
  return process.env.SHOPIFY_CHECKOUT_ENABLED === "true";
}
