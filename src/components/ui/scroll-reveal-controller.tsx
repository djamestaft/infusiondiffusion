"use client";

import { useEffect } from "react";

export function ScrollRevealController() {
  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const observers = Array.from(
      document.querySelectorAll<HTMLElement>("[data-scroll-reveal]"),
    ).flatMap((element) => {
      const bounds = element.getBoundingClientRect();
      if (bounds.top < window.innerHeight && bounds.bottom > 0) return [];

      element.dataset.revealState = "waiting";
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting) return;

          element.dataset.revealState = "visible";
          observer.disconnect();
        },
        { threshold: 0 },
      );
      observer.observe(element);
      return observer;
    });

    return () => observers.forEach((observer) => observer.disconnect());
  }, []);

  return null;
}
