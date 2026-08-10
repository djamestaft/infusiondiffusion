"use client";

import { StorefrontErrorTemplate } from "@/components/templates/storefront-templates";

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StorefrontErrorTemplate
      reset={reset}
      title="This fragrance is temporarily unavailable"
      description="Please try again or return to the collection."
    />
  );
}
