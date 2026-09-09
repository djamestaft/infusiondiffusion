"use client";

import { useState, useTransition } from "react";
import type { CartContract } from "@/lib/shopify/cart-contract";
import { CartLine } from "@/components/cart/cart-line";
import { CartSummary } from "@/components/cart/cart-summary";
import { withOptimisticQuantity } from "@/components/cart/optimistic-cart";
import { Button } from "@/components/ui/button";

export function CartPage({
  initialCart,
  checkoutEnabled,
  updateLine,
  removeLine,
  checkoutAction,
  onCartChange,
}: {
  initialCart: CartContract;
  checkoutEnabled: boolean;
  updateLine: (lineId: string, quantity: number) => Promise<CartContract>;
  removeLine: (lineId: string) => Promise<CartContract>;
  checkoutAction: () => Promise<void>;
  onCartChange?: (cart: CartContract) => void;
}) {
  const [cart, setCart] = useState(initialCart);
  const [operationError, setOperationError] = useState<string>();
  const [pending, startTransition] = useTransition();
  const run = (
    lineId: string,
    quantity: number,
    work: () => Promise<CartContract>,
  ) => {
    const confirmedCart = cart;
    const optimisticCart = withOptimisticQuantity(cart, lineId, quantity);
    setOperationError(undefined);
    setCart(optimisticCart);
    onCartChange?.(optimisticCart);

    startTransition(async () => {
      try {
        const nextCart = await work();
        setCart(nextCart);
        onCartChange?.(nextCart);
      } catch {
        setCart(confirmedCart);
        onCartChange?.(confirmedCart);
        setOperationError(
          "We could not update your bag. Your last confirmed selection is still here.",
        );
      }
    });
  };
  if (cart.unavailable || !cart.lines.length)
    return (
      <main className="mx-auto min-h-[70dvh] w-full max-w-7xl px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <p className="text-content-accent font-sans text-xs font-semibold uppercase">
          Your selection
        </p>
        <h1 className="font-display mt-3 text-5xl">
          {cart.unavailable
            ? "Your bag is temporarily unavailable"
            : "Your bag is empty"}
        </h1>
        <p
          role={cart.unavailable ? "alert" : undefined}
          className="text-content-secondary mt-4 font-sans"
        >
          {cart.unavailable
            ? "We could not refresh your bag. Please try again."
            : "Explore the collection and choose a fragrance for your space."}
        </p>
        <Button asChild className="mt-8">
          <a href={cart.unavailable ? "/cart" : "/shop"}>
            {cart.unavailable ? "Try again" : "Shop the collection"}
          </a>
        </Button>
      </main>
    );
  return (
    <main className="mx-auto w-full max-w-[1440px] px-6 pt-8 pb-16 sm:px-8 lg:px-16 lg:pt-16">
      <header>
        <h1 className="font-display text-[40px] leading-[1.15] lg:text-[56px]">
          Your cart
        </h1>
        <p
          className="text-content-secondary mt-8 font-sans text-base leading-[1.45]"
          aria-live="polite"
        >
          {cart.totalQuantity} {cart.totalQuantity === 1 ? "item" : "items"} in
          your cart
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
      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:gap-16">
        <div className="flex min-w-0 flex-col gap-6">
          {cart.lines.map((line) => (
            <CartLine
              key={line.id}
              line={line}
              pending={pending}
              onQuantityChange={(quantity) =>
                quantity < 1
                  ? run(line.id, 0, () => removeLine(line.id))
                  : run(line.id, quantity, () => updateLine(line.id, quantity))
              }
              onRemove={() => run(line.id, 0, () => removeLine(line.id))}
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
