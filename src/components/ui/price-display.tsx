import * as React from "react";

import { cn } from "@/lib/utils";

export interface CommerceMoney {
  amount: string;
  currencyCode: string;
}

export type PriceDisplayType = "regular" | "sale" | "from";

export interface PriceDisplayProps extends Omit<
  React.ComponentProps<"span">,
  "children"
> {
  price: CommerceMoney;
  compareAtPrice?: CommerceMoney;
  type?: PriceDisplayType;
  size?: "compact" | "standard";
}

export function formatCommerceMoney({
  amount,
  currencyCode,
}: CommerceMoney): string {
  const value = Number(amount);

  if (!Number.isFinite(value)) return amount;

  try {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
      .format(value)
      .replace(/\u00a0/g, " ");
  } catch {
    return amount;
  }
}

export function PriceDisplay({
  price,
  compareAtPrice,
  type = "regular",
  size = "compact",
  className,
  ...props
}: PriceDisplayProps) {
  const currentPrice = formatCommerceMoney(price);
  const comparePrice = compareAtPrice
    ? formatCommerceMoney(compareAtPrice)
    : undefined;
  const sale = type === "sale" && comparePrice;
  const effectiveType = type === "sale" && !sale ? "regular" : type;

  return (
    <span
      data-slot="price-display"
      data-size={size}
      data-type={effectiveType}
      className={cn(
        "inline-flex flex-wrap items-baseline font-sans",
        size === "compact" ? "gap-x-2 gap-y-1" : "gap-x-3 gap-y-1",
        className,
      )}
      {...props}
    >
      {type === "from" ? (
        <span className="text-price-display-compare text-xs leading-4 font-semibold tracking-[0.08em] uppercase">
          From
        </span>
      ) : null}
      <span
        className={cn(
          size === "compact"
            ? "text-sm leading-5 font-semibold"
            : "text-2xl leading-8 font-semibold",
          sale && size === "standard"
            ? "text-price-display-accent"
            : "text-price-display-current",
        )}
      >
        {sale ? <span className="sr-only">Sale price: </span> : null}
        {currentPrice}
      </span>
      {sale ? (
        <s
          className={cn(
            "text-price-display-compare font-normal",
            size === "compact" ? "text-xs leading-4" : "text-base leading-6",
          )}
        >
          <span className="sr-only">Original price: </span>
          {comparePrice}
        </s>
      ) : null}
    </span>
  );
}
