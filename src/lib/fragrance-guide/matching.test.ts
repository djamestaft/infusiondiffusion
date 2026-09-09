import { describe, expect, it } from "vitest";
import { matchFragrances, noteChoices, type GuideProduct } from "./matching";

const ids = {
  ambre: "10067255558430",
  blanc: "10067255394590",
  bois: "10067989987614",
  ete: "10068135641374",
  noir: "10067255460126",
  santuaire: "10067255492894",
};
const products: GuideProduct[] = Object.entries(ids).map(([name, id]) => ({
  id: `gid://shopify/Product/${id}`,
  title: name,
  handle: `current-${name}`,
  availableForSale: true,
}));
const names = (notes: string[]) =>
  matchFragrances(notes, products).map((p) => [p.title, p.score]);
describe("approved notes/character matching", () => {
  it("matches the owner-reviewed golden examples", () => {
    expect(names(["amber"])).toEqual([
      ["ambre", 2],
      ["blanc", 1],
      ["noir", 1],
    ]);
    expect(names(["woods"])).toEqual([
      ["blanc", 2],
      ["noir", 2],
      ["bois", 2],
    ]);
    expect(names(["spa"])).toEqual([["santuaire", 2]]);
    expect(names(["floral", "musk"])).toEqual([
      ["ete", 4],
      ["blanc", 2],
      ["ambre", 2],
    ]);
  });
  const selections = noteChoices.flatMap((choice, i) => [
    [choice.id],
    ...noteChoices.slice(i + 1).map((other) => [choice.id, other.id]),
  ]);
  it.each(selections.map((s) => [s.join(" + "), s]))(
    "is deterministic and order independent: %s",
    (_, selected) => {
      const notes = selected as string[];
      const result = matchFragrances(notes, products);
      expect(result).toEqual(
        matchFragrances([...notes].reverse(), [...products].reverse()),
      );
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThanOrEqual(3);
      expect(new Set(result.map((p) => p.id)).size).toBe(result.length);
      for (const match of result) {
        expect(match.score).toBeGreaterThan(0);
        expect(match.reasons.length).toBeGreaterThan(0);
        expect(match.reasons.length).toBeLessThanOrEqual(notes.length);
      }
    },
  );
  it.each([[], ["unknown"], ["amber", "amber"], ["amber", "woods", "spa"]])(
    "rejects invalid selection %j",
    (...notes) => {
      expect(matchFragrances(notes, products)).toEqual([]);
    },
  );
  it("omits missing products, preserves current identity/availability and never invents filler", () => {
    const subset = products
      .filter((p) => p.title === "santuaire")
      .map((p) => ({ ...p, availableForSale: false }));
    const [match] = matchFragrances(["spa"], subset);
    expect(match).toMatchObject({
      handle: "current-santuaire",
      availableForSale: false,
    });
    expect(match.reasons.join(" ")).toContain("spa-inspired character");
    expect(matchFragrances(["amber"], subset)).toEqual([]);
    expect(matchFragrances(["spa"], [])).toEqual([]);
  });
  it("explains only selected associations and identifies ties beyond the display limit", () => {
    const matches = matchFragrances(["amber"], products);
    expect(matches.map((p) => p.tied)).toEqual([false, true, true]);
    expect(matches[0].reasons).toEqual([
      "Your amber & vanilla preference: amber, vanilla and tonka.",
    ]);
    expect(matches[0].reasons.join(" ")).not.toContain("mandarin");
  });
});
