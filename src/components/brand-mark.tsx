import { Leaf } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-2", className)}
      aria-label="Infusion Diffusion"
    >
      <Leaf aria-hidden="true" className="size-5 stroke-[1.5]" />
      <span className="font-display text-xl font-semibold tracking-[0.035em]">
        Infusion Diffusion
      </span>
    </span>
  );
}
