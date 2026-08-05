import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const styles = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("storefront surface tokens", () => {
  it("keeps Ivory navigation warmer than the page canvas", () => {
    expect(styles).toMatch(/--navigation-surface:\s*#f5f1e8;/);
    expect(styles).toMatch(/--navigation-divider:\s*#c5a447;/);
    expect(styles).toMatch(/--content-surface:\s*#fcfaf5;/);
  });
});
