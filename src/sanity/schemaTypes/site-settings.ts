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
  ],
  preview: { select: { title: "brandName", subtitle: "headline" } },
});
