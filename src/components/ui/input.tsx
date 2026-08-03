import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type = "text",
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-field-border bg-field-surface text-field-text placeholder:text-field-placeholder hover:border-field-border-hover focus-visible:border-field-border-hover focus-visible:outline-field-focus disabled:border-field-disabled-surface disabled:bg-field-disabled-surface disabled:text-field-disabled-text read-only:bg-field-readonly-surface read-only:hover:border-field-border aria-invalid:border-field-error-border aria-invalid:hover:border-field-error-border min-h-11 w-full rounded-md border px-4 py-2 font-sans text-base leading-6 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-100 motion-reduce:transition-none",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
