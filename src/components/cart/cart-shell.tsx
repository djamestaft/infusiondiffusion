"use client";

import { useState } from "react";

import { CartPage } from "@/components/cart/cart-page";
import { Navigation } from "@/components/navigation";
import { StorefrontFooter } from "@/components/storefront-footer";
import type { CartContract } from "@/lib/shopify/cart-contract";

export function CartShell({
  initialCart,
  checkoutEnabled,
  updateLine,
  removeLine,
  checkoutAction,
}: {
  initialCart: CartContract;
  checkoutEnabled: boolean;
  updateLine: (lineId: string, quantity: number) => Promise<CartContract>;
  removeLine: (lineId: string) => Promise<CartContract>;
  checkoutAction: () => Promise<void>;
}) {
  const [cartCount, setCartCount] = useState(initialCart.totalQuantity);

  return (
    <div className="bg-content-surface text-content-primary min-h-dvh">
      <Navigation cartCount={cartCount} cartHref="/cart" />
      <CartPage
        initialCart={initialCart}
        checkoutEnabled={checkoutEnabled}
        updateLine={updateLine}
        removeLine={removeLine}
        checkoutAction={checkoutAction}
        onCartChange={(cart) => setCartCount(cart.totalQuantity)}
      />
      <StorefrontFooter />
    </div>
  );
}
