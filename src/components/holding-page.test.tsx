import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { HoldingPage } from "@/components/holding-page";
import { fallbackSiteSettings } from "@/sanity/types";

afterEach(cleanup);

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

  it("renders an enabled announcement above the holding page", () => {
    render(
      <HoldingPage
        settings={{
          ...fallbackSiteSettings,
          announcement: {
            enabled: true,
            message: "The first collection is taking shape.",
          },
        }}
      />,
    );

    expect(screen.getByLabelText("Announcement")).toHaveTextContent(
      "The first collection is taking shape.",
    );
  });

  it("does not render announcement space for an enabled blank message", () => {
    const { container } = render(
      <HoldingPage
        settings={{
          ...fallbackSiteSettings,
          announcement: { enabled: true, message: "   " },
        }}
      />,
    );

    expect(container.querySelector('[aria-label="Announcement"]')).toBeNull();
    expect(container.querySelector("nav")).not.toHaveClass("mt-4");
  });
});
