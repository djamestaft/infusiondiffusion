import Image from "next/image";

import { cn } from "@/lib/utils";

export function LogoTextLockup({ className }: { className?: string }) {
  return (
    <Image
      src="/infusion-diffusion-logo.svg"
      alt=""
      aria-hidden="true"
      width="220"
      height="64"
      priority
      className={cn("block aspect-[220/64] h-auto", className)}
    />
  );
}
