import { useEffect, type RefObject } from "react";
import { act, cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { MotionRuntime } from "@/lib/motion/runtime";
import { HeroAtmosphere } from "./hero-atmosphere";

vi.mock("./motion-boundary", () => ({
  useMotionPreference: () => ({ paused: false }),
  useMotionEffect: (
    ref: { current: HTMLElement },
    _enabled: boolean,
    setup: Parameters<typeof import("./motion-boundary").useMotionEffect>[2],
  ) => {
    useEffect(
      () =>
        setup(
          { gsap: { fromTo: vi.fn() } } as unknown as MotionRuntime,
          ref.current,
          () => {},
        ),
      [ref, setup],
    );
  },
}));
let frames: Map<number, FrameRequestCallback>;
let intersect: (entries: { isIntersecting: boolean }[]) => void;
let disconnect: ReturnType<typeof vi.fn>;
let id: number;
beforeEach(() => {
  frames = new Map();
  id = 0;
  disconnect = vi.fn();
  vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
    frames.set(++id, callback);
    return id;
  });
  vi.stubGlobal("cancelAnimationFrame", (frame: number) =>
    frames.delete(frame),
  );
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(callback: typeof intersect) {
        intersect = callback;
      }
      observe() {}
      disconnect = disconnect;
    },
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 1440,
    bottom: 800,
    width: 1440,
    height: 800,
    toJSON() {},
  });
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
function study(
  props: {
    pointerX?: number;
    pointerY?: number;
    animateEntrance?: boolean;
    focusScope?: RefObject<HTMLElement | null>;
  } = {},
) {
  const view = render(
    <HeroAtmosphere {...props}>
      <div data-motion-backdrop />
      <a href="/shop">Shop</a>
    </HeroAtmosphere>,
    { container: props.focusScope?.current ?? undefined },
  );
  const hero = view.getByTestId("hero-atmosphere");
  const layer = hero.querySelector<HTMLElement>("[data-motion-backdrop]")!;
  const move = (x = 1200, y = 600) => {
    const event = new MouseEvent("pointermove", {
      clientX: x,
      clientY: y,
      bubbles: true,
    });
    Object.defineProperty(event, "pointerType", { value: "mouse" });
    fireEvent(hero, event);
  };
  const tick = (time: number) =>
    act(() => {
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(time));
    });
  return { ...view, hero, layer, move, tick };
}
describe("hero pointer lifecycle", () => {
  it("stops decorative motion when a sibling control in an explicit focus scope receives focus", () => {
    const root = document.createElement("div");
    document.body.append(root);
    const s = study({ focusScope: { current: root } });
    const input = document.createElement("input");
    root.append(input);
    s.move();
    s.tick(16);
    expect(s.layer.style.transform).not.toBe("");
    act(() => input.focus());
    expect(s.layer.style.transform).toBe("");
    expect(frames.size).toBe(0);
    s.move();
    expect(frames.size).toBe(0);
  });
  it("supports bounded decorative guide travel without changing default hero travel", () => {
    const s = study({ pointerX: 8, pointerY: 4, animateEntrance: false });
    s.move(1440, 800);
    for (let time = 16; time < 4000 && frames.size; time += 16) s.tick(time);
    expect(s.layer.style.transform).toBe(
      "translate3d(8px, 4px, 0) scale(1.04)",
    );
    expect(frames.size).toBe(0);
  });
  it("freezes the rendered pose on leave and resumes from it with a fresh clock", () => {
    const s = study();
    s.move();
    s.tick(16);
    s.tick(32);
    const before = s.layer.style.transform;
    fireEvent.pointerLeave(s.hero);
    expect(frames.size).toBe(0);
    expect(s.layer.style.transform).toBe(before);
    s.move(300, 300);
    expect(s.layer.style.transform).toBe(before);
    s.tick(10000);
    const x = Number(
      s.layer.style.transform.match(/translate3d\(([-\d.]+)px/)![1],
    );
    const oldX = Number(before.match(/translate3d\(([-\d.]+)px/)![1]);
    expect(Math.abs(x - oldX)).toBeLessThan(2);
    expect(frames.size).toBe(1);
  });
  it("keeps a single RAF loop through repeated navigation crossings and settles", () => {
    const s = study();
    for (let i = 0; i < 8; i++) {
      s.move();
      s.move();
      expect(frames.size).toBe(1);
      s.tick(i * 16 + 16);
      const pose = s.layer.style.transform;
      fireEvent.pointerLeave(s.hero);
      expect(frames.size).toBe(0);
      expect(s.layer.style.transform).toBe(pose);
    }
    s.move();
    for (let time = 200; time < 4000 && frames.size; time += 16) s.tick(time);
    expect(frames.size).toBe(0);
  });
  it("suspends hidden and offscreen work without discarding its pose", () => {
    const s = study();
    s.move();
    s.tick(16);
    const pose = s.layer.style.transform;
    vi.spyOn(document, "hidden", "get").mockReturnValue(true);
    fireEvent(document, new Event("visibilitychange"));
    expect(frames.size).toBe(0);
    expect(s.layer.style.transform).toBe(pose);
    s.move();
    expect(frames.size).toBe(0);
    vi.spyOn(document, "hidden", "get").mockReturnValue(false);
    act(() => intersect([{ isIntersecting: false }]));
    s.move();
    expect(frames.size).toBe(0);
    expect(s.layer.style.transform).toBe(pose);
    act(() => intersect([{ isIntersecting: true }]));
    s.move();
    expect(frames.size).toBe(1);
  });
  it("centers on keyboard focus and removes all owned work on unmount", () => {
    const s = study();
    s.move();
    s.tick(16);
    act(() => s.getByRole("link").focus());
    expect(frames.size).toBe(0);
    expect(s.layer.style.transform).toBe("");
    s.move();
    expect(frames.size).toBe(0);
    act(() => s.getByRole("link").blur());
    s.move();
    s.tick(32);
    s.unmount();
    expect(frames.size).toBe(0);
    expect(disconnect).toHaveBeenCalledOnce();
    expect(s.layer.style.transform).toBe("");
    s.move();
    expect(frames.size).toBe(0);
  });
});
