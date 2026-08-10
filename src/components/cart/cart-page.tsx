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
  if (!cart.lines.length)
    return (
      <main className="mx-auto min-h-[70dvh] w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-20 lg:py-28">
        <p className="text-content-accent font-sans text-xs font-semibold uppercase">
          Your selection
        </p>
        <h1 className="font-display mt-5 max-w-3xl text-[clamp(3.5rem,8vw,6rem)] leading-[0.98]">
          Your bag is empty
        </h1>
        <p className="text-content-secondary mt-4 font-sans">
          Explore the collection and choose a fragrance for your space.
        </p>
        <Button asChild className="mt-8">
          <a href="/shop">Shop the collection</a>
        </Button>
      </main>
    );
  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 lg:px-20 lg:py-20">
      <header className="border-navigation-divider border-b pb-10 lg:pb-14">
        <p className="text-content-accent font-sans text-xs font-semibold uppercase">
          Your selection
        </p>
        <h1 className="font-display mt-5 text-[40px] leading-[1.1] lg:text-[56px]">
          Your bag
        </h1>
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
      <div className="mt-12 grid gap-14 lg:grid-cols-[856px_360px] lg:gap-16">
        <div>
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
