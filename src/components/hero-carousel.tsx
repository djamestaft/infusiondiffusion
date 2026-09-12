"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type HeroCarouselSlide = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
  title?: string;
  subtitle?: string;
  cta?: { label: string; href: string };
  hotspot?: { x: number; y: number };
};

export type HeroCarouselProps = {
  slides: HeroCarouselSlide[];
  className?: string;
  presentation?: "framed" | "plain" | "editorial";
  backgroundSrc?: string | null;
  fallbackCopy?: {
    title: string;
    subtitle: string;
    cta: { label: string; href: string };
  };
  withNavigation?: boolean;
  initialPaused?: boolean;
  forceReducedMotion?: boolean;
  forceSaveData?: boolean;
  loading?: boolean;
};

const AUTOPLAY_MS = 3_000;

function ImageCarousel({
  slides: suppliedSlides,
  className,
  presentation = "framed",
  initialPaused = false,
  forceReducedMotion,
  forceSaveData,
  loading = false,
}: HeroCarouselProps) {
  const slides = React.useMemo(
    () => suppliedSlides.slice(0, 3),
    [suppliedSlides],
  );
  const [active, setActive] = React.useState(0);
  const [userPaused, setUserPaused] = React.useState(initialPaused);
  const [interactionPaused, setInteractionPaused] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [offscreen, setOffscreen] = React.useState(false);
  const [failedSlideIds, setFailedSlideIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [manualAnnouncement, setManualAnnouncement] = React.useState("");
  const [reducedMotion, setReducedMotion] = React.useState(
    forceReducedMotion ?? false,
  );
  const [saveData, setSaveData] = React.useState(forceSaveData ?? false);
  const [progressCycle, setProgressCycle] = React.useState(0);
  const carouselRef = React.useRef<HTMLElement>(null);
  const wasAutoplaying = React.useRef(false);

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

  React.useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { threshold: 0.01 },
    );
    observer.observe(carousel);
    return () => observer.disconnect();
  }, []);

  const canAutoplay =
    slides.length > 1 &&
    !userPaused &&
    !interactionPaused &&
    !hidden &&
    !offscreen &&
    !reducedMotion &&
    !saveData;
  const autoplayUnavailable = reducedMotion || saveData;
  const autoplayRequested = !userPaused;

  React.useEffect(() => {
    if (canAutoplay && !wasAutoplaying.current) {
      setProgressCycle((current) => current + 1);
    }
    wasAutoplaying.current = canAutoplay;
  }, [canAutoplay]);

  React.useEffect(() => {
    if (!canAutoplay) return;
    const timeout = window.setTimeout(() => {
      setActive((current) => {
        for (let offset = 1; offset < slides.length; offset += 1) {
          const candidate = (current + offset) % slides.length;
          if (!failedSlideIds.has(slides[candidate].id)) return candidate;
        }
        return current;
      });
    }, AUTOPLAY_MS);
    return () => window.clearTimeout(timeout);
  }, [canAutoplay, active, failedSlideIds, slides]);

  if (!slides.length || failedSlideIds.size === slides.length) {
    return (
      <div
        className={cn(
          "bg-product-card-media-fallback relative overflow-hidden",
          presentation === "plain" ? "aspect-[5/4]" : "aspect-4/5 rounded-lg",
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
  const paused = userPaused || interactionPaused || hidden || offscreen;
  const select = (index: number) => {
    if (failedSlideIds.has(slides[index].id)) return;
    setUserPaused(true);
    setActive(index);
    setManualAnnouncement(`Slide ${index + 1} of ${slides.length}`);
  };

  const markFailed = (index: number) => {
    const failedId = slides[index].id;
    setFailedSlideIds((current) => new Set(current).add(failedId));
    if (index !== active) return;
    const nextFailed = new Set(failedSlideIds).add(failedId);
    const nextIndex = slides.findIndex((slide) => !nextFailed.has(slide.id));
    if (nextIndex >= 0) setActive(nextIndex);
  };

  return (
    <figure
      ref={carouselRef}
      className={cn("relative", className)}
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
      <div
        className={cn("relative", presentation === "framed" && "p-3 lg:p-5")}
        data-testid="hero-carousel-stage"
      >
        <div className="relative" data-testid="hero-carousel-bracket-envelope">
          {presentation === "framed" ? (
            <>
              <span
                className="border-hero-carousel-bracket pointer-events-none absolute -top-2 -left-2 size-10 rounded-tl-[8px] border-t border-l lg:-top-3 lg:-left-3 lg:size-14"
                data-testid="hero-carousel-bracket-top-left"
                aria-hidden="true"
              />
              <span
                className="border-hero-carousel-bracket pointer-events-none absolute -top-2 -right-2 size-10 rounded-tr-[8px] border-t border-r lg:-top-3 lg:-right-3 lg:size-14"
                data-testid="hero-carousel-bracket-top-right"
                aria-hidden="true"
              />
              <span
                className="border-hero-carousel-bracket pointer-events-none absolute -bottom-2 -left-2 size-10 rounded-bl-[8px] border-b border-l lg:-bottom-3 lg:-left-3 lg:size-14"
                data-testid="hero-carousel-bracket-bottom-left"
                aria-hidden="true"
              />
              <span
                className="border-hero-carousel-bracket pointer-events-none absolute -right-2 -bottom-2 size-10 rounded-br-[8px] border-r border-b lg:-right-3 lg:-bottom-3 lg:size-14"
                data-testid="hero-carousel-bracket-bottom-right"
                aria-hidden="true"
              />
            </>
          ) : null}
          <div
            className={cn(
              "bg-product-card-media-fallback relative overflow-hidden",
              presentation === "plain"
                ? "aspect-[5/4]"
                : "aspect-4/5 rounded-[8px]",
            )}
            data-testid="hero-carousel-media"
          >
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
                onError={() => markFailed(index)}
              />
            ))}
            {loading ? (
              <div
                className="bg-product-card-media-fallback absolute inset-0 animate-pulse motion-reduce:animate-none"
                aria-hidden="true"
              />
            ) : null}
          </div>
        </div>
      </div>
      <figcaption className="sr-only">
        {current.caption || `Slide ${active + 1} of ${slides.length}`}
      </figcaption>
      {slides.length > 1 ? (
        <div
          className="mt-5 flex items-center justify-center gap-1 lg:mt-6"
          data-testid="hero-carousel-controls"
        >
          <div className="flex" aria-label="Choose a hero slide">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                className="focus-visible:outline-action-focus relative flex size-11 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2"
                aria-label={`Show slide ${index + 1} of ${slides.length}`}
                aria-current={index === active ? "true" : undefined}
                disabled={failedSlideIds.has(slide.id)}
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
                      key={`${slide.id}-${progressCycle}`}
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
            aria-label={
              autoplayUnavailable
                ? "Autoplay unavailable"
                : autoplayRequested
                  ? "Pause carousel"
                  : "Play carousel"
            }
            disabled={autoplayUnavailable}
            onClick={(event) => {
              setUserPaused(autoplayRequested);
              if (!autoplayRequested) {
                setInteractionPaused(false);
                event.currentTarget.blur();
              }
            }}
          >
            {autoplayRequested ? (
              <Pause aria-hidden="true" className="size-4" />
            ) : (
              <Play aria-hidden="true" className="size-4" />
            )}
          </Button>
        </div>
      ) : null}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {manualAnnouncement}
      </span>
      <span className="sr-only" data-testid="carousel-status">
        {autoplayUnavailable
          ? "Carousel autoplay unavailable"
          : canAutoplay
            ? "Carousel playing"
            : paused
              ? "Carousel paused"
              : "Carousel waiting"}
      </span>
    </figure>
  );
}

/** The editorial presentation keeps campaign copy and media in one slide. */
export function HeroCarousel(props: HeroCarouselProps) {
  return props.presentation === "editorial" ? (
    <EditorialCarousel {...props} />
  ) : (
    <ImageCarousel {...props} />
  );
}

function EditorialCarousel({
  slides: suppliedSlides,
  backgroundSrc = "/images/carousel/reed-shadows.webp",
  fallbackCopy,
  withNavigation = false,
  loading = false,
  initialPaused = false,
  forceReducedMotion,
  forceSaveData,
  className,
}: HeroCarouselProps) {
  const slides = React.useMemo(
    () => suppliedSlides.slice(0, 3),
    [suppliedSlides],
  );
  const [selected, setSelected] = React.useState(0);
  const [previous, setPrevious] = React.useState<number | null>(null);
  const [direction, setDirection] = React.useState(1);
  const active = Math.min(selected, Math.max(0, slides.length - 1));
  const [announcement, setAnnouncement] = React.useState("");
  const touch = React.useRef<{ x: number; y: number } | null>(null);
  const current = slides[active];
  const carouselRef = React.useRef<HTMLElement>(null);
  const [userPaused, setUserPaused] = React.useState(initialPaused);
  const [hovered, setHovered] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [offscreen, setOffscreen] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [motionPreference, setMotionPreference] = React.useState(false);
  const [dataPreference, setDataPreference] = React.useState(false);
  const reducedMotion = forceReducedMotion ?? motionPreference;
  const saveData = forceSaveData ?? dataPreference;
  React.useEffect(() => {
    // Native boundary events also cover the separately hydrated floating header.
    const carousel = carouselRef.current;
    const enter = () => setHovered(true);
    const leave = () => setHovered(false);
    carousel?.addEventListener("mouseenter", enter);
    carousel?.addEventListener("mouseleave", leave);
    // Changing the Play/Pause icon can remove the old hover target before
    // mouseleave fires. Pointer movement reconciles hover across that swap.
    const updateHover = (event: PointerEvent) => {
      if (event.pointerType === "mouse")
        setHovered(Boolean(carousel?.contains(event.target as Node)));
    };
    document.addEventListener("pointermove", updateHover, { passive: true });
    const query = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setMotionPreference(Boolean(query?.matches));
    const updateVisibility = () => setHidden(document.hidden);
    updateMotion();
    updateVisibility();
    const connection = (
      navigator as Navigator & {
        connection?: {
          saveData?: boolean;
          addEventListener?: (name: string, listener: () => void) => void;
          removeEventListener?: (name: string, listener: () => void) => void;
        };
      }
    ).connection;
    const updateConnection = () => {
      setDataPreference(Boolean(connection?.saveData));
      setReady(true);
    };
    updateConnection();
    connection?.addEventListener?.("change", updateConnection);
    query?.addEventListener("change", updateMotion);
    document.addEventListener("visibilitychange", updateVisibility);
    const observer =
      typeof IntersectionObserver === "undefined"
        ? null
        : new IntersectionObserver(
            ([entry]) => setOffscreen(!entry.isIntersecting),
            { threshold: 0.01 },
          );
    if (carouselRef.current) observer?.observe(carouselRef.current);
    return () => {
      carousel?.removeEventListener("mouseenter", enter);
      carousel?.removeEventListener("mouseleave", leave);
      document.removeEventListener("pointermove", updateHover);
      query?.removeEventListener("change", updateMotion);
      connection?.removeEventListener?.("change", updateConnection);
      document.removeEventListener("visibilitychange", updateVisibility);
      observer?.disconnect();
    };
  }, []);
  const autoplayUnavailable = reducedMotion || saveData || loading;
  const canAutoplay =
    ready &&
    slides.length > 1 &&
    !autoplayUnavailable &&
    !userPaused &&
    !hovered &&
    !hidden &&
    !offscreen;
  const move = React.useCallback(
    (offset: number, manual = true) => {
      if (slides.length < 2) return;
      const next = (active + offset + slides.length) % slides.length;
      setPrevious(reducedMotion ? null : active);
      setDirection(offset > 0 ? 1 : -1);
      setSelected(next);
      if (manual) {
        setUserPaused(true);
        setAnnouncement(
          `Slide ${next + 1} of ${slides.length}: ${slides[next].title ?? fallbackCopy?.title ?? ""}`,
        );
      }
    },
    [active, slides, fallbackCopy?.title, reducedMotion],
  );
  React.useEffect(() => {
    if (!canAutoplay) return;
    const timeout = window.setTimeout(() => move(1, false), 6_000);
    return () => window.clearTimeout(timeout);
  }, [canAutoplay, move]);
  const campaigns = slides.length
    ? slides
    : [{ id: "empty", src: "", alt: "" }];
  return (
    <section
      ref={carouselRef}
      data-autoplay={canAutoplay ? "running" : "paused"}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).closest("[data-carousel-rotation]"))
          setUserPaused(true);
      }}
      className={cn(
        "dark bg-content-surface text-content-primary relative isolate flex min-h-svh flex-col justify-center",
        withNavigation && "pt-[var(--navigation-height)]",
        className,
      )}
      aria-label="Homepage campaigns"
      aria-roledescription={slides.length > 1 ? "carousel" : undefined}
      data-testid="home-hero-section"
      onKeyDown={(event) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          move(event.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      {backgroundSrc ? (
        <Image
          src={backgroundSrc}
          alt=""
          fill
          sizes="100vw"
          priority
          className="pointer-events-none -z-20 object-cover object-[20%_center] lg:object-center"
        />
      ) : null}
      <div className="bg-content-surface pointer-events-none absolute inset-0 -z-10 opacity-50 lg:opacity-40" />
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-6 pb-4 min-[375px]:px-6 sm:px-10 lg:px-24 lg:pt-10 lg:pb-6 2xl:px-16">
        <div
          className="hero-editorial-viewport -m-2 grid overflow-hidden p-2"
          data-moving={previous !== null && !reducedMotion}
          style={{ "--hero-slide-direction": direction } as React.CSSProperties}
          data-testid="hero-carousel-viewport"
          onTouchStart={(event) => {
            const point = event.touches[0];
            touch.current = { x: point.clientX, y: point.clientY };
          }}
          onTouchEnd={(event) => {
            if (!touch.current) return;
            const point = event.changedTouches[0];
            const dx = point.clientX - touch.current.x;
            const dy = point.clientY - touch.current.y;
            touch.current = null;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5)
              move(dx < 0 ? 1 : -1);
          }}
        >
          {campaigns.map((slide, index) => {
            const visible = index === active;
            const outgoing = index === previous && !visible;
            const cta = slide.cta ?? fallbackCopy?.cta;
            return (
              <div
                key={slide.id}
                className={cn(
                  "hero-editorial-panel col-start-1 row-start-1 grid gap-6 lg:grid-cols-[minmax(0,520fr)_minmax(0,600fr)] lg:items-center lg:gap-16",
                  !visible && "pointer-events-none",
                  !visible && !outgoing && "invisible",
                )}
                data-phase={
                  visible
                    ? previous === null
                      ? "idle"
                      : "enter"
                    : outgoing
                      ? "exit"
                      : "inactive"
                }
                onAnimationEnd={(event) => {
                  if (
                    event.target === event.currentTarget &&
                    visible &&
                    event.animationName === "hero-editorial-enter"
                  )
                    setPrevious(null);
                }}
                inert={!visible}
                aria-hidden={!visible}
              >
                <CampaignImage
                  slide={slide}
                  priority={index === 0}
                  loading={loading}
                />
                <div className="flex min-w-0 flex-col items-start gap-4 lg:order-first lg:gap-6">
                  {slide.title || fallbackCopy?.title ? (
                    <h1 className="font-display max-w-[580px] text-[30px] leading-[36px] whitespace-pre-line sm:text-[42px] sm:leading-[50px] lg:text-5xl lg:leading-[56px]">
                      {slide.title ?? fallbackCopy?.title}
                    </h1>
                  ) : null}
                  {slide.subtitle || fallbackCopy?.subtitle ? (
                    <p className="max-w-[520px] font-sans text-[15px] leading-6 sm:text-base sm:leading-[26px] lg:text-lg lg:leading-[29px]">
                      {slide.subtitle ?? fallbackCopy?.subtitle}
                    </p>
                  ) : null}
                  {cta &&
                  cta.href.startsWith("/") &&
                  !cta.href.startsWith("//") &&
                  !cta.href.includes("\\") ? (
                    <Button
                      asChild
                      className="min-h-12 w-[236px] max-w-full text-xs uppercase sm:text-[13px]"
                    >
                      <a href={cta.href}>{cta.label}</a>
                    </Button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
        {slides.length > 1 ? (
          <div
            className="mt-4 flex items-center justify-between lg:mt-7 lg:grid lg:grid-cols-[minmax(0,520fr)_minmax(0,600fr)] lg:gap-16"
            data-testid="hero-carousel-controls"
          >
            <Button
              variant="outline"
              size="icon"
              className="size-11 rounded-full lg:absolute lg:top-1/2 lg:left-[max(10px,calc((100%-1440px)/4+10px))]"
              aria-label="Previous slide"
              onClick={() => move(-1)}
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </Button>
            <Button
              data-carousel-rotation
              variant="quiet"
              className="text-navigation-accent disabled:text-navigation-accent mx-auto min-w-11 px-2 font-sans text-[11px] tracking-normal tabular-nums disabled:bg-transparent lg:col-start-2 lg:justify-self-center"
              disabled={autoplayUnavailable}
              aria-label={
                autoplayUnavailable
                  ? "Autoplay unavailable"
                  : userPaused
                    ? "Play carousel"
                    : "Pause carousel"
              }
              title={
                autoplayUnavailable
                  ? "Autoplay unavailable"
                  : userPaused
                    ? "Resume slideshow"
                    : "Pause slideshow"
              }
              onClick={() => setUserPaused((paused) => !paused)}
            >
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(slides.length).padStart(2, "0")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-11 rounded-full lg:absolute lg:top-1/2 lg:right-[max(10px,calc((100%-1440px)/4+10px))]"
              aria-label="Next slide"
              onClick={() => move(1)}
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </Button>
          </div>
        ) : null}
      </div>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </span>
      <span className="sr-only">{current?.caption}</span>
    </section>
  );
}

function CampaignImage({
  slide,
  priority,
  loading,
}: {
  slide: HeroCarouselSlide;
  priority: boolean;
  loading: boolean;
}) {
  const [failedSource, setFailedSource] = React.useState<string | null>(null);
  return (
    <div
      className="hero-editorial-image bg-product-card-media-fallback border-navigation-divider relative aspect-[5/4] w-full overflow-hidden border"
      data-testid="hero-carousel-media"
    >
      {slide.src && failedSource !== slide.src ? (
        <Image
          src={slide.src}
          alt={slide.alt}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes="(min-width: 1440px) 600px, (min-width: 1024px) 42vw, calc(100vw - 48px)"
          className="object-contain"
          style={{
            objectPosition: slide.hotspot
              ? `${slide.hotspot.x * 100}% ${slide.hotspot.y * 100}%`
              : undefined,
          }}
          onError={() => setFailedSource(slide.src)}
        />
      ) : (
        <span className="sr-only">Hero image unavailable</span>
      )}
      {loading ? (
        <div
          className="bg-product-card-media-fallback absolute inset-0 animate-pulse motion-reduce:animate-none"
          role="status"
          aria-label="Loading campaign image"
        />
      ) : null}
    </div>
  );
}
