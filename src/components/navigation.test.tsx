import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Navigation } from "@/components/navigation";

afterEach(cleanup);

describe("Navigation", () => {
  it("renders the approved destinations and commerce utilities", () => {
    const { container } = render(<Navigation currentHref="/shop" />);

    expect(
      screen.getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
    expect(container.querySelector("header")).toHaveClass(
      "bg-navigation-surface",
      "border-navigation-divider",
      "sticky",
      "top-0",
    );
    const logo = container.querySelector(
      '[data-logo-asset="/infusion-diffusion-logo.svg"]',
    );
    expect(logo).toHaveAttribute("aria-hidden", "true");
    expect(logo).toHaveClass("w-31", "lg:w-55", "aspect-[220/64]");
    expect(logo).toHaveClass("bg-navigation-accent");
    expect(screen.getAllByRole("link", { name: "Shop" })[0]).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.queryByRole("link", { name: "Account" })).toBeNull();
    expect(screen.getAllByRole("link", { name: "Cart" })[0]).toHaveAttribute(
      "href",
      "/cart",
    );
  });

  it("shows Account only when a provisioned destination is supplied", () => {
    render(<Navigation accountHref="/account" />);
    expect(screen.getAllByRole("link", { name: "Account" })[0]).toHaveAttribute(
      "href",
      "/account",
    );
  });

  it("includes Gallery in the approved destination order and marks it current in the drawer", async () => {
    const user = userEvent.setup();
    render(<Navigation currentHref="/gallery" />);
    const links = screen.getAllByRole("link", { name: "Gallery" });
    expect(links[0]).toHaveAttribute("href", "/gallery");
    expect(links[0]).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      within(screen.getByRole("dialog", { name: "Navigation menu" })).getByRole(
        "link",
        { name: "Gallery" },
      ),
    ).toHaveAttribute("aria-current", "page");
  });

  it("omits malformed destinations and the menu control when none remain", () => {
    render(
      <Navigation
        destinations={[
          { label: "Unsafe", href: "javascript:alert(1)" },
          { label: "", href: "/blank" },
        ]}
      />,
    );

    expect(
      screen.queryByRole("link", { name: "Unsafe" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Open menu" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Infusion Diffusion home" }),
    ).toBeInTheDocument();
  });

  it("opens and closes the mobile dialog, restores focus, and unlocks scrolling", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    const opener = screen.getByRole("button", { name: "Open menu" });

    await user.click(opener);
    expect(
      screen.getByRole("dialog", { name: "Navigation menu" }),
    ).toBeInTheDocument();
    expect(document.body).toHaveStyle({ overflow: "hidden" });

    fireEvent.keyDown(document, { key: "Escape" });
    expect(
      screen.queryByRole("dialog", { name: "Navigation menu" }),
    ).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
  });

  it("wraps keyboard focus inside the open drawer", async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));

    const dialog = screen.getByRole("dialog", { name: "Navigation menu" });
    const focusable = dialog.querySelectorAll<HTMLElement>("a[href], button");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    last.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(first).toHaveFocus();
  });
});
