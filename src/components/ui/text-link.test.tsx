import { cleanup, render, screen } from "@testing-library/react";
import { ArrowUpRight } from "lucide-react";
import { afterEach, describe, expect, expectTypeOf, it } from "vitest";

import { TextLink } from "@/components/ui/text-link";

afterEach(cleanup);

describe("TextLink", () => {
  it("requires a destination in its public props", () => {
    expectTypeOf<React.ComponentProps<typeof TextLink>>().toMatchTypeOf<{
      href: string;
    }>();
  });

  it("renders a real link with its destination", () => {
    render(<TextLink href="/delivery">View delivery details</TextLink>);
    expect(
      screen.getByRole("link", { name: "View delivery details" }),
    ).toHaveAttribute("href", "/delivery");
  });

  it("keeps decorative standalone icons out of the accessible name", () => {
    render(
      <TextLink
        variant="standalone"
        href="/collections"
        icon={<ArrowUpRight data-testid="icon" />}
      >
        Explore the collection
      </TextLink>,
    );
    expect(
      screen.getByRole("link", { name: "Explore the collection" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("icon").parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
