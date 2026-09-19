import { useRef } from "react";
import { loadMotion, type MotionRuntime } from "@/lib/motion/runtime";
import { renderToString } from "react-dom/server";
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useMotionEffect, MotionBoundary } from "./motion-boundary";
import { FragranceJourney } from "./fragrance-journey";
import { productCardFixtures } from "@/components/ui/product-card.fixtures";
vi.mock("@/lib/motion/runtime", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@/lib/motion/runtime")>()),
  loadMotion: vi.fn(() => Promise.reject(new Error("offline"))),
}));
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
function media(matches = false) {
  const listeners = new Set<() => void>();
  const query = {
    matches,
    addEventListener: (_event: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_event: string, listener: () => void) =>
      listeners.delete(listener),
  };
  vi.stubGlobal("matchMedia", () => query);
  return { query, listeners };
}
function Journey({ products = productCardFixtures } = {}) {
  return (
    <MotionBoundary>
      <FragranceJourney products={products} title="Our collection" />
    </MotionBoundary>
  );
}
describe("progressively enhanced collection", () => {
  it("server-renders every supplied card with no motion-only hiding", () => {
    const html = renderToString(<Journey />);
    const root = document.createElement("div");
    root.innerHTML = html;
    expect(root.querySelectorAll("a[aria-label^='View ']")).toHaveLength(6);
    expect(root.querySelector("[data-motion-active]")).toBeNull();
    expect(root.querySelector("[data-motion-track] [hidden]")).toBeNull();
  });
  it("keeps every received product visible and linked without eligible motion", () => {
    media();
    render(<Journey />);
    expect(screen.getAllByRole("link", { name: /^View / })).toHaveLength(6);
    expect(
      screen.queryByRole("button", { name: "View without motion" }),
    ).not.toBeInTheDocument();
  });
  it("supports empty and single collections", () => {
    media();
    const { rerender } = render(<Journey products={[]} />);
    expect(screen.getByText(/collection is being prepared/)).toBeVisible();
    rerender(<Journey products={productCardFixtures.slice(0, 1)} />);
    expect(screen.getAllByRole("link", { name: /^View / })).toHaveLength(1);
  });
  it("retains content on import failure and responds to live preferences", async () => {
    const { query, listeners } = media(true);
    const { unmount } = render(<Journey />);
    await act(async () => {
      await Promise.resolve();
    });
    fireEvent.click(
      screen.getByRole("button", { name: "View without motion" }),
    );
    expect(
      screen.getByRole("button", { name: "Enable motion" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(screen.getAllByRole("link", { name: /^View / })).toHaveLength(6);
    act(() => {
      query.matches = false;
      listeners.forEach((listener) => listener());
    });
    expect(
      screen.queryByRole("button", { name: "Enable motion" }),
    ).not.toBeInTheDocument();
    unmount();
    expect(listeners.size).toBe(0);
  });
});

function ThrowingStudy() {
  const ref = useRef<HTMLDivElement>(null);
  useMotionEffect(ref, true, (_runtime, element, onCleanup) => {
    onCleanup(() => element.removeAttribute("data-motion-active"));
    element.setAttribute("data-motion-active", "true");
    throw new Error("setup failed after acquiring layout");
  });
  return (
    <div ref={ref} data-testid="throwing-study">
      Visible static content
    </div>
  );
}
it("reverts acquired manual layout if setup throws before returning", async () => {
  media(true);
  const revert = vi.fn();
  vi.mocked(loadMotion).mockResolvedValueOnce({
    gsap: {
      matchMedia: () => ({
        add: (_query: string, setup: () => void) => setup(),
        revert,
      }),
    },
  } as unknown as MotionRuntime);
  render(<ThrowingStudy />);
  await act(async () => {
    await Promise.resolve();
  });
  expect(revert).toHaveBeenCalledOnce();
  expect(screen.getByTestId("throwing-study")).not.toHaveAttribute(
    "data-motion-active",
  );
  expect(screen.getByText("Visible static content")).toBeVisible();
});
