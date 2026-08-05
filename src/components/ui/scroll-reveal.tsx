import { cn } from "@/lib/utils";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  direction?: "left" | "right";
  variant?: "rise" | "unveil";
};

export function ScrollReveal({
  children,
  className,
  direction = "left",
  variant = "rise",
}: ScrollRevealProps) {
  return (
    <div
      className={cn("scroll-reveal", className)}
      data-scroll-reveal=""
      data-reveal-direction={direction}
      data-reveal-variant={variant}
    >
      {children}
    </div>
  );
}
