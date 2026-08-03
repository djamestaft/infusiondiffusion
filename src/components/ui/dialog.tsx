"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Dialog as DialogPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogClose = DialogPrimitive.Close;

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "bg-overlay-scrim fixed inset-0 z-50 data-[state=closed]:animate-none data-[state=open]:animate-none",
        className,
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showClose = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showClose?: boolean;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={cn(
          "bg-overlay-surface text-overlay-text focus-visible:outline-overlay-focus fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2.5rem)] w-[calc(100%-2.5rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-lg p-8 shadow-[0_1rem_2.5rem_rgb(0_0_0/0.24)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className="bg-overlay-accent mb-4 h-0.5 w-16 shrink-0"
        />
        {children}
        {showClose ? (
          <DialogPrimitive.Close
            aria-label="Close dialog"
            className="border-overlay-muted text-overlay-text hover:bg-action-quiet-hover focus-visible:outline-overlay-focus absolute top-5 right-4 inline-flex size-11 items-center justify-center rounded-md border focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none sm:right-5"
          >
            <X aria-hidden="true" className="size-5 stroke-[1.5]" />
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-3 pr-12", className)} {...props} />;
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn(
        "font-display text-[1.75rem] leading-9 font-normal",
        className,
      )}
      {...props}
    />
  );
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-overlay-muted text-base leading-6", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
