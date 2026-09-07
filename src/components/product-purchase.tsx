"use client";

import { useState } from "react";

import { AddToCart } from "@/components/cart/add-to-cart";
import type { CartContract } from "@/lib/shopify/cart-contract";

export interface ProductPurchaseVariant {
  id: string;
  label: string;
  available: boolean;
}

export function ProductPurchase({
  variants,
  action,
}: {
  variants: ProductPurchaseVariant[];
  action: (merchandiseId: string) => Promise<CartContract>;
}) {
  const firstAvailable = variants.find((variant) => variant.available);
  const [selectedId, setSelectedId] = useState(firstAvailable?.id ?? "");
  const selected = variants.find((variant) => variant.id === selectedId);

  return (
    <div className="flex w-full max-w-[520px] flex-col items-center gap-3 sm:items-start">
      {variants.length > 1 ? (
        <label className="w-full text-center font-sans text-sm font-semibold sm:text-left">
          Choose an available Shopify variant
          <span className="relative mt-2.5 block w-full sm:w-[236px]">
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="bg-content-surface-elevated focus-visible:outline-action-focus h-11 w-full appearance-none px-3.5 pr-10 text-left font-sans text-xs font-normal focus-visible:outline-[3px] focus-visible:outline-offset-2"
            >
              {variants.map((variant) => (
                <option
                  key={variant.id}
                  value={variant.id}
                  disabled={!variant.available}
                >
                  {variant.label}
                  {!variant.available ? " — unavailable" : ""}
                </option>
              ))}
            </select>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2"
            >
              ⌄
            </span>
          </span>
        </label>
      ) : null}
      {selected ? (
        <AddToCart
          merchandiseId={selected.id}
          disabled={!selected.available}
          action={action}
        />
      ) : (
        <p className="text-content-secondary font-sans text-sm">
          This fragrance is currently unavailable.
        </p>
      )}
    </div>
  );
}
