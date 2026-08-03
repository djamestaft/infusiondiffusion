"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Dialog as DrawerPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const Drawer = DrawerPrimitive.Root;
const DrawerTrigger = DrawerPrimitive.Trigger;
const DrawerClose = DrawerPrimitive.Close;

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Overlay className="bg-overlay-scrim fixed inset-0 z-50" />
      <DrawerPrimitive.Content
        className={cn(
          "bg-overlay-surface text-overlay-text focus-visible:outline-overlay-focus fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col overflow-y-auto p-8 shadow-[-1rem_0_2.5rem_rgb(0_0_0/0.24)] outline-none focus-visible:outline-2 focus-visible:outline-offset-[-2px] motion-reduce:transition-none sm:w-[min(31.25rem,calc(100%-2.5rem))]",
          className,
        )}
        {...props}
      >
        <span
          aria-hidden="true"
          className="bg-overlay-accent mb-4 h-0.5 w-16 shrink-0"
        />
        {children}
        <DrawerPrimitive.Close
          aria-label="Close drawer"
          className="border-overlay-muted text-overlay-text hover:bg-action-quiet-hover focus-visible:outline-overlay-focus absolute top-5 right-4 inline-flex size-11 items-center justify-center rounded-md border focus-visible:outline-2 focus-visible:outline-offset-2 motion-reduce:transition-none sm:right-5"
        >
          <X aria-hidden="true" className="size-5 stroke-[1.5]" />
        </DrawerPrimitive.Close>
      </DrawerPrimitive.Content>
    </DrawerPrimitive.Portal>
  );
}

const DrawerHeader = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div className={cn("space-y-3 pr-12", className)} {...props} />
);
const DrawerTitle = ({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) => (
  <DrawerPrimitive.Title
    className={cn(
      "font-display text-[1.75rem] leading-9 font-normal",
      className,
    )}
    {...props}
  />
);
const DrawerDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) => (
  <DrawerPrimitive.Description
    className={cn("text-overlay-muted text-base leading-6", className)}
    {...props}
  />
);
const DrawerFooter = ({ className, ...props }: React.ComponentProps<"div">) => (
  <div
    className={cn("mt-auto flex flex-col gap-3 pt-8", className)}
    {...props}
  />
);

export {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
};
