"use client";

import { useEffect, useLayoutEffect, useState, type RefObject } from "react";
import { motionQuery } from "@/lib/motion/runtime";
import { createCarouselTransition } from "@/lib/motion/carousel-transition";

async function loadCarouselMotion() {
  const [{ gsap }, { SplitText }] = await Promise.all([
    import("gsap"),
    import("gsap/SplitText"),
  ]);
  gsap.registerPlugin(SplitText);
  return { gsap, SplitText };
}
type Runtime = Awaited<ReturnType<typeof loadCarouselMotion>>;

/** Prepare only on eligible desktops; the original carousel remains the failure fallback. */
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
    const query = window.matchMedia(motionQuery);
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
        createCarouselTransition(
          runtime.gsap,
          incoming,
          outgoing,
          split?.chars ?? [],
          outgoingSplit?.chars ?? [],
        ).eventCallback("onComplete", onComplete);
      });
    } catch {
      context.revert();
      split?.revert();
      outgoingSplit?.revert();
      onComplete();
      return;
    }
    // Finish on layout changes instead of leaving split words stranded across new line breaks.
    window.addEventListener("resize", onComplete);
    return () => {
      window.removeEventListener("resize", onComplete);
      context.revert();
      split?.revert();
      outgoingSplit?.revert();
    };
  }, [active, available, choreographed, onComplete, previous, ref, runtime]);
  return available;
}
