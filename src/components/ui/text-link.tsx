import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textLinkVariants = cva(
  "rounded-sm font-sans font-medium underline decoration-1 underline-offset-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-focus motion-reduce:transition-none",
  {
    variants: {
      variant: {
        inline:
          "text-link-inline hover:text-link-hover active:text-link-active",
        standalone:
          "inline-flex min-h-11 items-center gap-2 text-link-standalone hover:text-link-hover active:text-link-active",
        inverse:
          "text-link-inverse decoration-link-inverse/70 hover:text-link-inverse-hover active:text-link-inverse-active",
      },
    },
    defaultVariants: { variant: "inline" },
  },
);

export interface TextLinkProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof textLinkVariants> {
  icon?: React.ReactNode;
}

function TextLink({
  className,
  variant,
  icon,
  children,
  ...props
}: TextLinkProps) {
  return (
    <a className={cn(textLinkVariants({ variant }), className)} {...props}>
      {children}
      {icon ? (
        <span aria-hidden="true" className="shrink-0">
          {icon}
        </span>
      ) : null}
    </a>
  );
}

export { TextLink, textLinkVariants };
