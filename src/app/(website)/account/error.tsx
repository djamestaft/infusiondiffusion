"use client";
import { AccountEntry } from "@/components/account/account-entry";
export default function AccountError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <AccountEntry state="error" onRetry={reset} />;
}
