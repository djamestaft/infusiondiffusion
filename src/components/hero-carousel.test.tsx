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
  { id: "three", src: "/three.jpg", alt: "Third campaign" },
];

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
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
    const next = screen.getByRole("button", { name: "Show slide 2 of 3" });
    fireEvent.click(next);
    expect(next).toHaveAttribute("aria-current", "true");
    expect(
      screen.getByText("Slide 2 of 3", { selector: "[aria-live]" }),
    ).toHaveClass("sr-only");
    expect(next).toHaveClass("size-11");
    expect(
      screen.getByRole("button", { name: "Autoplay unavailable" }),
    ).toBeDisabled();
  });

  it("autoplays every three seconds and wraps continuously", () => {
    vi.useFakeTimers();
    render(<HeroCarousel slides={slides} />);
    act(() => vi.advanceTimersByTime(3_000));
    expect(
      screen.getByRole("button", { name: "Show slide 2 of 3" }),
    ).toHaveAttribute("aria-current", "true");
    act(() => vi.advanceTimersByTime(3_000));
    expect(
      screen.getByRole("button", { name: "Show slide 3 of 3" }),
    ).toHaveAttribute("aria-current", "true");
    act(() => vi.advanceTimersByTime(3_000));
    expect(
      screen.getByRole("button", { name: "Show slide 1 of 3" }),
    ).toHaveAttribute("aria-current", "true");
    act(() => vi.advanceTimersByTime(3_000));
    expect(
      screen.getByRole("button", { name: "Show slide 2 of 3" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("restarts a full progress cycle after pause and play", () => {
    vi.useFakeTimers();
    render(<HeroCarousel slides={slides} />);
    const first = screen.getByRole("button", { name: "Show slide 1 of 3" });
    const originalProgress = first.querySelector(".hero-carousel-progress");

    act(() => vi.advanceTimersByTime(1_500));
    fireEvent.click(screen.getByRole("button", { name: "Pause carousel" }));
    expect(first.querySelector(".hero-carousel-progress")).toBeNull();
    act(() => vi.advanceTimersByTime(3_000));
    expect(first).toHaveAttribute("aria-current", "true");

    fireEvent.click(screen.getByRole("button", { name: "Play carousel" }));
    const restartedProgress = first.querySelector(".hero-carousel-progress");
    expect(restartedProgress).toBeInTheDocument();
    expect(restartedProgress).not.toBe(originalProgress);
    act(() => vi.advanceTimersByTime(2_999));
    expect(first).toHaveAttribute("aria-current", "true");
    act(() => vi.advanceTimersByTime(1));
    expect(
      screen.getByRole("button", { name: "Show slide 2 of 3" }),
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

  it("keeps playing on hover and pauses for focus, visibility, and manual pagination", () => {
    vi.useFakeTimers();
    render(<HeroCarousel slides={slides} />);
    const carousel = screen.getByLabelText("Homepage campaign imagery");
    expect(carousel).toHaveAttribute("data-autoplay", "running");
    expect(
      screen.getByRole("button", { name: "Pause carousel" }),
    ).toBeVisible();

    fireEvent.mouseEnter(carousel);
    expect(carousel).toHaveAttribute("data-autoplay", "running");
    act(() => vi.advanceTimersByTime(3_000));
    expect(
      screen.getByRole("button", { name: "Show slide 2 of 3" }),
    ).toHaveAttribute("aria-current", "true");
    expect(
      screen.getByRole("button", { name: "Pause carousel" }),
    ).toBeVisible();
    fireEvent.mouseLeave(carousel);

    const third = screen.getByRole("button", { name: "Show slide 3 of 3" });
    fireEvent.focus(third);
    expect(carousel).toHaveAttribute("data-autoplay", "paused");
    fireEvent.blur(third, { relatedTarget: null });
    fireEvent.click(third);
    expect(carousel).toHaveAttribute("data-autoplay", "paused");
    expect(screen.getByRole("button", { name: "Play carousel" })).toBeVisible();

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

  it("pauses while the carousel is offscreen and resumes when visible", () => {
    let reportIntersection: IntersectionObserverCallback = () => undefined;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback) {
          reportIntersection = callback;
        }
        observe() {}
        disconnect() {}
      },
    );
    render(<HeroCarousel slides={slides} />);
    const carousel = screen.getByLabelText("Homepage campaign imagery");

    act(() =>
      reportIntersection(
        [{ isIntersecting: false } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(carousel).toHaveAttribute("data-autoplay", "paused");
    act(() =>
      reportIntersection(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      ),
    );
    expect(carousel).toHaveAttribute("data-autoplay", "running");
  });

  it("frames the image with four external brackets and centers one control group", () => {
    render(<HeroCarousel slides={slides} />);

    const stage = screen.getByTestId("hero-carousel-stage");
    const media = screen.getByTestId("hero-carousel-media");
    const controls = screen.getByTestId("hero-carousel-controls");
    expect(stage).toHaveClass("p-3", "lg:p-5");
    expect(stage).not.toHaveClass("border");
    expect(media).toHaveClass("aspect-4/5", "overflow-hidden", "rounded-[8px]");
    const brackets = [
      screen.getByTestId("hero-carousel-bracket-top-left"),
      screen.getByTestId("hero-carousel-bracket-top-right"),
      screen.getByTestId("hero-carousel-bracket-bottom-left"),
      screen.getByTestId("hero-carousel-bracket-bottom-right"),
    ];
    expect(brackets).toHaveLength(4);
    for (const bracket of brackets) {
      expect(bracket).toHaveClass(
        "absolute",
        "size-10",
        "lg:size-14",
        "border-hero-carousel-bracket",
      );
      expect(bracket).not.toHaveClass("shadow", "bg-linear-to-r");
    }
    expect(controls).toHaveClass("justify-center", "mt-5", "lg:mt-6");
    expect(controls).toContainElement(
      screen.getByLabelText("Choose a hero slide"),
    );
    expect(controls).toContainElement(
      screen.getByRole("button", { name: "Pause carousel" }),
    );
  });

  it("supports the approved plain presentation without legacy corner brackets", () => {
    render(<HeroCarousel slides={slides} presentation="plain" />);

    expect(screen.getByTestId("hero-carousel-stage")).not.toHaveClass("p-3");
    expect(
      screen.queryByTestId("hero-carousel-bracket-top-left"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("hero-carousel-controls")).toBeVisible();
    expect(screen.getByTestId("hero-carousel-media")).toHaveClass(
      "aspect-[342/470]",
      "lg:aspect-[656/680]",
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

  it("skips one broken slide and keeps the remaining navigation usable", () => {
    render(<HeroCarousel slides={slides} />);
    fireEvent.error(screen.getByAltText("First campaign"));
    expect(
      screen.queryByTestId("hero-carousel-fallback"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show slide 1 of 3" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Show slide 2 of 3" }),
    ).toHaveAttribute("aria-current", "true");
    expect(screen.getByAltText("Second campaign")).toBeVisible();
  });

  it("never autoplays onto a failed lazy slide", () => {
    vi.useFakeTimers();
    render(<HeroCarousel slides={slides} />);
    fireEvent.error(screen.getByAltText("Second campaign"));
    act(() => vi.advanceTimersByTime(3_000));

    expect(
      screen.getByRole("button", { name: "Show slide 2 of 3" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Show slide 3 of 3" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("accumulates multiple lazy failures without selecting either", () => {
    vi.useFakeTimers();
    render(<HeroCarousel slides={slides} />);
    fireEvent.error(screen.getByAltText("Second campaign"));
    fireEvent.error(screen.getByAltText("Third campaign"));
    act(() => vi.advanceTimersByTime(3_000));

    expect(
      screen.getByRole("button", { name: "Show slide 1 of 3" }),
    ).toHaveAttribute("aria-current", "true");
    expect(
      screen.getByRole("button", { name: "Show slide 2 of 3" }),
    ).toBeDisabled();
    expect(
      screen.getByRole("button", { name: "Show slide 3 of 3" }),
    ).toBeDisabled();
  });
});
