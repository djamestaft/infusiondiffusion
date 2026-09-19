"use client";

import { motionTokens } from "@/lib/motion/tokens";
import { useCallback, useRef, type ReactNode } from "react";
import { headerOffset, type MotionRuntime } from "@/lib/motion/runtime";
import { MotionControl, useMotionEffect } from "./motion-boundary";

export function StoryChapters({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const setup = useCallback(
    (
      { gsap }: MotionRuntime,
      element: HTMLElement,
      onCleanup: (cleanup: () => void) => void,
    ) => {
      const chapters = element.querySelectorAll<HTMLElement>(
        "[data-testid^='about-chapter-']",
      );
      onCleanup(() => {
        chapters.forEach((chapter) => delete chapter.dataset.motionChapter);
        element.style.removeProperty("--motion-chapter-top");
      });
      const top = headerOffset() + motionTokens.chapter.headerGap;
      element.style.setProperty("--motion-chapter-top", `${top}px`);
      chapters.forEach((chapter) => {
        const photograph = chapter.querySelector<HTMLElement>(
          "[data-motion-photograph]",
        );
        if (
          !photograph ||
          photograph.offsetHeight >
            window.innerHeight - top - motionTokens.chapter.bottomGap
        )
          return;
        chapter.dataset.motionChapter = "true";
        gsap.fromTo(
          photograph,
          { y: motionTokens.chapter.travel },
          {
            y: -motionTokens.chapter.travel,
            ease: "none",
            scrollTrigger: {
              trigger: chapter,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      return () => {
        chapters.forEach((chapter) => delete chapter.dataset.motionChapter);
        element.style.removeProperty("--motion-chapter-top");
      };
    },
    [],
  );
  useMotionEffect(ref, true, setup);
  return (
    <div ref={ref}>
      <div className="bg-content-surface flex justify-end px-5 sm:px-10 lg:px-16">
        <MotionControl />
      </div>
      {children}
    </div>
  );
}
