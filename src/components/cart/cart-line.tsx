"use client";

import { Minus, Plus } from "lucide-react";

import { StorefrontMedia } from "@/components/storefront-media";
import { getApprovedProductMediaForTitle } from "@/content/storefront-media";
import type { CartLineContract } from "@/lib/shopify/cart-contract";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/ui/price-display";
import { cn } from "@/lib/utils";

export function CartLine({
  line,
  pending = false,
  onQuantityChange,
  onRemove,
  compact = false,
}: {
  line: CartLineContract;
  pending?: boolean;
  compact?: boolean;
  onQuantityChange?: (quantity: number) => void;
  onRemove?: () => void;
}) {
  const localMedia = getApprovedProductMediaForTitle(line.title);
  const image = line.image
    ? {
        ...line.image,
        fallbackSrc: localMedia?.src,
        fallbackAlt: localMedia?.alt,
      }
    : localMedia
      ? { src: localMedia.src, alt: localMedia.alt }
      : undefined;
  return (
    <article
      className={cn(
        "border-navigation-border flex gap-4 border-b py-6 sm:gap-8",
      )}
      aria-busy={pending || undefined}
    >
      {image ? (
        <div
          className={cn(
            "bg-product-card-media-fallback relative shrink-0 overflow-hidden rounded-md",
            compact ? "h-28 w-21" : "h-32 w-24 sm:h-40 sm:w-30",
          )}
        >
          <StorefrontMedia image={image} sizes="120px" />
        </div>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="text-content-accent font-sans text-xs font-semibold tracking-[0.08em] uppercase">
          {line.format || "Home fragrance"}
        </p>
        <h2 className="font-display mt-2 text-2xl leading-8">{line.title}</h2>
        {line.variantTitle ? (
          <p className="text-content-secondary mt-1 font-sans text-sm">
            {line.variantTitle}
          </p>
        ) : null}
        <PriceDisplay price={line.total} className="mt-3 sm:hidden" />
        {!line.available ? (
          <p className="text-commerce-status-sold-out mt-2 font-sans text-sm font-semibold">
            Currently unavailable. Remove this item to continue.
          </p>
        ) : null}
        {!compact ? (
          <div className="mt-4 grid w-fit grid-cols-[2.75rem_2.75rem_2.75rem] items-center gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="disabled:border-action-secondary-border disabled:text-action-secondary-foreground disabled:bg-transparent"
              aria-label={`Decrease ${line.title} quantity`}
              disabled={pending}
              onClick={() => onQuantityChange?.(line.quantity - 1)}
            >
              <Minus aria-hidden="true" className="size-4" />
            </Button>
            <span
              className="inline-flex size-11 items-center justify-center font-sans text-sm font-semibold"
              aria-label={`Quantity ${line.quantity}`}
            >
              {line.quantity}
            </span>
            <Button
              size="icon"
              variant="secondary"
              className="disabled:border-action-secondary-border disabled:text-action-secondary-foreground disabled:bg-transparent"
              aria-label={`Increase ${line.title} quantity`}
              disabled={pending || !line.available}
              onClick={() => onQuantityChange?.(line.quantity + 1)}
            >
              <Plus aria-hidden="true" className="size-4" />
            </Button>
            <Button
              variant="quiet"
              className="disabled:text-action-quiet-foreground col-span-3 w-fit px-0 underline disabled:bg-transparent"
              disabled={pending}
              onClick={onRemove}
            >
              Remove
            </Button>
          </div>
        ) : null}
      </div>
      <PriceDisplay
        price={line.total}
        className="hidden shrink-0 sm:inline-flex"
      />
    </article>
  );
}
