import { cn } from "@/lib/utils";

export function LogoTextLockup({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      data-logo-asset="/infusion-diffusion-logo.svg"
      className={cn(
        "bg-navigation-accent block aspect-[220/64] [mask-image:url('/infusion-diffusion-logo.svg')] [mask-size:contain] [mask-position:center] [mask-repeat:no-repeat]",
        className,
      )}
    />
  );
}
