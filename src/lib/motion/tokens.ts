/** The selected study contract; distances are CSS pixels, durations are seconds. */
export const motionTokens = {
  hero: {
    entranceDistance: 16,
    duration: 0.7,
    ease: "power3.out",
    pointerX: 18,
    pointerY: 12,
    backdropScale: 1.04,
  },
  collection: {
    nameTravel: 32,
    maxViewportTravel: 2.5,
    headerGap: 12,
    bottomGap: 16,
  },
  chapter: { travel: 12, headerGap: 24, bottomGap: 48 },
  damping: { timeConstantMs: 160, maxDeltaMs: 64, settlePx: 0.1 },
} as const;
