import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";

import { AnnouncementProvider } from "@/components/announcement-provider";
import { getSiteSettings } from "@/sanity/lib/settings";
import { getDynamicFetchOptions } from "@/sanity/lib/live";
import { AccountNavigationProvider } from "@/components/account/account-navigation";

import { isSanityConfigured } from "@/env";
import { SanityLive } from "@/sanity/lib/live";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled } = await draftMode();
  const settings = await getSiteSettings(await getDynamicFetchOptions());

  return (
    <>
      <AccountNavigationProvider
        enabled={process.env.SHOPIFY_ACCOUNT_HANDOFF_ENABLED === "true"}
        sessionEnabled={process.env.SHOPIFY_CUSTOMER_SESSION_ENABLED === "true"}
      >
        <AnnouncementProvider announcement={settings.announcement ?? null}>
          {children}
        </AnnouncementProvider>
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
