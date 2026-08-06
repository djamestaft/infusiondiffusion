import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Button } from "@/components/ui/button";

afterEach(cleanup);

describe("Button", () => {
  it("uses button semantics and does not submit forms by default", () => {
    render(<Button>Shop fragrance</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("supports anchor semantics through asChild", () => {
    render(
      <Button asChild>
        <a href="/collections">Explore</a>
      </Button>,
    );
    expect(screen.getByRole("link", { name: "Explore" })).toHaveAttribute(
      "href",
      "/collections",
    );
  });

  it("announces loading and prevents repeat activation", async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Shop fragrance
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("makes an unavailable asChild link unfocusable and prevents navigation", async () => {
    const onClick = vi.fn();
    render(
      <Button asChild disabled onClick={onClick}>
        <a href="/collections">Explore</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Explore" });
    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveAttribute("tabindex", "-1");
    await userEvent.click(link);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("enforces an unfocusable unavailable link over caller tab indexes", () => {
    render(
      <Button asChild loading tabIndex={0}>
        <a href="/collections" tabIndex={0}>
          Explore
        </a>
      </Button>,
    );

    const link = screen.getByRole("link", { name: "Explore" });
    expect(link).toHaveAttribute("tabindex", "-1");
    expect(link).toHaveAttribute("aria-busy", "true");
    expect(screen.getByText("Explore")).toHaveClass("opacity-0");
    expect(link.querySelector("svg")).toHaveClass("animate-spin");
  });
});
