"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { CartContract } from "@/lib/shopify/cart-contract";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { Button } from "@/components/ui/button";

export function AddToCart({
  merchandiseId,
  disabled,
  action,
}: {
  merchandiseId: string;
  disabled?: boolean;
  action: (merchandiseId: string) => Promise<CartContract>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [cart, setCart] = useState<CartContract>();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();
  const opener = useRef<HTMLDivElement>(null);
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen)
      requestAnimationFrame(() =>
        opener.current?.querySelector("button")?.focus(),
      );
  };
  return (
    <>
      <div ref={opener}>
        <Button
          size="large"
          className="w-full sm:w-[236px]"
          disabled={disabled || pending}
          loading={pending}
          onClick={() =>
            startTransition(async () => {
              try {
                setError(undefined);
                const next = await action(merchandiseId);
                setCart(next);
                setOpen(true);
                router.refresh();
              } catch {
                setError("We could not add that fragrance. Please try again.");
              }
            })
          }
        >
          {pending ? "Adding" : disabled ? "Sold out" : "Add to bag"}
        </Button>
        {error ? (
          <p
            role="alert"
            className="text-feedback-error mt-3 font-sans text-sm"
          >
            {error}
          </p>
        ) : null}
        <span className="sr-only" aria-live="polite">
          {cart ? `${cart.totalQuantity} items in your bag` : ""}
        </span>
      </div>
      {cart ? (
        <CartDrawer
          open={open}
          onOpenChange={handleOpenChange}
          cart={cart}
          merchandiseId={merchandiseId}
        />
      ) : null}
    </>
  );
}
