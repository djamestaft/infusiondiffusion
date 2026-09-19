"use client";

import {
  useCallback,
  useRef,
  type CSSProperties,
  type ReactNode,
  type RefObject,
} from "react";
import { motionTokens } from "@/lib/motion/tokens";
import { damp } from "@/lib/motion/damp";
import type { MotionRuntime } from "@/lib/motion/runtime";
import { useMotionEffect, useMotionPreference } from "./motion-boundary";

export function HeroAtmosphere({
  children,
  pointerX = motionTokens.hero.pointerX,
  pointerY = motionTokens.hero.pointerY,
  animateEntrance = true,
  focusScope,
}: {
  children: ReactNode;
  pointerX?: number;
  pointerY?: number;
  animateEntrance?: boolean;
  focusScope?: RefObject<HTMLElement | null>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const entered = useRef(false);
  const { paused } = useMotionPreference();
  const setup = useCallback(
    ({ gsap }: MotionRuntime, element: HTMLElement) => {
      const entrance = element.querySelector("[data-motion-entrance]");
      const focusElement = focusScope?.current ?? element;
      const layer = element.querySelector<HTMLElement>(
        "[data-motion-backdrop]",
      )!;
      if (animateEntrance && !entered.current && window.scrollY < 10)
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
      // Hover boundaries suspend work without changing the visible pose.
      const pause = () => {
        cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
      };
      const reset = () => {
        pause();
        x = y = targetX = targetY = 0;
        layer.style.removeProperty("transform");
      };
      const tick = (time: number) => {
        const delta = previous ? time - previous : 16;
        previous = time;
        x = damp(x, targetX, delta);
        y = damp(y, targetY, delta);
        layer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${motionTokens.hero.backdropScale})`;
        frame =
          x === targetX && y === targetY ? 0 : requestAnimationFrame(tick);
      };
      const move = (event: PointerEvent) => {
        if (
          !visible ||
          document.hidden ||
          event.pointerType !== "mouse" ||
          focusElement.contains(document.activeElement)
        )
          return;
        const bounds = element.getBoundingClientRect();
        targetX = Math.max(
          -pointerX,
          Math.min(
            pointerX,
            ((event.clientX - bounds.left) / bounds.width - 0.5) * 2 * pointerX,
          ),
        );
        targetY = Math.max(
          -pointerY,
          Math.min(
            pointerY,
            ((event.clientY - bounds.top) / bounds.height - 0.5) * 2 * pointerY,
          ),
        );
        if (!frame) {
          previous = 0;
          frame = requestAnimationFrame(tick);
        }
      };
      const observer = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        if (!visible) pause();
      });
      observer.observe(element);
      element.addEventListener("pointermove", move);
      element.addEventListener("pointerleave", pause);
      focusElement.addEventListener("focusin", reset);
      document.addEventListener("visibilitychange", pause);
      return () => {
        reset();
        observer.disconnect();
        element.removeEventListener("pointermove", move);
        element.removeEventListener("pointerleave", pause);
        focusElement.removeEventListener("focusin", reset);
        document.removeEventListener("visibilitychange", pause);
      };
    },
    [animateEntrance, pointerX, pointerY, focusScope],
  );
  useMotionEffect(ref, true, setup);
  return (
    <div
      ref={ref}
      className="motion-hero relative isolate overflow-hidden"
      data-motion-paused={paused || undefined}
      style={
        {
          "--motion-hero-scale": motionTokens.hero.backdropScale,
        } as CSSProperties
      }
      data-testid="hero-atmosphere"
    >
      <div data-motion-entrance>{children}</div>
    </div>
  );
}
