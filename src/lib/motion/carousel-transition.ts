/** The approved carousel sequence; seconds and CSS pixels, independent of pointer motion. */
export const carouselMotion = {
  letterTravel: 36,
  letterDuration: 0.55,
  staggerBudget: 0.2,
  enterDelay: 0.1,
  imageDelay: 0.12,
  imageStartScale: 0.98,
  imagePeakScale: 1.01,
  imageRiseDuration: 0.3,
  imageSettleDuration: 0.28,
  supportDelay: 0.2,
  supportDuration: 0.35,
  exitTravel: -24,
  exitDuration: 0.22,
  exitStaggerBudget: 0.08,
} as const;

/** Caller owns a GSAP context, the temporary text split and interruption cleanup. */
export function createCarouselTransition(
  gsap: typeof import("gsap").gsap,
  incoming: HTMLElement,
  outgoing: HTMLElement | null,
  chars: Element[],
  outgoingChars: Element[] = [],
) {
  const image = incoming.querySelector("[data-carousel-picture]");
  const support = incoming.querySelectorAll("[data-carousel-support]");
  const timeline = gsap.timeline();
  gsap.set(incoming, { zIndex: 1 });
  if (outgoing) {
    gsap.set(outgoing, { zIndex: 0 });
    if (outgoingChars.length) {
      timeline.to(
        outgoingChars,
        {
          x: carouselMotion.exitTravel,
          opacity: 0,
          duration: carouselMotion.exitDuration,
          stagger: { amount: carouselMotion.exitStaggerBudget },
          ease: "power2.in",
        },
        0,
      );
      timeline.to(
        outgoing.querySelectorAll(
          "[data-carousel-picture], [data-carousel-support]",
        ),
        { opacity: 0, duration: 0.16, ease: "power2.inOut" },
        0.08,
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
      { x: carouselMotion.letterTravel, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: carouselMotion.letterDuration,
        stagger: { amount: carouselMotion.staggerBudget },
        ease: "power3.out",
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
  if (support.length) {
    timeline.fromTo(
      support,
      { x: 12, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: carouselMotion.supportDuration,
        stagger: 0.04,
        ease: "power3.out",
      },
      carouselMotion.enterDelay + carouselMotion.supportDelay,
    );
  }
  return timeline;
}
