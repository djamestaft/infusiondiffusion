import { defineArrayMember, defineField, defineType } from "sanity";

const aboutRoles = ["origin", "development", "collaborator", "principles"];
const galleryGroups = ["campaign", "market"];

const portraitFields = [
  defineField({
    name: "alt",
    title: "Factual alternative text",
    type: "string",
  }),
  defineField({
    name: "sourceOwner",
    title: "Source or owner",
    type: "string",
  }),
  defineField({
    name: "storefrontRightsConfirmed",
    title: "Storefront rights confirmed",
    type: "boolean",
  }),
  defineField({
    name: "territory",
    title: "Licensed territory",
    type: "string",
  }),
  defineField({
    name: "rightsDuration",
    title: "Rights duration",
    type: "string",
    options: { list: ["Perpetual", "Expiry recorded"] },
  }),
  defineField({
    name: "expiryDate",
    title: "Rights expiry date",
    type: "date",
    description: "Required when rights duration is Expiry recorded.",
  }),
  defineField({
    name: "releaseStatus",
    title: "Release status",
    type: "string",
    options: {
      list: [
        "Not applicable",
        "Model release recorded",
        "Property release recorded",
        "Model and property releases recorded",
      ],
    },
  }),
  defineField({
    name: "licenceReference",
    title: "Licence reference",
    type: "string",
  }),
];

export const editorialPage = defineType({
  name: "editorialPage",
  title: "Editorial page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(100),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "The page address, for example fragrance-guide.",
      options: { source: "title", maxLength: 80 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      validation: (rule) => rule.max(40),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(320),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      description:
        "Optional. Use a wide editorial image; the page remains meaningful without one.",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alternative text", type: "string" }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      validation: (rule) =>
        rule.max(10).custom((sections, context) => {
          const slug = (
            context.document?.slug as { current?: string } | undefined
          )?.current;
          const authoredSections =
            (sections as
              | Array<{
                  role?: string;
                  galleryGroup?: string;
                  image?: { asset?: unknown };
                }>
              | undefined) ?? [];
          if (slug === "about") {
            const roles = authoredSections
              .map((section) => section?.role)
              .filter(Boolean);
            return (
              (roles.length === 4 &&
                aboutRoles.every((role, index) => roles[index] === role)) ||
              "About requires origin, development, collaborator and principles in that exact order."
            );
          }
          if (slug === "gallery") {
            return (
              authoredSections.every(
                (section) =>
                  galleryGroups.includes(section.galleryGroup ?? "") &&
                  section.image?.asset,
              ) ||
              "Every Gallery section needs a Campaign or In the Market group and an image."
            );
          }
          return true;
        }),
      of: [
        defineArrayMember({
          name: "editorialSection",
          title: "Section",
          type: "object",
          fields: [
            defineField({
              name: "role",
              title: "About chapter role",
              type: "string",
              description:
                "Required only for About, in this order: Origin (truthful origin portrait/working moment), Development (blotters, measured vessels or notes), Collaborator (shared process; do not imply Jacqui is pictured), Principles (fragrance in a lived-in interior). Stable identity; do not use the visible heading.",
              options: {
                list: aboutRoles.map((value) => ({
                  title: value[0].toUpperCase() + value.slice(1),
                  value,
                })),
              },
              hidden: ({ document }) =>
                (document?.slug as { current?: string } | undefined)
                  ?.current !== "about",
            }),
            defineField({
              name: "galleryGroup",
              title: "Gallery group",
              type: "string",
              description:
                "Required only for Gallery. Campaign keeps the polished product cadence; In the Market uses the documentary grid.",
              options: {
                list: [
                  { title: "Campaign", value: "campaign" },
                  { title: "In the Market", value: "market" },
                ],
                layout: "radio",
              },
              hidden: ({ document }) =>
                (document?.slug as { current?: string } | undefined)
                  ?.current !== "gallery",
            }),
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (rule) => rule.required().max(90),
            }),
            defineField({
              name: "body",
              title: "Body",
              type: "text",
              rows: 6,
              validation: (rule) => rule.required().max(1200),
            }),
            defineField({
              name: "image",
              title: "Editorial artwork",
              type: "image",
              description:
                "About uses an optional rights-cleared 3:4 portrait with centered FIT. Gallery requires rights-cleared media; Campaign uses a 3:4 crop and In the Market follows the approved documentary ratios. Use hotspot/crop to protect key content.",
              options: { hotspot: true },
              fields: portraitFields,
              validation: (rule) =>
                rule.custom((value) => {
                  const image = value as
                    | {
                        asset?: unknown;
                        alt?: string;
                        sourceOwner?: string;
                        storefrontRightsConfirmed?: boolean;
                        territory?: string;
                        rightsDuration?: string;
                        expiryDate?: string;
                        releaseStatus?: string;
                        licenceReference?: string;
                      }
                    | undefined;
                  if (!image?.asset) return true;
                  return (
                    (image.alt?.trim() &&
                      image.sourceOwner?.trim() &&
                      image.storefrontRightsConfirmed &&
                      image.territory?.trim() &&
                      image.rightsDuration?.trim() &&
                      (image.rightsDuration !== "Expiry recorded" ||
                        image.expiryDate?.trim()) &&
                      image.releaseStatus?.trim() &&
                      image.licenceReference?.trim()) ||
                    "Artwork needs factual alt text and complete rights records before it can be published."
                  );
                }),
            }),
          ],
          preview: {
            select: {
              title: "heading",
              role: "role",
              galleryGroup: "galleryGroup",
              media: "image",
            },
            prepare({ title, role, galleryGroup, media }) {
              return {
                title,
                subtitle:
                  galleryGroup === "market"
                    ? "In the Market"
                    : galleryGroup === "campaign"
                      ? "Campaign"
                      : role,
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "seoTitle",
      title: "SEO title",
      type: "string",
      validation: (rule) => rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current", media: "heroImage" },
  },
});
