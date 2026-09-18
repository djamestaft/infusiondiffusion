import { defineField } from "sanity";

export function editorialImageField(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    description:
      "Desktop artwork. Keep the complete product and a quiet area behind live text. Preview phone and desktop before publishing.",
    fields: [
      defineField({
        name: "alt",
        title: "Alternative text",
        type: "string",
        validation: (rule) =>
          rule.custom((value, context) =>
            (context.parent as { asset?: unknown })?.asset && !value?.trim()
              ? "Describe the photograph."
              : true,
          ),
      }),
      defineField({
        name: "mobileImage",
        title: "Phone artwork",
        type: "image",
        description:
          "Optional separate composition below 640px (1024px for the Guide). If omitted, the desktop image is used.",
      }),
    ],
  });
}
