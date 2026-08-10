"use client";

import { StorefrontErrorTemplate } from "@/components/templates/storefront-templates";

export default function WebsiteError({ reset }: { reset: () => void }) {
  return <StorefrontErrorTemplate reset={reset} />;
}
