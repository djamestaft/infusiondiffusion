import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StorefrontFooter } from "@/components/storefront-footer";

describe("StorefrontFooter", () => {
  it("completes discovery, support, and commerce navigation", () => {
    render(<StorefrontFooter />);
    expect(screen.getByRole("contentinfo")).toBeVisible();
    expect(screen.getByRole("link", { name: "Shop" })).toHaveAttribute(
      "href",
      "/shop",
    );
    expect(screen.getByRole("link", { name: /support/i })).toHaveAttribute(
      "href",
      "mailto:hello@infusiondiffusion.co.za",
    );
  });
});
