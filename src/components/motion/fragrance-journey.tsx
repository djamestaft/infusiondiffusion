"use client";

import { motionTokens } from "@/lib/motion/tokens";
import { useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import {
  ProductCard,
  type ProductCardProps,
} from "@/components/ui/product-card";
import { Heading } from "@/components/ui/content-primitives";
import {
  MotionControl,
  useMotionEffect,
  useMotionPreference,
} from "./motion-boundary";
import { headerOffset, type MotionRuntime } from "@/lib/motion/runtime";

export function FragranceJourney({
  products,
  title,
  cinematic = true,
}: {
  products: ProductCardProps[];
  title: string;
  cinematic?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const { setPaused } = useMotionPreference();
  const setup = useCallback(({ gsap }: MotionRuntime, section: HTMLElement) => {
    const track = section.querySelector<HTMLElement>("[data-motion-track]")!;
    const viewport = section.querySelector<HTMLElement>(
      "[data-motion-viewport]",
    )!;
    section.dataset.motionActive = "true";
    const top = headerOffset() + motionTokens.collection.headerGap;
    const travel = Math.max(0, track.scrollWidth - viewport.clientWidth);
    if (
      !travel ||
      section.offsetHeight >
        window.innerHeight - top - motionTokens.collection.bottomGap
    ) {
      delete section.dataset.motionActive;
      return;
    }
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: () =>
          `top top+=${headerOffset() + motionTokens.collection.headerGap}`,
        end: () =>
          `+=${Math.min(travel, window.innerHeight * motionTokens.collection.maxViewportTravel)}`,
        pin: true,
        scrub: true,
        invalidateOnRefresh: true,
        anticipatePin: 1,
      },
    });
    timeline.to(track, { x: -travel, ease: "none", duration: 1 }, 0);
    timeline.fromTo(
      section.querySelector("[data-motion-names]"),
      { x: motionTokens.collection.nameTravel },
      { x: -motionTokens.collection.nameTravel, ease: "none", duration: 1 },
      0,
    );
    return () => {
      delete section.dataset.motionActive;
    };
  }, []);
  useMotionEffect(ref, cinematic && products.length > 1, setup);
  const stopForFocus = (target: EventTarget) => {
    if (
      !(target instanceof HTMLElement) ||
      !ref.current?.dataset.motionActive ||
      !target.closest("[data-motion-track]")
    )
      return;
    const rect = target.getBoundingClientRect();
    if (rect.left < 0 || rect.right > window.innerWidth) {
      flushSync(() => setPaused(true));
      target.scrollIntoView({ block: "center", behavior: "instant" });
    }
  };
  return (
    <section
      ref={ref}
      aria-labelledby="home-collection-title"
      data-testid="home-cabinet-band"
      className="motion-collection bg-content-surface"
      onFocusCapture={(event) => stopForFocus(event.target)}
    >
      <div className="motion-collection-inner mx-auto w-full max-w-[1440px] px-5 py-10 min-[375px]:px-6 sm:px-10 lg:px-16 lg:py-12">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Heading
            id="home-collection-title"
            level={2}
            className="text-4xl leading-tight sm:text-[42px] lg:text-[46px]"
          >
            {title}
          </Heading>
          <a
            href="/shop"
            className="focus-visible:outline-action-focus inline-flex min-h-11 items-center font-sans font-semibold underline-offset-4 hover:underline focus-visible:outline-2"
          >
            Shop all fragrances{" "}
            <span aria-hidden="true" className="ml-3">
              →
            </span>
          </a>
        </div>
        <div className="my-4 flex flex-wrap items-center justify-between gap-2">
          <a
            href="#home-guidance-title"
            className="focus-visible:outline-action-focus inline-flex min-h-11 items-center text-sm underline underline-offset-4 focus-visible:outline-2"
            onClick={(event) => {
              const target = document.getElementById("home-guidance-title");
              if (!target) return;
              event.preventDefault();
              flushSync(() => setPaused(true));
              target.focus({ preventScroll: true });
              target.scrollIntoView({ block: "start", behavior: "instant" });
            }}
          >
            Skip fragrance collection
          </a>
          <MotionControl />
        </div>
        <div
          data-motion-viewport
          className="motion-collection-viewport relative"
        >
          <div
            aria-hidden="true"
            data-motion-names
            data-fragrance-names={products
              .map((product) => product.name)
              .join(" · ")}
            className="motion-fragrance-names font-display pointer-events-none absolute inset-x-0 top-0 hidden overflow-hidden whitespace-nowrap"
          />
          {products.length ? (
            <div
              data-motion-track
              className="motion-collection-track relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {products.map((product) => (
                <ProductCard
                  key={product.href}
                  {...product}
                  className="max-w-none [overflow-wrap:anywhere]"
                />
              ))}
            </div>
          ) : (
            <p className="text-content-secondary font-sans">
              The collection is being prepared. Please return soon to explore
              the first fragrances.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
