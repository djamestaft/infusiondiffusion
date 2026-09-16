"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { AccountEntry } from "./account-entry";
import { useCustomerAccount } from "./account-navigation";
export function AccountSession({
  destination,
  cartCount,
}: {
  destination?: string;
  cartCount: number | null;
}) {
  const { state, refresh, signOut } = useCustomerAccount();
  const [signingOut, setSigningOut] = useState(false);
  const params = useSearchParams();
  const [dismissed, setDismissed] = useState(false);
  const notice = dismissed ? undefined : (params.get("notice") ?? undefined);
  return (
    <AccountEntry
      state="available"
      customerState={state}
      destination={destination}
      cartCount={cartCount}
      notice={notice}
      signingOut={signingOut}
      onRetry={() => {
        setDismissed(true);
        refresh();
      }}
      onSignOut={() => {
        setSigningOut(true);
        signOut();
      }}
    />
  );
}
