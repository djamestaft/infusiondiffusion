"use client";

import { useEffect, useRef, useState, useTransition } from "react";
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
  const restoreFocus = useRef(false);
  useEffect(() => {
    // A router refresh can keep the opener disabled after the drawer closes.
    if (!pending && !open && restoreFocus.current) {
      const container = opener.current;
      const button = container?.querySelector("button");
      if (document.activeElement === container && button && !button.disabled) {
        button.focus();
      }
      restoreFocus.current = false;
    }
  }, [pending, open]);
  return (
    <>
      <div
        ref={opener}
        role="group"
        aria-label="Add fragrance to bag"
        tabIndex={-1}
        className="focus-visible:outline-action-focus w-full rounded-full focus-visible:outline-[3px] focus-visible:outline-offset-2"
      >
        <Button
          size="large"
          className="w-full text-[13px] leading-[18px]"
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
          {pending ? "Adding" : disabled ? "Sold out" : "Add to cart"}
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
          onOpenChange={setOpen}
          onCloseAutoFocus={(event) => {
            // Restore through the drawer lifecycle, not an animation-frame race
            // against its default focus restoration and the pending refresh.
            event.preventDefault();
            restoreFocus.current = true;
            const button = opener.current?.querySelector("button");
            if (button && !button.disabled) {
              button.focus();
              restoreFocus.current = false;
            } else {
              opener.current?.focus();
            }
          }}
          cart={cart}
          merchandiseId={merchandiseId}
        />
      ) : null}
    </>
  );
}
