/** The approved carousel sequence; seconds and CSS pixels, independent of pointer motion. */
export const carouselMotion = {
  letterTravel: 36,
  letterDuration: 0.4,
  staggerBudget: 0.12,
  letterSpacing: 2.5,
  maxLineSpread: 48,
  enterDelay: 0.06,
  imageDelay: 0.04,
  imageStartScale: 0.98,
  imagePeakScale: 1.01,
  imageRiseDuration: 0.22,
  imageSettleDuration: 0.18,
  descriptionRevealDuration: 0.14,
  descriptionRevealSpread: 0.1,
  exitTravel: -24,
  exitDuration: 0.18,
  exitStaggerBudget: 0.04,
} as const;

/** Expand the visual tracking without reflowing words or changing line breaks. */
function lineSpread(chars: Element[], departing = false) {
  const lines = new Map<number, number[]>();
  const offsets = chars.map(() => 0);
  chars.forEach((char, index) => {
    const top = Math.round(char.getBoundingClientRect().top);
    const line = lines.get(top) ?? [];
    line.push(index);
    lines.set(top, line);
  });
  for (const line of lines.values()) {
    const spacing = Math.min(
      carouselMotion.letterSpacing,
      carouselMotion.maxLineSpread / Math.max(1, line.length - 1),
    );
    line.forEach((index, position) => {
      offsets[index] = departing
        ? -(line.length - 1 - position) * spacing
        : position * spacing;
    });
  }
  return offsets;
}

/** Caller owns a GSAP context, the temporary text split and interruption cleanup. */
export function createCarouselTransition(
  gsap: typeof import("gsap").gsap,
  incoming: HTMLElement,
  outgoing: HTMLElement | null,
  chars: Element[],
  outgoingChars: Element[] = [],
  descriptionChars: Element[] = [],
) {
  const image = incoming.querySelector("[data-carousel-picture]");
  const support = incoming.querySelectorAll("[data-carousel-support]");
  const arrivalSpread = lineSpread(chars);
  const departureSpread = lineSpread(outgoingChars, true);
  const timeline = gsap.timeline();
  gsap.set(incoming, { zIndex: 1 });
  if (outgoing) {
    gsap.set(outgoing, { zIndex: 0 });
    if (outgoingChars.length) {
      timeline.to(
        outgoingChars,
        {
          x: (index: number) =>
            carouselMotion.exitTravel + departureSpread[index],
          opacity: 0,
          duration: carouselMotion.exitDuration,
          stagger: { amount: carouselMotion.exitStaggerBudget },
          ease: "power1.inOut",
        },
        0,
      );
      timeline.to(
        outgoing.querySelectorAll(
          "[data-carousel-picture], [data-carousel-support]",
        ),
        { opacity: 0, duration: 0.14, ease: "power2.inOut" },
        0.04,
      );
      timeline.set(
        outgoing,
        { autoAlpha: 0 },
        carouselMotion.exitDuration + carouselMotion.exitStaggerBudget,
      );
    } else {
      timeline.to(
        outgoing,
        { autoAlpha: 0, duration: carouselMotion.exitDuration },
        0,
      );
    }
  }
  if (chars.length) {
    timeline.fromTo(
      chars,
      {
        x: (index: number) =>
          carouselMotion.letterTravel + arrivalSpread[index],
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: carouselMotion.letterDuration,
        stagger: { amount: carouselMotion.staggerBudget },
        ease: "power2.out",
      },
      carouselMotion.enterDelay,
    );
  }
  if (image) {
    timeline.fromTo(
      image,
      { scale: carouselMotion.imageStartScale, opacity: 0 },
      {
        scale: carouselMotion.imagePeakScale,
        opacity: 1,
        duration: carouselMotion.imageRiseDuration,
        ease: "power2.out",
      },
      carouselMotion.enterDelay + carouselMotion.imageDelay,
    );
    timeline.to(
      image,
      {
        scale: 1,
        duration: carouselMotion.imageSettleDuration,
        ease: "power2.inOut",
      },
      carouselMotion.enterDelay +
        carouselMotion.imageDelay +
        carouselMotion.imageRiseDuration,
    );
  }
  const titleEnd =
    carouselMotion.enterDelay +
    carouselMotion.letterDuration +
    carouselMotion.staggerBudget;
  if (support.length) {
    // A discrete reveal, with no fade. Keeping the hidden/revealed states in one
    // tween also gives context.revert one owner for the original opacity.
    timeline.fromTo(
      support,
      { opacity: 0 },
      {
        opacity: 1,
        duration: titleEnd,
        ease: (progress: number) => (progress === 1 ? 1 : 0),
      },
      0,
    );
  }
  if (descriptionChars.length) {
    // Use measured rows, not DOM character order: the reveal goes down the copy
    // and stays bounded even when it wraps onto many lines on a phone.
    const tops = descriptionChars.map((char) =>
      Math.round(char.getBoundingClientRect().top),
    );
    const rows = [...new Set(tops)].sort((a, b) => a - b);
    rows.forEach((top, rowIndex) => {
      timeline.fromTo(
        descriptionChars.filter((_, index) => tops[index] === top),
        { opacity: 0 },
        {
          opacity: 1,
          duration: carouselMotion.descriptionRevealDuration,
          ease: "power2.out",
        },
        titleEnd +
          (rowIndex / Math.max(1, rows.length - 1)) *
            carouselMotion.descriptionRevealSpread,
      );
    });
  }
  return timeline;
}
