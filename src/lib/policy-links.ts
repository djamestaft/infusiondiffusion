export const policyLinks = [
  {
    slug: "terms-and-conditions",
    label: "Terms & Conditions",
    field: "termsOfService",
  },
  { slug: "shipping", label: "Shipping & Delivery", field: "shippingPolicy" },
  { slug: "returns", label: "Returns & Refunds", field: "refundPolicy" },
  { slug: "privacy", label: "Privacy & Cookies", field: "privacyPolicy" },
] as const;

export function findPolicy(slug: string) {
  return policyLinks.find((policy) => policy.slug === slug);
}
