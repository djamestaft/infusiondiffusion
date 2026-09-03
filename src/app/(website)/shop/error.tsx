"use client";

import { Button } from "@/components/ui/button";
import { Heading, Lead } from "@/components/ui/content-primitives";

export default function ShopError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="bg-content-surface min-h-dvh px-5 py-20">
      <div className="mx-auto flex min-h-[320px] max-w-4xl flex-col items-center justify-center gap-8 text-center sm:flex-row sm:text-left">
        <div>
          <Heading level={1}>The collection is temporarily unavailable</Heading>
          <Lead className="mt-4">
            Please try again. No order or account information has been affected.
          </Lead>
        </div>
        <Button className="min-w-59" onClick={reset}>
          Try again
        </Button>
      </div>
    </main>
  );
}
