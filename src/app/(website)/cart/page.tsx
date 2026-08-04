import type { Metadata } from "next";
import { Suspense } from "react";
import { CartPage } from "@/components/cart/cart-page";
import { Navigation } from "@/components/navigation";
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
    <div className="bg-content-surface text-content-primary min-h-dvh">
      <Navigation cartCount={cart.totalQuantity} cartHref="/cart" />
      <CartPage
        initialCart={cart}
        checkoutEnabled={checkoutIsEnabled()}
        updateLine={updateLineAction}
        removeLine={removeLineAction}
        checkoutAction={checkoutAction}
      />
    </div>
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
