"use client";

import { StorefrontErrorTemplate } from "@/components/templates/storefront-templates";

export default function ShopError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <StorefrontErrorTemplate
      reset={reset}
      currentHref="/shop"
      title="The collection is temporarily unavailable"
      description="Please try again. No order or account information has been affected."
    />
  );
}
