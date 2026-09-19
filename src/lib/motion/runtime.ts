export const motionQuery =
  "(min-width: 1024px) and (min-height: 680px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/** The import owns no DOM. A cancelled generation can never acquire effects. */
export function mountDeferredMotion<T>(
  load: () => Promise<T>,
  mount: (runtime: T) => (() => void) | void,
) {
  let cancelled = false;
  let cleanup: (() => void) | void;
  load()
    .then((runtime) => {
      if (!cancelled) cleanup = mount(runtime);
    })
    .catch(() => {
      /* Default HTML is the failure state. */
    });
  return () => {
    if (cancelled) return;
    cancelled = true;
    cleanup?.();
  };
}

export async function loadMotion() {
  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
  ]);
  gsap.registerPlugin(ScrollTrigger);
  return { gsap, ScrollTrigger };
}
export type MotionRuntime = Awaited<ReturnType<typeof loadMotion>>;

export function headerOffset() {
  const header = document
    .querySelector<HTMLElement>("nav[aria-label='Primary']")
    ?.closest("header");
  return Math.max(0, header?.getBoundingClientRect().bottom ?? 80);
}
