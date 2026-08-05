"use client";

import { useLayoutEffect, useRef, useState } from "react";

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
  const revealRef = useRef<HTMLDivElement>(null);
  const [revealState, setRevealState] = useState<"visible" | "waiting">(
    "visible",
  );

  useLayoutEffect(() => {
    const element = revealRef.current;
    if (
      !element ||
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) return;

    setRevealState("waiting");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;

        setRevealState("visible");
        observer.disconnect();
      },
      { threshold: 0 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={revealRef}
      className={cn("scroll-reveal", className)}
      data-reveal-direction={direction}
      data-reveal-state={revealState}
      data-reveal-variant={variant}
    >
      {children}
    </div>
  );
}
