import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { HeroCarousel } from "./hero-carousel";
import { Navigation } from "./navigation";
afterEach(cleanup);
const slides = [
  {
    id: "a",
    src: "/a.png",
    alt: "First image",
    title: "First title",
    subtitle: "First copy",
    cta: { label: "Shop", href: "/shop" },
  },
  {
    id: "b",
    src: "/b.png",
    alt: "Second image",
    title: "Second title",
    subtitle: "Second copy",
    cta: { label: "Guide", href: "/fragrance-guide" },
  },
];
it("moves title, copy and CTA together, wraps and accepts keyboard navigation", () => {
  render(<HeroCarousel slides={slides} presentation="editorial" />);
  fireEvent.click(screen.getByRole("button", { name: "Next slide" }));
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "Second title",
  );
  expect(screen.getByRole("link", { name: "Guide" })).toHaveAttribute(
    "href",
    "/fragrance-guide",
  );
  fireEvent.keyDown(screen.getByRole("button", { name: "Next slide" }), {
    key: "ArrowRight",
  });
  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    "First title",
  );
});
it("retains editorial copy and CTA when media is missing or fails", () => {
  render(<HeroCarousel slides={[slides[0]]} presentation="editorial" />);
  fireEvent.error(screen.getByAltText("First image"));
  expect(screen.getByRole("link", { name: "Shop" })).toBeVisible();
  expect(screen.getByText("Hero image unavailable")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Next slide" })).toBeNull();
});
it("keeps fallback copy available with zero slides", () => {
  render(
    <HeroCarousel
      slides={[]}
      presentation="editorial"
      fallbackCopy={{
        title: "Fallback",
        subtitle: "Introduction",
        cta: { label: "Shop", href: "/shop" },
      }}
    />,
  );
  expect(screen.getByRole("heading")).toHaveTextContent("Fallback");
});
it("changes only the floating header surface after the scroll threshold", () => {
  const { container } = render(<Navigation floating />);
  const header = container.querySelector("header");
  expect(header).toHaveClass("bg-transparent", "fixed");
  Object.defineProperty(window, "scrollY", { value: 25, configurable: true });
  fireEvent.scroll(window);
  expect(header).toHaveClass("bg-navigation-surface", "fixed");
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
  fireEvent.scroll(window);
  expect(header).toHaveClass("bg-transparent");
});
