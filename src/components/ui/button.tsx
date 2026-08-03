"use client";

import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md px-5 font-sans text-sm leading-5 font-semibold tracking-[0.04em] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action-focus disabled:pointer-events-none disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed motion-reduce:transition-none",
  {
    variants: {
      variant: {
        primary:
          "bg-action-primary text-action-primary-foreground hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-disabled disabled:text-action-disabled-foreground aria-disabled:bg-action-disabled aria-disabled:text-action-disabled-foreground",
        secondary:
          "border border-action-secondary-border bg-transparent text-action-secondary-foreground hover:bg-action-secondary-hover active:bg-action-secondary-active disabled:border-action-disabled-border disabled:bg-action-disabled disabled:text-action-disabled-foreground aria-disabled:border-action-disabled-border aria-disabled:bg-action-disabled aria-disabled:text-action-disabled-foreground",
        quiet:
          "bg-transparent text-action-quiet-foreground hover:bg-action-quiet-hover active:bg-action-quiet-active disabled:bg-action-disabled disabled:text-action-disabled-foreground aria-disabled:bg-action-disabled aria-disabled:text-action-disabled-foreground",
        destructive:
          "bg-action-destructive text-action-destructive-foreground hover:bg-action-destructive-hover active:bg-action-destructive-active disabled:bg-action-disabled disabled:text-action-disabled-foreground aria-disabled:bg-action-disabled aria-disabled:text-action-disabled-foreground",
        // Temporary compatibility aliases; remove after downstream consumers migrate.
        default:
          "bg-action-primary text-action-primary-foreground hover:bg-action-primary-hover active:bg-action-primary-active disabled:bg-action-disabled disabled:text-action-disabled-foreground aria-disabled:bg-action-disabled aria-disabled:text-action-disabled-foreground",
        outline:
          "border border-action-secondary-border bg-transparent text-action-secondary-foreground hover:bg-action-secondary-hover active:bg-action-secondary-active disabled:border-action-disabled-border disabled:bg-action-disabled disabled:text-action-disabled-foreground aria-disabled:border-action-disabled-border aria-disabled:bg-action-disabled aria-disabled:text-action-disabled-foreground",
        ghost:
          "bg-transparent text-action-quiet-foreground hover:bg-action-quiet-hover active:bg-action-quiet-active disabled:bg-action-disabled disabled:text-action-disabled-foreground aria-disabled:bg-action-disabled aria-disabled:text-action-disabled-foreground",
      },
      size: {
        default: "py-3",
        large: "min-h-12 px-7 text-base leading-5",
        icon: "size-11 px-0",
        // Temporary compatibility alias.
        lg: "min-h-12 px-7 text-base leading-5",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 animate-spin motion-reduce:animate-none"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="2"
      />
      <path
        d="M12 3a9 9 0 0 1 9 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  disabled = false,
  children,
  onClick,
  tabIndex,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";
  const unavailable = disabled || loading;

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    if (unavailable) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };

  const childElement = React.isValidElement<{
    children?: React.ReactNode;
    tabIndex?: number;
  }>(children)
    ? children
    : null;
  const contentChildren =
    asChild && childElement ? childElement.props.children : children;
  const content = (
    <>
      <span
        className={cn(
          "inline-flex items-center justify-center gap-2",
          loading && "opacity-0",
        )}
      >
        {contentChildren}
      </span>
      {loading ? (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      ) : null}
    </>
  );

  const slottedChild =
    asChild && childElement
      ? React.cloneElement(
          childElement,
          unavailable ? { tabIndex: -1 } : undefined,
          content,
        )
      : children;

  return (
    <Comp
      {...props}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      aria-busy={loading || undefined}
      aria-disabled={asChild && unavailable ? true : undefined}
      disabled={asChild ? undefined : unavailable}
      tabIndex={asChild && unavailable ? -1 : tabIndex}
      type={asChild ? undefined : (type ?? "button")}
      onClick={handleClick}
    >
      {asChild ? slottedChild : content}
    </Comp>
  );
}

export { Button, buttonVariants };
