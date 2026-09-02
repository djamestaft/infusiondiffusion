import { describe, expect, it } from "vitest";

import { absoluteStorefrontTitle, storefrontTitle } from "@/lib/metadata-title";

describe("storefront metadata titles", () => {
  it.each([
    ["Shop home fragrance", "Shop home fragrance | Infusion Diffusion"],
    [
      "Shop home fragrance | Infusion Diffusion",
      "Shop home fragrance | Infusion Diffusion",
    ],
    [
      "Shop home fragrance | Infusion Diffusion | Infusion Diffusion",
      "Shop home fragrance | Infusion Diffusion",
    ],
    ["Infusion Diffusion", "Infusion Diffusion"],
  ])("normalizes %s to one brand suffix", (input, expected) => {
    expect(storefrontTitle(input)).toBe(expected);
    expect(absoluteStorefrontTitle(input)).toEqual({ absolute: expected });
  });
});
