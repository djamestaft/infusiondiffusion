"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { Button } from "@/components/ui/button";
import {
  loadMotion,
  motionQuery,
  mountDeferredMotion,
  type MotionRuntime,
} from "@/lib/motion/runtime";

const MotionContext = createContext({
  paused: false,
  setPaused: (() => {}) as (paused: boolean) => void,
});
export function MotionBoundary({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false);
  return (
    <MotionContext.Provider value={{ paused, setPaused }}>
      {children}
    </MotionContext.Provider>
  );
}
export const useMotionPreference = () => useContext(MotionContext);
export function MotionControl() {
  const { paused, setPaused } = useMotionPreference();
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    const query = window.matchMedia(motionQuery);
    const update = () => setAvailable(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return available ? (
    <Button
      variant="quiet"
      onClick={() => setPaused(!paused)}
      aria-pressed={paused}
    >
      {paused ? "Enable motion" : "View without motion"}
    </Button>
  ) : null;
}

/** One scope, cancellable import, reversible media state and measured rebuilds. */
export function useMotionEffect(
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
  setup: (
    runtime: MotionRuntime,
    element: HTMLElement,
    onCleanup: (cleanup: () => void) => void,
  ) => (() => void) | void,
) {
  const { paused } = useMotionPreference();
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || paused) return;
    const query = window.matchMedia(motionQuery);
    let stop: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
    const layoutSignature = () =>
      [
        element,
        ...element.querySelectorAll<HTMLElement>(
          "[data-motion-track], [data-motion-photograph]",
        ),
      ]
        .map(
          // Transformed descendants can grow scope/photo scrollWidth without
          // changing layout. Only the collection track owns intrinsic overflow.
          (node) =>
            `${node.offsetWidth},${node.offsetHeight},${node.matches("[data-motion-track]") ? node.scrollWidth : 0}`,
        )
        .join(";");
    let lastLayout = layoutSignature();
    const rebuild = () => {
      stop?.();
      stop = undefined;
      if (
        disposed ||
        !query.matches ||
        (navigator as Navigator & { connection?: { saveData?: boolean } })
          .connection?.saveData
      )
        return;
      stop = mountDeferredMotion(loadMotion, (runtime) => {
        const media = runtime.gsap.matchMedia(element);
        let manualCleanup: (() => void) | undefined;
        try {
          media.add(motionQuery, () => {
            const cleanup = setup(runtime, element, (registered) => {
              manualCleanup = registered;
            });
            return () => {
              cleanup?.();
              manualCleanup?.();
            };
          });
        } catch {
          media.revert();
          manualCleanup?.();
          return;
        }
        lastLayout = layoutSignature();
        return () => media.revert();
      });
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 120);
    };
    const measuredRefresh = () => {
      if (layoutSignature() !== lastLayout) schedule();
    };
    query.addEventListener("change", rebuild);
    window.addEventListener("resize", schedule);
    element.addEventListener("load", measuredRefresh, true);
    document.fonts?.ready.then(() => {
      if (!disposed) measuredRefresh();
    });
    rebuild();
    return () => {
      disposed = true;
      clearTimeout(timer);
      stop?.();
      query.removeEventListener("change", rebuild);
      window.removeEventListener("resize", schedule);
      element.removeEventListener("load", measuredRefresh, true);
    };
  }, [enabled, paused, ref, setup]);
}
