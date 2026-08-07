import { Suspense } from "react";
import { notFound } from "next/navigation";

import {
  AccountEntry,
  type AccountEntryState,
} from "@/components/account/account-entry";

const fixtureStates = new Set([
  "disabled",
  "configuration-missing",
  "not-provisioned",
  "loading",
  "error",
  "long-content",
]);

async function E2eAccountStateContent({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  if (!fixtureStates.has(state)) notFound();

  return (
    <AccountEntry
      state={
        state === "long-content" ? "available" : (state as AccountEntryState)
      }
      destination="https://accounts.example.test/account"
      longContent={state === "long-content"}
    />
  );
}

export default function E2eAccountStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  if (process.env.SHOPIFY_E2E_FIXTURES !== "1") notFound();

  return (
    <Suspense fallback={<AccountEntry state="loading" />}>
      <E2eAccountStateContent params={params} />
    </Suspense>
  );
}
