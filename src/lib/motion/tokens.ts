/** The selected study contract; distances are CSS pixels, durations are seconds. */
export const motionTokens = {
  hero: {
    entranceDistance: 16,
    duration: 0.7,
    ease: "power3.out",
    pointerX: 6,
    pointerY: 4,
    backdropScale: 1.02,
  },
  collection: {
    nameTravel: 32,
    maxViewportTravel: 2.5,
    headerGap: 16,
    bottomGap: 24,
  },
  chapter: { travel: 12, headerGap: 24, bottomGap: 48 },
  damping: { timeConstantMs: 120, maxDeltaMs: 64, settlePx: 0.1 },
} as const;
