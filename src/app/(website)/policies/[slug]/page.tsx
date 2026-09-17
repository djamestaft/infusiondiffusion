import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  PolicyTemplate,
  PolicyLoadingTemplate,
} from "@/components/templates/policy-template";
import { findPolicy } from "@/lib/policy-links";
import { getPolicy } from "@/lib/shopify/policies";
import { readCart } from "@/lib/shopify/cart-session";
import { cartNavigationCount } from "@/lib/shopify/cart-contract";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const policy = findPolicy(slug);
  if (!policy) return {};
  return {
    title: { absolute: `${policy.label} | INFUSION DIFFUSION` },
    description: `${policy.label} for shopping with INFUSION DIFFUSION in South Africa.`,
  };
}
async function PolicyContent({ params }: Props) {
  const { slug } = await params;
  if (!findPolicy(slug)) notFound();
  const [policy, cart] = await Promise.all([getPolicy(slug), readCart()]);
  if (!policy) notFound();
  return <PolicyTemplate {...policy} cartCount={cartNavigationCount(cart)} />;
}
// Keep a single loading boundary. A second route loading.tsx boundary caused
// PPR segment collisions on production hard loads (covered by policy E2E tests).
export default function PolicyPage(props: Props) {
  return (
    <Suspense fallback={<PolicyLoadingTemplate />}>
      <PolicyContent {...props} />
    </Suspense>
  );
}
