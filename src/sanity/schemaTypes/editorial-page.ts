import { defineArrayMember, defineField, defineType } from "sanity";

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
        defineField({
          name: "alt",
          title: "Alternative text",
          type: "string",
          description: "Describe the image's meaningful visual content.",
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent = context.parent as { asset?: unknown } | undefined;
              if (!parent?.asset) return true;
              return value?.trim() || "Add alternative text for this image.";
            }),
        }),
      ],
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      validation: (rule) => rule.max(10),
      of: [
        defineArrayMember({
          name: "editorialSection",
          title: "Section",
          type: "object",
          fields: [
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
          ],
          preview: { select: { title: "heading", subtitle: "body" } },
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
