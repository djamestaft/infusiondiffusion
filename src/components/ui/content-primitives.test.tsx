import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Badge } from "@/components/ui/badge";
import {
  ContentHeader,
  Eyebrow,
  Heading,
  Lead,
} from "@/components/ui/content-primitives";

afterEach(cleanup);

describe("content primitives", () => {
  it.each([1, 2, 3, 4, 5, 6] as const)(
    "renders an explicit h%s level",
    (level) => {
      render(<Heading level={level}>Fragrance notes</Heading>);
      expect(
        screen.getByRole("heading", { level, name: "Fragrance notes" }),
      ).toBeVisible();
    },
  );

  it("uses paragraph semantics for eyebrow and lead", () => {
    render(
      <>
        <Eyebrow>Home fragrance</Eyebrow>
        <Lead>Concrete room and format guidance.</Lead>
      </>,
    );
    expect(screen.getByText("Home fragrance").tagName).toBe("P");
    expect(screen.getByText("Concrete room and format guidance.").tagName).toBe(
      "P",
    );
  });
});

describe("ContentHeader", () => {
  it("owns one heading and preserves context, heading, lead, action order", () => {
    const { container } = render(
      <ContentHeader
        badge={<Badge>New</Badge>}
        title="The evening ritual"
        headingLevel={2}
        lead="Fragrance that unfolds gradually."
        action={<a href="#shop">Shop diffusers</a>}
      />,
    );

    expect(screen.getAllByRole("heading")).toHaveLength(1);
    expect(
      [...container.querySelectorAll("[data-slot]")]
        .filter((node) =>
          [
            "content-header-context",
            "heading",
            "lead",
            "content-header-action",
          ].includes(node.getAttribute("data-slot") ?? ""),
        )
        .map((node) => node.getAttribute("data-slot")),
    ).toEqual([
      "content-header-context",
      "heading",
      "lead",
      "content-header-action",
    ]);
  });

  it("omits optional regions without empty wrappers", () => {
    const { container } = render(
      <ContentHeader title="Fragrance notes" headingLevel={3} />,
    );
    expect(
      container.querySelector('[data-slot="content-header-context"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="content-header-action"]'),
    ).not.toBeInTheDocument();
    expect(
      container.querySelector('[data-slot="lead"]'),
    ).not.toBeInTheDocument();
  });

  it("exposes centered alignment and consumer classes", () => {
    render(
      <ContentHeader
        className="fixture-class"
        align="center"
        title="Gift edit"
        headingLevel={2}
        data-testid="header"
      />,
    );
    expect(screen.getByTestId("header")).toHaveAttribute(
      "data-align",
      "center",
    );
    expect(screen.getByTestId("header")).toHaveClass("fixture-class");
  });
});
