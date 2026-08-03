import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AnnouncementBar } from "@/components/announcement-bar";

describe("AnnouncementBar", () => {
  it("renders a message and valid optional link", () => {
    render(
      <AnnouncementBar
        message="The first collection is taking shape."
        link={{ label: "Explore", href: "/collections" }}
      />,
    );

    expect(screen.getByLabelText("Announcement")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute(
      "href",
      "/collections",
    );
  });

  it("renders nothing for a blank message", () => {
    const { container } = render(<AnnouncementBar message="   " />);
    expect(container).toBeEmptyDOMElement();
  });

  it("omits incomplete and unsafe links", () => {
    const { container, rerender } = render(
      <AnnouncementBar
        message="Notice"
        link={{ label: "Open", href: "javascript:alert(1)" }}
      />,
    );
    expect(container.querySelector("a")).not.toBeInTheDocument();

    rerender(
      <AnnouncementBar
        message="Notice"
        link={{ label: "Open", href: "/\\evil.example/path" }}
      />,
    );
    expect(container.querySelector("a")).not.toBeInTheDocument();

    rerender(
      <AnnouncementBar
        message="Notice"
        link={{ label: "Open", href: "//example.com" }}
      />,
    );
    expect(container.querySelector("a")).not.toBeInTheDocument();

    rerender(
      <AnnouncementBar
        message="Notice"
        link={{ label: "", href: "https://example.com" }}
      />,
    );
    expect(container.querySelector("a")).not.toBeInTheDocument();
  });
});
