"use client";

import { Button } from "@/components/ui/button";
import { Heading, Lead } from "@/components/ui/content-primitives";

export default function ProductError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-content-surface min-h-dvh px-5 py-20">
      <div className="mx-auto max-w-2xl">
        <Heading level={1}>This fragrance is temporarily unavailable</Heading>
        <Lead className="mt-4">
          Please try again or return to the collection.
        </Lead>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="secondary">
            <a href="/shop">Return to shop</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
