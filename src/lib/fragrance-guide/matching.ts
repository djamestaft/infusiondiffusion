// Devon-approved editorial snapshot, 9 September 2026. No commerce state.
// Source/approval: docs/features/inf-35-fragrance-matching.md.
// Sanity publication remains separate; this version can be replaced by an
// approved editorial source without changing the scoring or product boundary.
export const guideMappingVersion = "2026-09-09-notes-v1";
export const noteChoices = [
  { id: "fresh", label: "Citrus & fresh" },
  { id: "floral", label: "Soft florals" },
  { id: "amber", label: "Amber & vanilla" },
  { id: "woods", label: "Spice & woods" },
  { id: "musk", label: "Incense & musk" },
  { id: "spa", label: "Spa-like calm" },
] as const;
export type NoteId = (typeof noteChoices)[number]["id"];
type Association = { weight: 1 | 2; reason: string };
type Profile = { id: string; notes: Partial<Record<NoteId, Association>> };
const association = (weight: 1 | 2, reason: string): Association => ({
  weight,
  reason,
});
export const fragranceProfiles: readonly Profile[] = [
  {
    id: "gid://shopify/Product/10067255558430",
    notes: {
      amber: association(2, "Amber, vanilla and tonka"),
      fresh: association(1, "Mandarin"),
      floral: association(1, "Muguet and jasmine"),
      woods: association(1, "Sandalwood"),
      musk: association(1, "Musk"),
    },
  },
  {
    id: "gid://shopify/Product/10067255394590",
    notes: {
      woods: association(2, "Pink and black pepper with sandalwood"),
      fresh: association(1, "Bergamot and aromatic herbs"),
      floral: association(1, "Orris, mimosa and freesia"),
      amber: association(1, "Amber, vanilla and tonka"),
      musk: association(1, "White musk"),
    },
  },
  {
    id: "gid://shopify/Product/10067989987614",
    notes: {
      woods: association(2, "Cardamom and sandalwood"),
      floral: association(1, "Rose and jasmine"),
      amber: association(1, "Amber and vanilla"),
    },
  },
  {
    id: "gid://shopify/Product/10068135641374",
    notes: {
      floral: association(2, "Jasmine, tuberose and iris"),
      musk: association(2, "Incense and musk"),
      fresh: association(1, "Bergamot and neroli"),
      amber: association(1, "Amber"),
      woods: association(1, "Cinnamon, cedarwood and patchouli"),
    },
  },
  {
    id: "gid://shopify/Product/10067255460126",
    notes: {
      fresh: association(2, "Orange zest, bergamot and eucalyptus"),
      woods: association(2, "Saffron, clove, sandalwood, cedar and patchouli"),
      floral: association(1, "Neroli"),
      amber: association(1, "Amber"),
    },
  },
  {
    id: "gid://shopify/Product/10067255492894",
    notes: {
      spa: association(2, "Its spa-inspired character"),
    },
  },
];

export type GuideProduct = {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
};
export type GuideMatch = GuideProduct & {
  score: number;
  reasons: string[];
  tied: boolean;
};

export function matchFragrances(
  selected: readonly string[],
  products: readonly GuideProduct[],
): GuideMatch[] {
  if (
    selected.length < 1 ||
    selected.length > 2 ||
    new Set(selected).size !== selected.length ||
    selected.some((id) => !noteChoices.some((note) => note.id === id))
  )
    return [];
  const matches = fragranceProfiles
    .flatMap((profile) => {
      const product = products.find((candidate) => candidate.id === profile.id);
      if (!product) return [];
      // Canonical choice order makes selection order irrelevant, including reasons.
      const contributions = noteChoices.flatMap((note) => {
        const entry = profile.notes[note.id];
        return selected.includes(note.id) && entry
          ? [{ ...entry, label: note.label }]
          : [];
      });
      const score = contributions.reduce((sum, entry) => sum + entry.weight, 0);
      return score
        ? [
            {
              ...product,
              score,
              reasons: contributions.map(
                (entry) =>
                  `Your ${entry.label.toLowerCase()} preference: ${entry.reason.charAt(0).toLowerCase()}${entry.reason.slice(1)}.`,
              ),
              tied: false,
            },
          ]
        : [];
    })
    .sort(
      (a, b) =>
        b.score - a.score ||
        (BigInt(a.id.split("/").at(-1)!) < BigInt(b.id.split("/").at(-1)!)
          ? -1
          : 1),
    );
  return matches.slice(0, 3).map((match) => ({
    ...match,
    tied: matches.some(
      (other) => other.id !== match.id && other.score === match.score,
    ),
  }));
}
