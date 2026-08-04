import type { Metadata } from "next";
import { Suspense } from "react";
import { CartShell } from "@/components/cart/cart-shell";
import {
  checkoutAction,
  removeLineAction,
  updateLineAction,
} from "@/app/(website)/cart/actions";
import { checkoutIsEnabled, readCart } from "@/lib/shopify/cart-session";

export const metadata: Metadata = {
  title: "Your bag | Infusion Diffusion",
  robots: { index: false, follow: false },
};
async function CartContent() {
  const cart = await readCart();
  return (
    <CartShell
      initialCart={cart}
      checkoutEnabled={checkoutIsEnabled()}
      updateLine={updateLineAction}
      removeLine={removeLineAction}
      checkoutAction={checkoutAction}
    />
  );
}

export default function CartRoute() {
  return (
    <Suspense
      fallback={
        <div className="bg-content-surface min-h-dvh" aria-busy="true" />
      }
    >
      <CartContent />
    </Suspense>
  );
}
