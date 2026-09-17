import sanitizeHtml from "sanitize-html";

/** Treat merchant-authored HTML as untrusted input. No scripts, embeds or styling. */
export function sanitizePolicyHtml(body: string): string {
  return sanitizeHtml(body, {
    allowedTags: [
      "p",
      "h2",
      "h3",
      "ul",
      "ol",
      "li",
      "a",
      "strong",
      "em",
      "br",
      "blockquote",
    ],
    allowedAttributes: { a: ["href", "title"] },
    allowedSchemes: ["https", "http", "mailto", "tel"],
    allowProtocolRelative: false,
    transformTags: { h1: "h2", b: "strong", i: "em" },
  }).trim();
}
