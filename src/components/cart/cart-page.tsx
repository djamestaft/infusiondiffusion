"use client";

import { useState, useTransition } from "react";
import type { CartContract } from "@/lib/shopify/cart-contract";
import { CartLine } from "@/components/cart/cart-line";
import { CartSummary } from "@/components/cart/cart-summary";
import { Button } from "@/components/ui/button";

export function CartPage({
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
  const [cart, setCart] = useState(initialCart);
  const [operationError, setOperationError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const run = (work: () => Promise<CartContract>) =>
    startTransition(async () => {
      try {
        setOperationError(undefined);
        setCart(await work());
      } catch {
        setOperationError(
          "We could not update your bag. Your last confirmed selection is still here.",
        );
      }
    });
  if (!cart.lines.length)
    return (
      <main className="mx-auto min-h-[70dvh] w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <p className="text-content-accent font-sans text-xs font-semibold uppercase">
          Your selection
        </p>
        <h1 className="font-display mt-3 text-5xl">Your bag is empty</h1>
        <p className="text-content-secondary mt-4 font-sans">
          Explore the collection and choose a fragrance for your space.
        </p>
        <Button asChild className="mt-8">
          <a href="/shop">Shop the collection</a>
        </Button>
      </main>
    );
  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-16">
      <header>
        <p className="text-content-accent font-sans text-xs font-semibold uppercase">
          Your selection
        </p>
        <h1 className="font-display mt-3 text-5xl">Your bag</h1>
        <p className="text-content-secondary mt-3 font-sans">
          {cart.totalQuantity} items held for this visit. Prices and
          availability refresh with every change.
        </p>
      </header>
      {cart.message ? (
        <p role="status" className="mt-6 font-sans text-sm">
          {cart.message}
        </p>
      ) : null}
      {operationError ? (
        <p role="alert" className="text-feedback-error mt-6 font-sans text-sm">
          {operationError}
        </p>
      ) : null}
      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_22.5rem] lg:gap-16">
        <div>
          {cart.lines.map((line) => (
            <CartLine
              key={line.id}
              line={line}
              pending={pending}
              onQuantityChange={(quantity) =>
                quantity < 1
                  ? run(() => removeLine(line.id))
                  : run(() => updateLine(line.id, quantity))
              }
              onRemove={() => run(() => removeLine(line.id))}
            />
          ))}
        </div>
        <CartSummary
          cart={cart}
          checkoutEnabled={checkoutEnabled}
          checkoutAction={checkoutAction}
        />
      </div>
    </main>
  );
}
