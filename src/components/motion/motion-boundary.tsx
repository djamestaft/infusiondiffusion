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
  setup: (runtime: MotionRuntime, element: HTMLElement) => (() => void) | void,
) {
  const { paused } = useMotionPreference();
  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled || paused) return;
    const query = window.matchMedia(motionQuery);
    let stop: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let disposed = false;
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
        try {
          media.add(motionQuery, () => setup(runtime, element));
        } catch {
          media.revert();
          return;
        }
        return () => media.revert();
      });
    };
    const schedule = () => {
      clearTimeout(timer);
      timer = setTimeout(rebuild, 120);
    };
    query.addEventListener("change", rebuild);
    window.addEventListener("resize", schedule);
    element.addEventListener("load", schedule, true);
    document.fonts?.ready.then(() => {
      if (!disposed) schedule();
    });
    rebuild();
    return () => {
      disposed = true;
      clearTimeout(timer);
      stop?.();
      query.removeEventListener("change", rebuild);
      window.removeEventListener("resize", schedule);
      element.removeEventListener("load", schedule, true);
    };
  }, [enabled, paused, ref, setup]);
}
