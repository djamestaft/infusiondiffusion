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
    expect(
      screen.getByRole("button", { name: "Autoplay unavailable" }),
    ).toBeDisabled();
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
    expect(screen.getByTestId("carousel-status")).toHaveTextContent(
      "Carousel autoplay unavailable",
    );
    rerender(<HeroCarousel slides={slides} forceSaveData />);
    expect(screen.getByLabelText("Homepage campaign imagery")).toHaveAttribute(
      "data-autoplay",
      "paused",
    );
  });

  it("pauses on hover, focus, visibility, and manual pagination", () => {
    render(<HeroCarousel slides={slides} />);
    const carousel = screen.getByLabelText("Homepage campaign imagery");
    expect(carousel).toHaveAttribute("data-autoplay", "running");
    expect(
      screen.getByRole("button", { name: "Pause carousel" }),
    ).toBeVisible();

    fireEvent.mouseEnter(carousel);
    expect(carousel).toHaveAttribute("data-autoplay", "paused");
    expect(screen.getByRole("button", { name: "Play carousel" })).toBeVisible();
    fireEvent.mouseLeave(carousel);

    const second = screen.getByRole("button", { name: "Show slide 2 of 2" });
    fireEvent.focus(second);
    expect(carousel).toHaveAttribute("data-autoplay", "paused");
    fireEvent.blur(second, { relatedTarget: null });
    fireEvent.click(second);
    expect(carousel).toHaveAttribute("data-autoplay", "paused");

    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    fireEvent(document, new Event("visibilitychange"));
    expect(carousel).toHaveAttribute("data-autoplay", "paused");
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
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

  it("skips one broken slide and keeps the remaining navigation usable", () => {
    render(<HeroCarousel slides={slides} />);
    fireEvent.error(screen.getByAltText("First campaign"));
    expect(
      screen.queryByTestId("hero-carousel-fallback"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show slide 1 of 2" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Show slide 2 of 2" }),
    ).toHaveAttribute("aria-current", "true");
    expect(screen.getByAltText("Second campaign")).toBeVisible();
  });
});
