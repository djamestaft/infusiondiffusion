import { createRef } from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

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
    const eyebrowRef = createRef<HTMLParagraphElement>();
    const leadRef = createRef<HTMLParagraphElement>();
    render(
      <>
        <Eyebrow ref={eyebrowRef}>Home fragrance</Eyebrow>
        <Lead ref={leadRef}>Concrete room and format guidance.</Lead>
      </>,
    );
    expect(screen.getByText("Home fragrance").tagName).toBe("P");
    expect(screen.getByText("Concrete room and format guidance.").tagName).toBe(
      "P",
    );
    expect(eyebrowRef.current).toBe(screen.getByText("Home fragrance"));
    expect(leadRef.current).toBe(
      screen.getByText("Concrete room and format guidance."),
    );
  });
});

describe("ContentHeader", () => {
  it("rejects nested headings and arbitrary action nodes at the type boundary", () => {
    if (false) {
      <ContentHeader
        // @ts-expect-error ContentHeader owns the only heading in its contract.
        title={<Heading level={3}>Nested heading</Heading>}
        headingLevel={2}
      />;
      <ContentHeader
        title="Gift edit"
        headingLevel={2}
        // @ts-expect-error Actions must compose the approved Button or TextLink configuration.
        action={<a href="/gift-edit">Unbounded action</a>}
      />;
    }
    expect(true).toBe(true);
  });

  it("owns one heading and preserves context, heading, lead, action order", () => {
    const { container } = render(
      <ContentHeader
        context={{ type: "badge", label: "New" }}
        title="The evening ritual"
        headingLevel={2}
        lead="Fragrance that unfolds gradually."
        action={{ type: "button", label: "Shop diffusers", href: "#shop" }}
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
