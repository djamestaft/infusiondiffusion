"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { motionQuery, type MotionRuntime } from "@/lib/motion/runtime";
import {
  useMotionEffect,
  useMotionPreference,
} from "@/components/motion/motion-boundary";
import { HeroAtmosphere } from "@/components/motion/hero-atmosphere";
import { EditorialImage } from "@/components/ui/editorial-image";
import type { EditorialImageSource } from "@/lib/editorial-image";
import { guideStages } from "./fragrance-guide-questions";

export const defaultGuideImage: EditorialImageSource = {
  src: "/images/homepage-bespoke-diffuser-blurb.png",
  alt: "Reed diffuser in a softly lit room",
};

/** React owns the step. Only non-interactive copy moves; controls never wait. */
export function GuideTransition({
  children,
  direction = 1,
  result = false,
}: {
  children: ReactNode;
  direction?: number;
  result?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { paused } = useMotionPreference();
  const [lightMotion, setLightMotion] = useState(false);
  useLayoutEffect(() => {
    const preference = window.matchMedia(
      "(prefers-reduced-motion: no-preference)",
    );
    const desktop = window.matchMedia(motionQuery);
    const update = () =>
      setLightMotion(
        preference.matches &&
          !desktop.matches &&
          !(navigator as Navigator & { connection?: { saveData?: boolean } })
            .connection?.saveData,
      );
    update();
    preference.addEventListener("change", update);
    desktop.addEventListener("change", update);
    return () => {
      preference.removeEventListener("change", update);
      desktop.removeEventListener("change", update);
    };
  }, []);
  const setup = useCallback(
    ({ gsap }: MotionRuntime, element: HTMLElement) => {
      const targets = element.querySelectorAll("[data-guide-reveal]");
      if (!targets.length) return;
      gsap.fromTo(
        targets,
        result ? { y: 20, opacity: 0.85 } : { x: direction * 32, opacity: 0.8 },
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
          clearProps: "transform,opacity",
        },
      );
      const answers = element.querySelectorAll("[data-guide-answer-text]");
      if (answers.length)
        gsap.fromTo(
          answers,
          { y: 10, opacity: 0.8 },
          {
            y: 0,
            opacity: 1,
            duration: 0.42,
            stagger: 0.035,
            ease: "power2.out",
            clearProps: "transform,opacity",
          },
        );
    },
    [direction, result],
  );
  useMotionEffect(ref, true, setup);
  return (
    <div
      ref={ref}
      data-guide-transition={result ? "result" : "step"}
      data-guide-light-motion={(lightMotion && !paused) || undefined}
      style={{ "--guide-enter-x": `${direction * 32}px` } as CSSProperties}
    >
      {children}
    </div>
  );
}

export function GuideAtmosphere({
  active,
  image,
  direction,
  focusScope,
}: {
  active: number;
  image: EditorialImageSource;
  direction: number;
  focusScope: RefObject<HTMLElement | null>;
}) {
  return (
    <aside
      aria-hidden="true"
      className="dark bg-content-surface text-content-primary hidden lg:block"
    >
      <HeroAtmosphere
        pointerX={8}
        pointerY={4}
        animateEntrance={false}
        focusScope={focusScope}
      >
        <div className="guide-atmosphere flex flex-col gap-8 px-10 py-12 xl:pl-16">
          <p className="font-display text-[clamp(2.5rem,4vw,3.5rem)] leading-[1.14]">
            Find your
            <br />
            fragrance.
          </p>
          <div className="relative aspect-2/1 w-full">
            <EditorialImage
              image={image}
              decorative
              sizes="(min-width: 1024px) 35vw, 1px"
              className="object-contain"
            />
          </div>
          <div className="relative py-2">
            <div data-motion-backdrop className="origin-left">
              <GuideTransition key={active} direction={direction}>
                <p
                  data-guide-reveal
                  className="font-display text-content-secondary text-[clamp(3rem,6.5vw,6rem)] leading-[1.16]"
                >
                  {guideStages[active]}
                </p>
              </GuideTransition>
            </div>
          </div>
          <p className="text-content-secondary text-xs leading-5">
            Room / Feeling / Notes / Presence / Time
          </p>
        </div>
      </HeroAtmosphere>
    </aside>
  );
}
