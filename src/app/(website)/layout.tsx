import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { AccountNavigationProvider } from "@/components/account/account-navigation";

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
      <AccountNavigationProvider
        enabled={process.env.SHOPIFY_ACCOUNT_HANDOFF_ENABLED === "true"}
      >
        {children}
      </AccountNavigationProvider>
      {isSanityConfigured ? (
        <SanityLive
          includeDrafts={isEnabled}
          waitFor={
            process.env.VERCEL_ENV === "production" ? "function" : undefined
          }
        />
      ) : null}
      {isEnabled ? <VisualEditing /> : null}
    </>
  );
}
