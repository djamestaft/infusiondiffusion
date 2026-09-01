import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const styles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("storefront surface tokens", () => {
  it("maps the approved foundation primitives to semantic roles", () => {
    expect(styles).toMatch(/--ink-900:\s*#191916;/);
    expect(styles).toMatch(/--sage-50:\s*#eef0e7;/);
    expect(styles).toMatch(/--gold-500:\s*#c5a447;/);
    expect(styles).toMatch(/--gold-300:\s*#ddc77f;/);
    expect(styles).toMatch(/--gold-700:\s*#a9842d;/);
    expect(styles).toMatch(/--background:\s*var\(--sage-50\);/);
    expect(styles).toMatch(/--foreground:\s*var\(--ink-900\);/);
    expect(styles).toMatch(/--primary:\s*var\(--ink-900\);/);
    expect(styles).toMatch(/--action-primary:\s*var\(--gold-500\);/);
    expect(styles).toMatch(/--action-focus:\s*var\(--gold-700\);/);
  });

  it("exposes the approved 4-point spacing scale", () => {
    for (const [token, value] of [
      ["1", "0.25rem"],
      ["2", "0.5rem"],
      ["3", "0.75rem"],
      ["4", "1rem"],
      ["6", "1.5rem"],
      ["8", "2rem"],
      ["12", "3rem"],
      ["16", "4rem"],
      ["24", "6rem"],
    ]) {
      expect(styles).toContain(`--space-${token}: ${value};`);
    }
  });

  it("keeps Mineral Sage navigation continuous with the page canvas", () => {
    expect(styles).toMatch(/--navigation-surface:\s*var\(--sage-50\);/);
    expect(styles).toMatch(/--navigation-divider:\s*var\(--gold-500\);/);
    expect(styles).toMatch(/--navigation-border:\s*var\(--sage-100\);/);
    expect(styles).toMatch(/--content-surface:\s*var\(--sage-50\);/);
    expect(styles).toMatch(/--content-surface-elevated:\s*#e3e7da;/);
  });

  it("maps the approved Ink mode palette", () => {
    expect(styles).toMatch(
      /\.dark\s*\{[\s\S]*--navigation-surface:\s*var\(--ink-900\);/,
    );
    expect(styles).toMatch(
      /\.dark\s*\{[\s\S]*--content-surface:\s*var\(--ink-900\);/,
    );
    expect(styles).toMatch(
      /\.dark\s*\{[\s\S]*--content-surface-elevated:\s*var\(--olive-700\);/,
    );
    expect(styles).toMatch(
      /\.dark\s*\{[\s\S]*--content-secondary:\s*var\(--gold-300\);/,
    );
  });
});

describe("About canonical surfaces", () => {
  it("maps approved Bone directly and keeps Sage semantic", () => {
    expect(styles).toMatch(/--color-bone-50:\s*var\(--bone-50\)/);
    expect(styles).toMatch(/--bone-50:\s*#f5f1e8;/);
    expect(styles).toMatch(/--content-surface:\s*var\(--sage-50\);/);
  });
});
