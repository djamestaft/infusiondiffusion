import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HoldingPage } from "@/components/holding-page";
import { fallbackSiteSettings } from "@/sanity/types";

describe("HoldingPage", () => {
  it("renders the CMS content and contact action", () => {
    render(<HoldingPage settings={fallbackSiteSettings} />);

    expect(
      screen.getByRole("heading", { name: fallbackSiteSettings.headline }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /say hello/i })).toHaveAttribute(
      "href",
      `mailto:${fallbackSiteSettings.contactEmail}`,
    );
  });
});
