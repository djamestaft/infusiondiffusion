import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const styles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("storefront surface tokens", () => {
  it("keeps the approved spacing, shape, depth, motion, and layout primitives", () => {
    for (const [name, value] of Object.entries({
      "space-2xs": "0.25rem",
      "space-xs": "0.5rem",
      "space-sm": "0.75rem",
      "space-md": "1rem",
      "space-lg": "1.5rem",
      "space-xl": "2rem",
      "space-2xl": "3rem",
      "space-3xl": "4rem",
      "space-4xl": "6rem",
      "radius-control": "0.25rem",
      "radius-surface": "0.5rem",
      "motion-state-duration": "150ms",
      "layout-mobile-gutter": "1.25rem",
      "layout-desktop-gutter": "5rem",
      "layout-content-max": "80rem",
    })) {
      expect(styles).toContain(`--${name}: ${value};`);
    }
    expect(styles).toContain(
      "--shadow-subtle: 0 4px 12px rgb(17 17 15 / 12%);",
    );
    expect(styles).toContain(
      "--shadow-raised: 0 12px 32px -4px rgb(17 17 15 / 18%);",
    );
    expect(styles).toContain(
      "--shadow-floating: 0 20px 48px -8px rgb(17 17 15 / 22%);",
    );
  });

  it("keeps mode-complete focus and semantic content pairs", () => {
    expect(styles).toMatch(/:root\s*\{[\s\S]*--action-focus:\s*#ddc77f;/);
    expect(styles).toMatch(/\.dark\s*\{[\s\S]*--action-focus:\s*#ddc77f;/);
    expect(styles).toMatch(/:root\s*\{[\s\S]*--content-primary:\s*#11110f;/);
    expect(styles).toMatch(/\.dark\s*\{[\s\S]*--content-primary:\s*#fcfaf5;/);
  });

  it("removes decorative transitions when reduced motion is requested", () => {
    expect(styles).toMatch(/@media \(prefers-reduced-motion: reduce\)/);
    expect(styles).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation:\s*none;/,
    );
    expect(styles).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[\s\S]*transition:\s*none;/,
    );
  });

  it("keeps Mineral Sage navigation continuous with the page canvas", () => {
    expect(styles).toMatch(/--navigation-surface:\s*#eef0e7;/);
    expect(styles).toMatch(/--navigation-divider:\s*#c5a447;/);
    expect(styles).toMatch(/--navigation-border:\s*#dde2d4;/);
    expect(styles).toMatch(/--content-surface:\s*#eef0e7;/);
    expect(styles).toMatch(/--content-surface-elevated:\s*#e3e7da;/);
  });

  it("preserves the Midnight storefront palette", () => {
    expect(styles).toMatch(
      /\.dark\s*\{[\s\S]*--navigation-surface:\s*#11110f;/,
    );
    expect(styles).toMatch(/\.dark\s*\{[\s\S]*--content-surface:\s*#11110f;/);
    expect(styles).toMatch(
      /\.dark\s*\{[\s\S]*--content-surface-elevated:\s*#191916;/,
    );
  });
});

describe("About canonical surfaces", () => {
  it("maps approved Bone directly and keeps Sage semantic", () => {
    expect(styles).toMatch(/--color-bone-50:\s*var\(--bone-50\)/);
    expect(styles).toMatch(/--bone-50:\s*#f5f1e8;/);
    expect(styles).toMatch(/--content-surface:\s*#eef0e7;/);
  });
});
