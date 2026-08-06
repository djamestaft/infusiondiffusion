import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const styles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("storefront surface tokens", () => {
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
