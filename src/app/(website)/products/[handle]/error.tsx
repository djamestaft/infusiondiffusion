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
      <div className="mx-auto flex min-h-[320px] max-w-4xl flex-col items-center justify-center gap-8 text-center sm:flex-row sm:text-left">
        <div>
          <Heading level={1}>This fragrance is temporarily unavailable</Heading>
          <Lead className="mt-4">
            Please try again or return to the collection.
          </Lead>
        </div>
        <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
          <Button onClick={reset}>Try again</Button>
          <Button asChild variant="secondary">
            <a href="/shop">Return to shop</a>
          </Button>
        </div>
      </div>
    </main>
  );
}
