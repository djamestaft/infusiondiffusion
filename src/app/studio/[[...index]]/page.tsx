"use client";

import { NextStudio } from "next-sanity/studio";

import { isSanityConfigured } from "@/env";
import config from "@/sanity/config";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <main className="grid min-h-screen place-items-center p-8">
        <div className="border-border bg-card max-w-lg border p-8">
          <h1 className="font-display text-4xl">Connect Sanity Studio</h1>
          <p className="text-muted-foreground mt-4 leading-7">
            Set the public Sanity project and dataset variables, then restart
            the application. The storefront already works with safe fallback
            content.
          </p>
        </div>
      </main>
    );
  }

  return <NextStudio config={config} />;
}
