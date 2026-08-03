import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Badge } from "@/components/ui/badge";

afterEach(cleanup);

describe("Badge", () => {
  it("rejects interactive and status semantics at the type boundary", () => {
    if (false) {
      // @ts-expect-error Badge is static metadata, not a status region.
      <Badge role="status">New</Badge>;
      // @ts-expect-error Badge cannot enter the keyboard tab order.
      <Badge tabIndex={0}>New</Badge>;
      <Badge>
        {/* @ts-expect-error Badge content is text, not an interactive subtree. */}
        <a href="/collection">New</a>
      </Badge>;
    }
    expect(true).toBe(true);
  });

  it("renders static metadata without status or control semantics", () => {
    render(<Badge>New</Badge>);

    const badge = screen.getByText("New");
    expect(badge.tagName).toBe("SPAN");
    expect(badge).not.toHaveAttribute("role");
    expect(badge).not.toHaveAttribute("tabindex");
  });

  it.each(["neutral", "accent"] as const)(
    "exposes the %s visual role",
    (variant) => {
      render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toHaveAttribute(
        "data-variant",
        variant,
      );
    },
  );

  it("merges consumer classes and native span attributes", () => {
    render(
      <Badge className="fixture-class" aria-label="Editorial label">
        Gift edit
      </Badge>,
    );
    expect(screen.getByLabelText("Editorial label")).toHaveClass(
      "fixture-class",
    );
  });

  it("forwards a ref without exposing interactive or status props", () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>New</Badge>);
    expect(ref.current).toBe(screen.getByText("New"));
  });
});
