import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

import { AccountEntry } from "@/components/account/account-entry";
import { readCart } from "@/lib/shopify/cart-session";
import { getAccountEntry } from "@/lib/shopify/account-entry";

export const metadata: Metadata = {
  title: "Your account | Infusion Diffusion",
  description: "Continue to your hosted Shopify customer account.",
  robots: { index: false, follow: false },
};

export async function getAccountPageData() {
  await connection();
  const [entry, cart] = await Promise.all([getAccountEntry(), readCart()]);
  return { entry, cartCount: cart.totalQuantity };
}

export async function AccountContent() {
  const { entry, cartCount } = await getAccountPageData();
  return (
    <AccountEntry
      state={entry.status}
      destination={entry.status === "available" ? entry.destination : undefined}
      cartCount={cartCount}
    />
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountEntry state="loading" />}>
      <AccountContent />
    </Suspense>
  );
}
