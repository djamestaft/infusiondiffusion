import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { isSanityConfigured } from "@/env";
import { SanityLive } from "@/sanity/lib/live";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();

  return (
    <>
      {children}
      {isSanityConfigured ? (
        <SanityLive includeDrafts={isEnabled} waitFor="function" />
      ) : null}
      {isEnabled ? <VisualEditing /> : null}
    </>
  );
}
