"use client";

import Image from "next/image";
import { Pause, Play } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroCarouselSlide = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  hotspot?: { x: number; y: number };
};

export type HeroCarouselProps = {
  slides: HeroCarouselSlide[];
  className?: string;
  initialPaused?: boolean;
  forceReducedMotion?: boolean;
  forceSaveData?: boolean;
  loading?: boolean;
};

const AUTOPLAY_MS = 8_000;

export function HeroCarousel({
  slides: suppliedSlides,
  className,
  initialPaused = false,
  forceReducedMotion,
  forceSaveData,
  loading = false,
}: HeroCarouselProps) {
  const slides = suppliedSlides.slice(0, 3);
  const [active, setActive] = React.useState(0);
  const [userPaused, setUserPaused] = React.useState(initialPaused);
  const [interactionPaused, setInteractionPaused] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [imageFailed, setImageFailed] = React.useState(false);
  const [manualAnnouncement, setManualAnnouncement] = React.useState("");
  const [reducedMotion, setReducedMotion] = React.useState(
    forceReducedMotion ?? false,
  );
  const [saveData, setSaveData] = React.useState(forceSaveData ?? false);
  const [autoplayComplete, setAutoplayComplete] = React.useState(false);

  React.useEffect(() => {
    if (forceReducedMotion !== undefined) return;
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [forceReducedMotion]);

  React.useEffect(() => {
    if (forceSaveData !== undefined) return;
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    const frame = window.requestAnimationFrame(() =>
      setSaveData(Boolean(connection?.saveData)),
    );
    return () => window.cancelAnimationFrame(frame);
  }, [forceSaveData]);

  React.useEffect(() => {
    const update = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const canAutoplay =
    slides.length > 1 &&
    !userPaused &&
    !interactionPaused &&
    !hidden &&
    !reducedMotion &&
    !saveData &&
    !autoplayComplete;

  React.useEffect(() => {
    if (!canAutoplay) return;
    const timeout = window.setTimeout(() => {
      setAutoplayComplete(true);
      setActive((current) => (current + 1) % slides.length);
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timeout);
  }, [canAutoplay, active, slides.length]);

  if (!slides.length || imageFailed) {
    return (
      <div
        className={cn(
          "bg-product-card-media-fallback relative aspect-4/5 overflow-hidden rounded-lg",
          className,
        )}
        data-testid="hero-carousel-fallback"
      >
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <span className="bg-content-accent absolute top-[20%] right-0 left-0 h-px" />
          <span className="bg-content-accent absolute top-[40%] right-0 left-0 h-px" />
          <span className="bg-content-accent absolute top-[60%] right-0 left-0 h-px" />
          <span className="bg-content-accent absolute top-[80%] right-0 left-0 h-px" />
        </div>
        <span className="sr-only">Hero image unavailable</span>
      </div>
    );
  }

  const current = slides[active];
  const paused = userPaused || interactionPaused || hidden;
  const select = (index: number) => {
    setAutoplayComplete(true);
    setActive(index);
    setImageFailed(false);
    setManualAnnouncement(`Slide ${index + 1} of ${slides.length}`);
  };

  return (
    <figure
      className={cn("relative", className)}
      onMouseEnter={() => setInteractionPaused(true)}
      onMouseLeave={() => setInteractionPaused(false)}
      onFocusCapture={() => setInteractionPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setInteractionPaused(false);
        }
      }}
      aria-roledescription={slides.length > 1 ? "carousel" : undefined}
      aria-label="Homepage campaign imagery"
      data-autoplay={canAutoplay ? "running" : "paused"}
    >
      <div className="bg-product-card-media-fallback relative aspect-4/5 overflow-hidden rounded-lg">
        {slides.map((slide, index) => (
          <Image
            key={slide.id}
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="(max-width: 1023px) calc(100vw - 40px), 40vw"
            className={cn(
              "object-cover transition-opacity duration-500 motion-reduce:transition-none",
              index === active
                ? "opacity-100"
                : "pointer-events-none opacity-0",
            )}
            style={{
              objectPosition: slide.hotspot
                ? `${slide.hotspot.x * 100}% ${slide.hotspot.y * 100}%`
                : undefined,
            }}
            onError={() => index === active && setImageFailed(true)}
          />
        ))}
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <span className="bg-content-accent absolute top-[20%] right-0 left-0 h-px" />
          <span className="bg-content-accent absolute top-[40%] right-0 left-0 h-px" />
          <span className="bg-content-accent absolute top-[60%] right-0 left-0 h-px" />
          <span className="bg-content-accent absolute top-[80%] right-0 left-0 h-px" />
        </div>
        {loading ? (
          <div
            className="bg-product-card-media-fallback absolute inset-0 animate-pulse motion-reduce:animate-none"
            aria-hidden="true"
          />
        ) : null}
      </div>
      <figcaption className="sr-only">
        {current.caption || `Slide ${active + 1} of ${slides.length}`}
      </figcaption>
      {slides.length > 1 ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <div className="flex" aria-label="Choose a hero slide">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className="focus-visible:outline-action-focus relative flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label={`Show slide ${index + 1} of ${slides.length}`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => select(index)}
              >
                <svg
                  className="size-6 -rotate-90"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    fill="var(--content-secondary)"
                    opacity=".45"
                  />
                  {index === active ? (
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      fill="none"
                      stroke="var(--content-accent)"
                      strokeWidth="1.5"
                      pathLength="1"
                      strokeDasharray="1"
                      strokeDashoffset={canAutoplay ? "0" : "1"}
                      className={cn(canAutoplay && "hero-carousel-progress")}
                    />
                  ) : null}
                </svg>
              </button>
            ))}
          </div>
          <Button
            variant="quiet"
            size="icon"
            aria-label={userPaused ? "Play carousel" : "Pause carousel"}
            onClick={() => {
              setAutoplayComplete(false);
              setUserPaused((value) => !value);
            }}
          >
            {userPaused ? (
              <Play aria-hidden="true" className="size-4" />
            ) : (
              <Pause aria-hidden="true" className="size-4" />
            )}
          </Button>
        </div>
      ) : null}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {manualAnnouncement}
      </span>
      <span className="sr-only">{paused ? "Carousel paused" : ""}</span>
    </figure>
  );
}
