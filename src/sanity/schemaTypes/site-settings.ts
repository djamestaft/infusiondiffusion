import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site settings",
  type: "document",
  fields: [
    defineField({ name: "brandName", title: "Brand name", type: "string" }),
    defineField({ name: "eyebrow", title: "Eyebrow", type: "string" }),
    defineField({
      name: "announcementEnabled",
      title: "Show announcement bar",
      type: "boolean",
      initialValue: false,
      description:
        "Shows one global notice above the site navigation. Disable this to remove it immediately.",
    }),
    defineField({
      name: "announcementMessage",
      title: "Announcement message",
      type: "string",
      hidden: ({ document }) => !document?.announcementEnabled,
      validation: (rule) =>
        rule.custom((value, context) => {
          if (!context.document?.announcementEnabled) return true;
          if (!value?.trim()) return "Add a message before enabling the bar.";
          return value.length <= 100 || "Keep the message to 100 characters.";
        }),
    }),
    defineField({
      name: "announcementLinkLabel",
      title: "Announcement link label",
      type: "string",
      description:
        "Optional. Leave both link fields empty for a message-only bar.",
      hidden: ({ document }) => !document?.announcementEnabled,
      validation: (rule) => rule.max(30),
    }),
    defineField({
      name: "announcementLinkUrl",
      title: "Announcement link destination",
      type: "string",
      description:
        "Optional. Use a root-relative path, HTTP(S) URL, email, or telephone link.",
      hidden: ({ document }) => !document?.announcementEnabled,
      validation: (rule) =>
        rule.custom((value, context) => {
          const label = context.document?.announcementLinkLabel;
          if (!value && !label) return true;
          if (!value || !label) return "Add both a link label and destination.";
          return (/^\/(?!\/)/.test(value) && !value.includes("\\")) ||
            /^(https?:\/\/|mailto:|tel:)/.test(value)
            ? true
            : "Use /, http://, https://, mailto:, or tel: at the start.";
        }),
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: "introduction",
      title: "Introduction",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: "contactEmail",
      title: "Contact email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "callToActionLabel",
      title: "Call to action label",
      type: "string",
      validation: (rule) => rule.required().max(30),
    }),
    defineField({ name: "seoTitle", title: "SEO title", type: "string" }),
    defineField({
      name: "seoDescription",
      title: "SEO description",
      type: "text",
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: "homepage",
      title: "Homepage",
      type: "object",
      description:
        "Editorial copy for the public homepage. Shopify continues to own products, prices, and availability.",
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({
          name: "heroTitle",
          title: "Hero title",
          type: "string",
          validation: (rule) => rule.max(90),
        }),
        defineField({
          name: "heroIntroduction",
          title: "Hero introduction",
          type: "text",
          rows: 3,
          validation: (rule) => rule.max(240),
        }),
        defineField({
          name: "heroActionLabel",
          title: "Hero action label",
          type: "string",
          validation: (rule) => rule.max(30),
        }),
        defineField({
          name: "collectionTitle",
          title: "Featured collection title",
          type: "string",
          validation: (rule) => rule.max(70),
        }),
        defineField({
          name: "guidanceEyebrow",
          title: "Guidance eyebrow",
          type: "string",
          validation: (rule) => rule.max(30),
        }),
        defineField({
          name: "guidanceTitle",
          title: "Guidance title",
          type: "string",
          validation: (rule) => rule.max(90),
        }),
        defineField({
          name: "guidanceIntroduction",
          title: "Guidance introduction",
          type: "text",
          rows: 3,
          validation: (rule) => rule.max(240),
        }),
        defineField({
          name: "guidanceActionLabel",
          title: "Guidance action label",
          type: "string",
          validation: (rule) => rule.max(40),
        }),
        defineField({
          name: "guidanceSupportingText",
          title: "Guidance supporting text",
          type: "text",
          rows: 3,
          validation: (rule) => rule.max(220),
        }),
        defineField({
          name: "showServiceReassurance",
          title: "Show service reassurance",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "serviceTitle",
          title: "Service reassurance title",
          type: "string",
          hidden: ({ parent }) => parent?.showServiceReassurance === false,
          validation: (rule) => rule.max(70),
        }),
        defineField({
          name: "serviceIntroduction",
          title: "Service reassurance introduction",
          type: "text",
          rows: 3,
          hidden: ({ parent }) => parent?.showServiceReassurance === false,
          validation: (rule) => rule.max(240),
        }),
        defineField({
          name: "showFounderStory",
          title: "Show founder story",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "founderTitle",
          title: "Founder story title",
          type: "string",
          hidden: ({ parent }) => parent?.showFounderStory === false,
          validation: (rule) => rule.max(70),
        }),
        defineField({
          name: "founderStory",
          title: "Founder story",
          type: "text",
          rows: 8,
          description:
            "Separate paragraphs with a blank line. Keep the full story for the future About page and use a concise edit here.",
          hidden: ({ parent }) => parent?.showFounderStory === false,
          validation: (rule) => rule.max(900),
        }),
        defineField({
          name: "founderImage",
          title: "Founder story image",
          type: "image",
          description:
            "Optional. The storefront uses the featured Shopify image until an editorial image is supplied.",
          options: { hotspot: true },
          hidden: ({ parent }) => parent?.showFounderStory === false,
          fields: [
            defineField({
              name: "alt",
              title: "Alternative text",
              type: "string",
              validation: (rule) =>
                rule.custom((value, context) => {
                  const parent = context.parent as { asset?: unknown };
                  return !parent?.asset || value?.trim()
                    ? true
                    : "Describe the image for people who cannot see it.";
                }),
            }),
          ],
        }),
        defineField({
          name: "showLongevity",
          title: "Show longevity guidance",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "longevityTitle",
          title: "Longevity title",
          type: "string",
          hidden: ({ parent }) => parent?.showLongevity === false,
          validation: (rule) => rule.max(70),
        }),
        defineField({
          name: "longevityIntroduction",
          title: "Longevity introduction",
          type: "text",
          rows: 3,
          description:
            "Keep duration qualified as an estimate under normal use.",
          hidden: ({ parent }) => parent?.showLongevity === false,
          validation: (rule) => rule.max(240),
        }),
        defineField({
          name: "longevityConditions",
          title: "Longevity conditions",
          type: "text",
          rows: 4,
          description:
            "Explain environmental and care factors that affect diffusion.",
          hidden: ({ parent }) => parent?.showLongevity === false,
          validation: (rule) => rule.max(360),
        }),
        defineField({
          name: "showCollectionInvitation",
          title: "Show closing collection invitation",
          type: "boolean",
          initialValue: true,
        }),
        defineField({
          name: "collectionInvitationTitle",
          title: "Collection invitation title",
          type: "string",
          hidden: ({ parent }) => parent?.showCollectionInvitation === false,
          validation: (rule) => rule.max(90),
        }),
        defineField({
          name: "collectionInvitationIntroduction",
          title: "Collection invitation introduction",
          type: "text",
          rows: 3,
          hidden: ({ parent }) => parent?.showCollectionInvitation === false,
          validation: (rule) => rule.max(260),
        }),
        defineField({
          name: "collectionInvitationActionLabel",
          title: "Collection invitation action label",
          type: "string",
          hidden: ({ parent }) => parent?.showCollectionInvitation === false,
          validation: (rule) => rule.max(30),
        }),
      ],
    }),
  ],
  preview: { select: { title: "brandName", subtitle: "headline" } },
});
