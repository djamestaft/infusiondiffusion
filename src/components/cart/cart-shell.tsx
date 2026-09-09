"use client";

import { useState } from "react";

import { CartPage } from "@/components/cart/cart-page";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import {
  cartNavigationCount,
  type CartContract,
} from "@/lib/shopify/cart-contract";

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
  const [cartCount, setCartCount] = useState(cartNavigationCount(initialCart));

  return (
    <div className="bg-content-surface text-content-primary min-h-dvh">
      <Navigation theme="midnight" cartCount={cartCount} cartHref="/cart" />
      <CartPage
        initialCart={initialCart}
        checkoutEnabled={checkoutEnabled}
        updateLine={updateLine}
        removeLine={removeLine}
        checkoutAction={checkoutAction}
        onCartChange={(cart) => setCartCount(cartNavigationCount(cart))}
      />
      <Footer />
    </div>
  );
}
