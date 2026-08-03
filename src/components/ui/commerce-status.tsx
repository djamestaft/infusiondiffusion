import * as React from "react";

import { cn } from "@/lib/utils";

export type CommerceStatusValue =
  "in-stock" | "low-stock" | "sold-out" | "pre-order";

export interface CommerceStatusProps extends Omit<
  React.ComponentProps<"span">,
  "children"
> {
  status: CommerceStatusValue;
  treatment?: "inline" | "overlay";
  lowStockCount?: number;
}

function statusLabel(status: CommerceStatusValue, lowStockCount?: number) {
  if (status === "in-stock") return "In stock";
  if (status === "sold-out") return "Sold out";
  if (status === "pre-order") return "Pre-order";
  return typeof lowStockCount === "number" &&
    Number.isInteger(lowStockCount) &&
    lowStockCount > 0
    ? `Only ${lowStockCount} left`
    : "Low stock";
}

const inlineText = {
  "in-stock": "text-commerce-status-inline",
  "low-stock": "text-commerce-status-inline",
  "sold-out": "text-commerce-status-sold-out",
  "pre-order": "text-commerce-status-inline",
} satisfies Record<CommerceStatusValue, string>;

const marker = {
  "in-stock": "bg-commerce-status-available-surface",
  "low-stock": "bg-commerce-status-low-stock-surface",
  "sold-out": "bg-commerce-status-sold-out-surface",
  "pre-order": "bg-commerce-status-pre-order-surface",
} satisfies Record<CommerceStatusValue, string>;

const overlay = {
  "in-stock":
    "bg-commerce-status-available-surface text-commerce-status-available-text",
  "low-stock":
    "bg-commerce-status-low-stock-surface text-commerce-status-low-stock-text",
  "sold-out":
    "bg-commerce-status-sold-out-surface text-commerce-status-sold-out-text",
  "pre-order":
    "bg-commerce-status-pre-order-surface text-commerce-status-pre-order-text",
} satisfies Record<CommerceStatusValue, string>;

export function CommerceStatus({
  status,
  treatment = "inline",
  lowStockCount,
  className,
  ...props
}: CommerceStatusProps) {
  const label = statusLabel(status, lowStockCount);

  return (
    <span
      data-slot="commerce-status"
      data-status={status}
      data-treatment={treatment}
      className={cn(
        "inline-flex w-fit items-center font-sans font-semibold",
        treatment === "inline"
          ? ["gap-2 py-1 text-sm leading-5", inlineText[status]]
          : [
              "rounded-sm px-2 py-1 text-xs leading-4 tracking-[0.08em] uppercase",
              overlay[status],
            ],
        className,
      )}
      {...props}
    >
      {treatment === "inline" ? (
        <span
          aria-hidden="true"
          className={cn("size-1.5 shrink-0 rounded-full", marker[status])}
        />
      ) : null}
      {label}
    </span>
  );
}
