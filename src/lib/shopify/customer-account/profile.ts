import "server-only";
import type { CustomerProfile } from "./contract";
const text = (v: unknown) =>
  typeof v === "string" && v.trim() ? v.trim() : null;
export function normalizeProfile(customer: {
  firstName?: unknown;
  lastName?: unknown;
  emailAddress?: { emailAddress?: unknown } | null;
  [key: string]: unknown;
}): CustomerProfile {
  const names = [text(customer.firstName), text(customer.lastName)].filter(
    (v): v is string => !!v,
  );
  const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
  return {
    name: names.join(" ") || null,
    email: text(customer.emailAddress?.emailAddress),
    initials:
      names
        .map(
          (n) =>
            [...segmenter.segment(n.toLocaleUpperCase("en"))][0]?.segment ?? "",
        )
        .join("") || null,
  };
}

import { z } from "zod";
export const customerResponseSchema = z.object({
  errors: z.array(z.unknown()).optional(),
  data: z.object({
    customer: z.object({
      id: z.string().regex(/^gid:\/\/shopify\/Customer\/\d+$/),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      emailAddress: z.object({ emailAddress: z.string() }).nullable(),
    }),
  }),
});
