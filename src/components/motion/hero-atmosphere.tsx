"use client";

import { useCallback, useRef, type ReactNode } from "react";
import { motionTokens } from "@/lib/motion/tokens";
import { damp } from "@/lib/motion/damp";
import type { MotionRuntime } from "@/lib/motion/runtime";
import { useMotionEffect } from "./motion-boundary";

export function HeroAtmosphere({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useRef(false);
  const setup = useCallback(({ gsap }: MotionRuntime, element: HTMLElement) => {
    const entrance = element.querySelector("[data-motion-entrance]");
    const layer = element.querySelector<HTMLElement>("[data-motion-backdrop]")!;
    if (!entered.current && window.scrollY < 10)
      gsap.fromTo(
        entrance,
        { y: motionTokens.hero.entranceDistance },
        {
          y: 0,
          duration: motionTokens.hero.duration,
          ease: motionTokens.hero.ease,
        },
      );
    entered.current = true;
    if (!layer) return;
    let frame = 0,
      previous = 0,
      x = 0,
      y = 0,
      targetX = 0,
      targetY = 0;
    let visible = true;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      x = y = targetX = targetY = 0;
      layer.style.removeProperty("transform");
    };
    const tick = (time: number) => {
      const delta = previous ? time - previous : 16;
      previous = time;
      x = damp(x, targetX, delta);
      y = damp(y, targetY, delta);
      layer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${motionTokens.hero.backdropScale})`;
      frame = x === targetX && y === targetY ? 0 : requestAnimationFrame(tick);
    };
    const move = (event: PointerEvent) => {
      if (
        !visible ||
        document.hidden ||
        event.pointerType !== "mouse" ||
        element.contains(document.activeElement)
      )
        return;
      const bounds = element.getBoundingClientRect();
      targetX = Math.max(
        -motionTokens.hero.pointerX,
        Math.min(
          motionTokens.hero.pointerX,
          ((event.clientX - bounds.left) / bounds.width - 0.5) *
            2 *
            motionTokens.hero.pointerX,
        ),
      );
      targetY = Math.max(
        -motionTokens.hero.pointerY,
        Math.min(
          motionTokens.hero.pointerY,
          ((event.clientY - bounds.top) / bounds.height - 0.5) *
            2 *
            motionTokens.hero.pointerY,
        ),
      );
      if (!frame) {
        previous = 0;
        frame = requestAnimationFrame(tick);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) stop();
    });
    observer.observe(element);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerleave", stop);
    element.addEventListener("focusin", stop);
    document.addEventListener("visibilitychange", stop);
    return () => {
      stop();
      observer.disconnect();
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", stop);
      element.removeEventListener("focusin", stop);
      document.removeEventListener("visibilitychange", stop);
    };
  }, []);
  useMotionEffect(ref, true, setup);
  return (
    <div
      ref={ref}
      className="relative isolate overflow-hidden"
      data-testid="hero-atmosphere"
    >
      <div data-motion-entrance>{children}</div>
    </div>
  );
}
