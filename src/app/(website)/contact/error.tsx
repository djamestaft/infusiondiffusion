"use client";

import { ContactErrorTemplate } from "@/components/templates/storefront-templates";

export default function ContactError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <ContactErrorTemplate reset={reset} />;
}
