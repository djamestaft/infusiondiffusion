import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  HeroCarousel,
  type HeroCarouselSlide,
} from "@/components/hero-carousel";

const slides: HeroCarouselSlide[] = [
  { id: "one", src: "/one.jpg", alt: "First campaign" },
  { id: "two", src: "/two.jpg", alt: "Second campaign" },
];

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("HeroCarousel", () => {
  it("renders one slide as static media", () => {
    render(
      <HeroCarousel
        slides={[{ ...slides[0], caption: "Editorial caption" }]}
      />,
    );
    expect(screen.getByAltText("First campaign")).toHaveAttribute(
      "loading",
      "eager",
    );
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.getByText("Editorial caption")).toHaveClass("sr-only");
  });

  it("moves manually, announces only that change, and exposes 44px controls", () => {
    render(<HeroCarousel slides={slides} forceReducedMotion />);
    const next = screen.getByRole("button", { name: "Show slide 2 of 2" });
    fireEvent.click(next);
    expect(next).toHaveAttribute("aria-current", "true");
    expect(
      screen.getByText("Slide 2 of 2", { selector: "[aria-live]" }),
    ).toHaveClass("sr-only");
    expect(next).toHaveClass("size-11");
  });

  it("autoplays once after eight seconds", () => {
    vi.useFakeTimers();
    render(<HeroCarousel slides={slides} />);
    act(() => vi.advanceTimersByTime(8_000));
    expect(
      screen.getByRole("button", { name: "Show slide 2 of 2" }),
    ).toHaveAttribute("aria-current", "true");
    act(() => vi.advanceTimersByTime(16_000));
    expect(
      screen.getByRole("button", { name: "Show slide 2 of 2" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("disables autoplay for reduced motion and Save-Data", () => {
    const { rerender } = render(
      <HeroCarousel slides={slides} forceReducedMotion />,
    );
    expect(screen.getByLabelText("Homepage campaign imagery")).toHaveAttribute(
      "data-autoplay",
      "paused",
    );
    rerender(<HeroCarousel slides={slides} forceSaveData />);
    expect(screen.getByLabelText("Homepage campaign imagery")).toHaveAttribute(
      "data-autoplay",
      "paused",
    );
  });

  it("keeps a stable fallback for empty and failed media", () => {
    const { rerender } = render(<HeroCarousel slides={[]} />);
    expect(screen.getByTestId("hero-carousel-fallback")).toHaveClass(
      "aspect-4/5",
    );
    rerender(<HeroCarousel slides={slides.slice(0, 1)} />);
    fireEvent.error(screen.getByAltText("First campaign"));
    expect(screen.getByTestId("hero-carousel-fallback")).toBeVisible();
  });
});
