"use client";

import { createContext, useContext } from "react";
import type { SiteSettings } from "@/sanity/types";

export type StorefrontAnnouncement = SiteSettings["announcement"];
const AnnouncementContext = createContext<StorefrontAnnouncement | null>(null);

export function AnnouncementProvider({
  announcement,
  children,
}: {
  announcement: StorefrontAnnouncement | null;
  children: React.ReactNode;
}) {
  return (
    <AnnouncementContext.Provider value={announcement}>
      {children}
    </AnnouncementContext.Provider>
  );
}

export function useAnnouncement() {
  return useContext(AnnouncementContext);
}
