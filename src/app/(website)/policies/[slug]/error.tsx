"use client";
import { PolicyErrorTemplate } from "@/components/templates/policy-template";
export default function PolicyError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <PolicyErrorTemplate reset={reset} />;
}
