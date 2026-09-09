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

  it("uses About in the combined editorial destination and marks it current in the drawer", async () => {
    const user = userEvent.setup();
    render(<Navigation currentHref="/about" />);
    const links = screen.getAllByRole("link", { name: "About" });
    expect(links[0]).toHaveAttribute("href", "/about");
    expect(links[0]).toHaveAttribute("aria-current", "page");
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      within(screen.getByRole("dialog", { name: "Navigation menu" })).getByRole(
        "link",
        { name: "About" },
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

describe("cart availability", () => {
  it("keeps unknown distinct from zero and recovers to confirmed counts", async () => {
    const { rerender } = render(<Navigation cartCount={null} />);
    expect(screen.getAllByText("Cart (\u2014)")).toHaveLength(2);
    expect(
      screen.getAllByRole("link", { name: "Cart, item count unavailable" }),
    ).toHaveLength(2);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(
      within(screen.getByRole("dialog")).getByRole("link", {
        name: "Cart, item count unavailable",
      }),
    ).toHaveAttribute("href", "/cart");
    expect(
      within(screen.getByRole("dialog")).getByText("(\u2014)"),
    ).toHaveAttribute("aria-hidden", "true");
    fireEvent.keyDown(document, { key: "Escape" });
    rerender(<Navigation cartCount={0} />);
    expect(screen.queryByRole("link", { name: /unavailable/ })).toBeNull();
    expect(screen.getAllByRole("link", { name: "Cart" })).toHaveLength(2);
    rerender(<Navigation cartCount={1} />);
    expect(screen.getAllByRole("link", { name: "Cart, 1 item" })).toHaveLength(
      2,
    );
    rerender(<Navigation cartCount={123} />);
    expect(
      screen.getAllByRole("link", { name: "Cart, 123 items" }),
    ).toHaveLength(2);
  });

  it("releases scroll lock and restores visible focus at the desktop breakpoint", async () => {
    render(<Navigation />);
    await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.resize(window);
    expect(screen.queryByRole("dialog")).toBeNull();
    expect(document.body.style.overflow).toBe("");
    expect(
      screen.getByRole("link", { name: "Infusion Diffusion home" }),
    ).toHaveFocus();
  });

  it.each([false, true])(
    "preserves outside focus when the menu closes on desktop resize (blurred: %s)",
    async (blurred) => {
      render(
        <>
          <Navigation />
          <button>Outside</button>
        </>,
      );
      await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
      const outside = screen.getByRole("button", { name: "Outside" });
      outside.focus();
      if (blurred) outside.blur();
      fireEvent.resize(window);
      expect(screen.queryByRole("dialog")).toBeNull();
      if (blurred) expect(document.activeElement).toBe(document.body);
      else expect(outside).toHaveFocus();
    },
  );
});

it("restores the last menu focus when CSS hides it before resize fires", async () => {
  render(<Navigation />);
  await userEvent.click(screen.getByRole("button", { name: "Open menu" }));
  const menu = within(screen.getByRole("dialog"));
  const cart = menu.getByRole("link", { name: "Cart" });
  cart.focus();
  cart.blur();
  expect(document.activeElement).toBe(document.body);
  fireEvent.resize(window);
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(
    screen.getByRole("link", { name: "Infusion Diffusion home" }),
  ).toHaveFocus();
  expect(document.body.style.overflow).toBe("");
});
