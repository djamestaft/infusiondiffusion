"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { createCarouselTransition } from "@/lib/motion/carousel-transition";

// Carousel text is approved on touch/mobile too; scroll and pointer scenes
// retain their independent desktop-only eligibility in motion/runtime.
const carouselMotionQuery = "(prefers-reduced-motion: no-preference)";

async function loadCarouselMotion() {
  const [{ gsap }, { SplitText }] = await Promise.all([
    import("gsap"),
    import("gsap/SplitText"),
  ]);
  gsap.registerPlugin(SplitText);
  return { gsap, SplitText };
}
type Runtime = Awaited<ReturnType<typeof loadCarouselMotion>>;

/** Prepare after preferences on every screen; the original carousel remains the failure fallback. */
export function useCarouselChoreography(
  ref: RefObject<HTMLElement | null>,
  {
    enabled,
    suppressed,
    active,
    previous,
    choreographed,
    onComplete,
  }: {
    enabled: boolean;
    suppressed: boolean;
    active: number;
    previous: number | null;
    choreographed: boolean;
    onComplete: () => void;
  },
) {
  const [runtime, setRuntime] = useState<Runtime | null>(null);
  useEffect(() => {
    if (!enabled || suppressed || !window.matchMedia) return;
    const query = window.matchMedia(carouselMotionQuery);
    let generation = 0;
    const update = () => {
      const current = ++generation;
      setRuntime(null);
      if (!query.matches) return;
      // Await fonts before temporarily splitting, so the normal line breaks stay stable.
      Promise.all([loadCarouselMotion(), document.fonts?.ready])
        .then(([loaded]) => {
          if (generation === current) setRuntime(loaded);
        })
        .catch(() => {
          // The server-rendered content and original CSS carousel stay usable.
        });
    };
    update();
    query.addEventListener("change", update);
    return () => {
      generation++;
      query.removeEventListener("change", update);
    };
  }, [enabled, suppressed]);

  const available = enabled && !suppressed && runtime !== null;
  useLayoutEffect(() => {
    if (!choreographed || previous === null) return;
    const root = ref.current;
    const incoming = root?.querySelector<HTMLElement>('[data-phase="enter"]');
    if (!available || !runtime || !incoming) {
      onComplete();
      return;
    }
    const outgoing =
      root?.querySelector<HTMLElement>('[data-phase="exit"]') ?? null;
    let split: InstanceType<Runtime["SplitText"]> | undefined;
    let descriptionSplit: InstanceType<Runtime["SplitText"]> | undefined;
    let outgoingSplit: InstanceType<Runtime["SplitText"]> | undefined;
    const context = runtime.gsap.context(() => {}, root!);
    try {
      context.add(() => {
        const heading = incoming.querySelector("h1");
        if (heading) {
          split = runtime.SplitText.create(heading, {
            type: "words,chars",
            aria: "auto",
            charsClass: "hero-carousel-letter",
            reduceWhiteSpace: false,
          });
        }
        const outgoingHeading = outgoing?.querySelector("h1");
        if (outgoingHeading) {
          outgoingSplit = runtime.SplitText.create(outgoingHeading, {
            type: "words,chars",
            aria: "auto",
            charsClass: "hero-carousel-letter",
            reduceWhiteSpace: false,
          });
        }
        const description = incoming.querySelector(
          "[data-carousel-description]",
        );
        if (description) {
          descriptionSplit = runtime.SplitText.create(description, {
            type: "words,chars",
            aria: "none",
            charsClass: "hero-carousel-description-letter",
            reduceWhiteSpace: false,
          });
        }
        createCarouselTransition(
          runtime.gsap,
          incoming,
          outgoing,
          split?.chars ?? [],
          outgoingSplit?.chars ?? [],
          descriptionSplit?.chars ?? [],
        ).eventCallback("onComplete", onComplete);
      });
    } catch {
      context.revert();
      split?.revert();
      outgoingSplit?.revert();
      descriptionSplit?.revert();
      onComplete();
      return;
    }
    // Finish on layout changes instead of leaving split words stranded across new line breaks.
    window.addEventListener("resize", onComplete);
    // A keyboard user must never wait for an invisible CTA's fade to see focus.
    incoming.addEventListener("focusin", onComplete);
    return () => {
      window.removeEventListener("resize", onComplete);
      incoming.removeEventListener("focusin", onComplete);
      context.revert();
      split?.revert();
      outgoingSplit?.revert();
      descriptionSplit?.revert();
    };
  }, [active, available, choreographed, onComplete, previous, ref, runtime]);
  return available;
}
