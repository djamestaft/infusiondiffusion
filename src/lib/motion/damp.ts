import { motionTokens } from "./tokens";
/** Exponential damping, independent of display refresh rate; never jump on resume. */
export function damp(current: number, target: number, deltaMs: number): number {
  if (Math.abs(target - current) <= motionTokens.damping.settlePx)
    return target;
  return (
    current +
    (target - current) *
      (1 -
        Math.exp(
          -Math.min(motionTokens.damping.maxDeltaMs, Math.max(0, deltaMs)) /
            motionTokens.damping.timeConstantMs,
        ))
  );
}
