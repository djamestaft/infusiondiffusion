import { TextLink } from "@/components/ui/text-link";

export function ServicePolicyLinks() {
  return (
    <div className="flex flex-wrap gap-x-6 font-sans text-sm">
      <TextLink href="/policies/shipping" variant="standalone">
        Shipping & delivery
      </TextLink>
      <TextLink href="/policies/returns" variant="standalone">
        Returns & refunds
      </TextLink>
    </div>
  );
}
