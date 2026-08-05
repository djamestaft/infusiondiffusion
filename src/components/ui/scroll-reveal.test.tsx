import { act, cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ScrollReveal } from "@/components/ui/scroll-reveal";

let intersectionCallback: IntersectionObserverCallback;
const disconnect = vi.fn();
const observe = vi.fn();

beforeEach(() => {
  disconnect.mockClear();
  observe.mockClear();
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: IntersectionObserverCallback) {
        intersectionCallback = callback;
      }

      disconnect = disconnect;
      observe = observe;
    },
  );
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn(() => ({ matches: false }) as MediaQueryList),
  });
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    top: 900,
    bottom: 1100,
  } as DOMRect);
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("ScrollReveal", () => {
  it("reveals once as soon as the section intersects the viewport", () => {
    render(
      <ScrollReveal>
        <section>Next section</section>
      </ScrollReveal>,
    );

    const reveal = screen.getByText("Next section").parentElement;
    expect(reveal).toHaveAttribute("data-reveal-state", "waiting");
    expect(observe).toHaveBeenCalledWith(reveal);

    act(() => {
      intersectionCallback(
        [{ isIntersecting: true } as IntersectionObserverEntry],
        {} as IntersectionObserver,
      );
    });

    expect(reveal).toHaveAttribute("data-reveal-state", "visible");
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it("keeps content visible when reduced motion is requested", () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: true,
    } as MediaQueryList);

    render(<ScrollReveal>Quiet content</ScrollReveal>);

    expect(screen.getByText("Quiet content")).toHaveAttribute(
      "data-reveal-state",
      "visible",
    );
    expect(observe).not.toHaveBeenCalled();
  });
});
