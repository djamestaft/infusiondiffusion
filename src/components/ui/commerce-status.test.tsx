import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CommerceStatus } from "@/components/ui/commerce-status";

afterEach(cleanup);

describe("CommerceStatus", () => {
  it.each([
    ["in-stock", "In stock"],
    ["sold-out", "Sold out"],
    ["pre-order", "Pre-order"],
  ] as const)("renders the %s status as text", (status, label) => {
    render(<CommerceStatus status={status} />);
    expect(screen.getByText(label)).toBeVisible();
  });

  it("renders a truthful low-stock count when supplied", () => {
    render(<CommerceStatus status="low-stock" lowStockCount={3} />);
    expect(screen.getByText("Only 3 left")).toBeVisible();
  });

  it("falls back to generic low-stock wording without a usable count", () => {
    render(<CommerceStatus status="low-stock" lowStockCount={0} />);
    expect(screen.getByText("Low stock")).toBeVisible();
  });

  it("keeps the inline marker decorative", () => {
    const { container } = render(<CommerceStatus status="in-stock" />);
    expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
    expect(screen.getByText("In stock")).toBeVisible();
  });
});
