import { describe, expect, it } from "vitest";
import { damp } from "./damp";

describe("time-based pointer damping", () => {
  it("converges equivalently at 30, 60 and 120Hz", () => {
    const results = [30, 60, 120].map((hz) => {
      let value = 0;
      for (let i = 0; i < hz / 5; i++) value = damp(value, 6, 1000 / hz);
      return value;
    });
    expect(results[0]).toBeCloseTo(results[1], 8);
    expect(results[1]).toBeCloseTo(results[2], 8);
  });
  it("clamps resumed-tab deltas and settles without perpetual work", () => {
    expect(damp(0, 6, 10000)).toBe(damp(0, 6, 64));
    expect(damp(5.95, 6, 16)).toBe(6);
    expect(damp(2, 6, -1)).toBe(2);
  });
});
