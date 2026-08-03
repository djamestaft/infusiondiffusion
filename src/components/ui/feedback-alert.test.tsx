import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeedbackAlert } from "@/components/ui/feedback-alert";

describe("FeedbackAlert", () => {
  it("is ordinary content by default", () => {
    render(
      <FeedbackAlert title="Information">Delivery details.</FeedbackAlert>,
    );
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByText("Information")).toBeVisible();
  });
  it.each(["status", "alert"] as const)(
    "supports an opt-in %s announcement",
    (announcement) => {
      render(
        <FeedbackAlert announcement={announcement}>Updated.</FeedbackAlert>,
      );
      expect(screen.getByRole(announcement)).toHaveTextContent("Updated.");
    },
  );
  it.each(["info", "success", "warning", "error"] as const)(
    "renders written %s feedback with a decorative vector icon",
    (tone) => {
      const { container } = render(
        <FeedbackAlert tone={tone} title={`${tone} message`}>
          Recovery guidance.
        </FeedbackAlert>,
      );
      expect(screen.getByText(`${tone} message`)).toBeVisible();
      expect(container.querySelector("svg")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    },
  );
});
