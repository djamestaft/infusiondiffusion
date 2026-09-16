"use client";

import { createContext, useContext, type ReactNode } from "react";

const AccountNavigationContext = createContext<string | null>(null);

/** Shares only the local account entry link, never customer or session data. */
export function AccountNavigationProvider({
  enabled,
  children,
}: {
  enabled: boolean;
  children: ReactNode;
}) {
  return (
    <AccountNavigationContext.Provider value={enabled ? "/account" : null}>
      {children}
    </AccountNavigationContext.Provider>
  );
}

export function useAccountNavigationHref() {
  return useContext(AccountNavigationContext);
}
