import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit max-w-full items-center rounded-sm px-3 py-1.5 font-sans text-xs leading-4 font-semibold tracking-[0.08em] uppercase",
  {
    variants: {
      variant: {
        neutral:
          "border border-badge-neutral-border bg-badge-neutral-surface text-badge-neutral-foreground",
        accent: "bg-badge-accent-surface text-badge-accent-foreground",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: string | number;
  className?: string;
  id?: string;
  ref?: React.Ref<HTMLSpanElement>;
  "aria-label"?: string;
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant ?? "neutral"}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
