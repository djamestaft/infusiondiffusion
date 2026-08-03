import { cn } from "@/lib/utils";

export function LogoTextLockup({ className }: { className?: string }) {
  return (
    <span
      aria-label="Infusion Diffusion"
      className={cn(
        "text-navigation-accent font-display inline-flex flex-col items-center font-normal uppercase",
        className,
      )}
    >
      <span className="navigation-logo-primary">Infusion</span>
      <span className="navigation-logo-secondary flex w-full items-center gap-2">
        <span aria-hidden="true" className="h-px flex-1 bg-current" />
        Diffusion
        <span aria-hidden="true" className="h-px flex-1 bg-current" />
      </span>
    </span>
  );
}
