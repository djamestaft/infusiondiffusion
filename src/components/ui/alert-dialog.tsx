"use client";

import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogCancel = AlertDialogPrimitive.Cancel;
const AlertDialogAction = AlertDialogPrimitive.Action;

function AlertDialogContent({
  className,
  children,
  onOpenAutoFocus,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content>) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="bg-overlay-scrim fixed inset-0 z-50" />
      <AlertDialogPrimitive.Content
        className={cn(
          "bg-overlay-surface text-overlay-text focus-visible:outline-overlay-focus fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2.5rem)] w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-lg p-8 shadow-[0_1rem_2.5rem_rgb(0_0_0/0.24)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2",
          className,
        )}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          const cancel = document.querySelector<HTMLElement>(
            "[data-alert-cancel]",
          );
          cancel?.focus();
          onOpenAutoFocus?.(event);
        }}
        {...props}
      >
        {children}
      </AlertDialogPrimitive.Content>
    </AlertDialogPrimitive.Portal>
  );
}

const AlertDialogHeader = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div className={cn("space-y-4", className)} {...props} />
);
const AlertDialogTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) => (
  <AlertDialogPrimitive.Title
    className={cn(
      "font-display text-[1.75rem] leading-9 font-normal",
      className,
    )}
    {...props}
  />
);
const AlertDialogDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) => (
  <AlertDialogPrimitive.Description
    className={cn("text-overlay-muted text-base leading-6", className)}
    {...props}
  />
);
const AlertDialogFooter = ({
  className,
  ...props
}: React.ComponentProps<"div">) => (
  <div
    className={cn(
      "mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
      className,
    )}
    {...props}
  />
);

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
};
