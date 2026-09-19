import { gsap } from "gsap";
import { afterEach, expect, it } from "vitest";
import { createCarouselTransition } from "./carousel-transition";

afterEach(() => {
  gsap.globalTimeline.clear();
  document.body.replaceChildren();
});

function fixture() {
  document.body.innerHTML = `
    <div id="outgoing"><h1><span>O</span><span>L</span><span>D</span></h1><p data-carousel-support>Old copy</p></div>
    <div id="incoming">
      <h1><span>A</span><span>B</span><span>C</span><span>D</span></h1>
      <div data-carousel-picture>Campaign image</div>
      <p data-carousel-support>Introduction</p>
      <a data-carousel-support href="/shop">Shop</a>
    </div>`;
  const incoming = document.querySelector<HTMLElement>("#incoming")!;
  const outgoing = document.querySelector<HTMLElement>("#outgoing")!;
  const chars = [...incoming.querySelectorAll<HTMLElement>("h1 span")];
  const image = incoming.querySelector<HTMLElement>("[data-carousel-picture]")!;
  const outgoingChars = [...outgoing.querySelectorAll<HTMLElement>("h1 span")];
  return { incoming, outgoing, chars, image, outgoingChars };
}

it("starts the outgoing letters left before overlapping the right-side arrival", () => {
  const { incoming, outgoing, chars, image, outgoingChars } = fixture();
  const timeline = createCarouselTransition(
    gsap,
    incoming,
    outgoing,
    chars,
    outgoingChars,
  );
  timeline.pause().seek(0.05);
  expect(Number(gsap.getProperty(outgoingChars[0], "x"))).toBeLessThan(0);
  expect(Number(gsap.getProperty(outgoingChars[0], "y"))).toBe(0);
  expect(Number(gsap.getProperty(chars[0], "opacity"))).toBe(0);
  expect(Number(gsap.getProperty(image, "opacity"))).toBe(0);
  timeline.seek(0.2);
  expect(Number(gsap.getProperty(chars[0], "opacity"))).toBe(0);
  expect(Number(gsap.getProperty(outgoingChars[0], "opacity"))).toBeLessThan(
    0.5,
  );
  timeline.seek(0.26);
  expect(Number(gsap.getProperty(outgoingChars[0], "opacity"))).toBeGreaterThan(
    0,
  );
  expect(Number(gsap.getProperty(chars[0], "opacity"))).toBeGreaterThan(0);
  expect(Number(gsap.getProperty(chars[0], "x"))).toBeGreaterThan(0);
  timeline.progress(1);
  expect(Number(gsap.getProperty(outgoingChars.at(-1)!, "x"))).toBe(-24);
  expect(Number(gsap.getProperty(outgoingChars[0], "x"))).toBeLessThan(-24);
  expect(Number(gsap.getProperty(outgoing, "opacity"))).toBe(0);
});

it("leads with staggered letters from the right before the photograph pulses", () => {
  const { incoming, outgoing, chars, image } = fixture();
  const timeline = createCarouselTransition(gsap, incoming, outgoing, chars);
  timeline.pause().seek(0.3);
  const first = Number(gsap.getProperty(chars[0], "x"));
  const last = Number(gsap.getProperty(chars.at(-1)!, "x"));
  expect(last).toBeGreaterThan(36);
  expect(first).toBeGreaterThan(0);
  expect(first).toBeLessThan(last);
  expect(Number(gsap.getProperty(chars[0], "y"))).toBe(0);
  expect(Number(gsap.getProperty(image, "opacity"))).toBe(0);
  timeline.seek(0.45);
  expect(Number(gsap.getProperty(image, "opacity"))).toBeGreaterThan(0);
  expect(Number(gsap.getProperty(image, "scaleX"))).toBeGreaterThan(0.98);
  timeline.progress(1);
  for (const char of chars) {
    expect(Number(gsap.getProperty(char, "x"))).toBe(0);
    expect(Number(gsap.getProperty(char, "opacity"))).toBe(1);
  }
  expect(Number(gsap.getProperty(image, "scaleX"))).toBe(1);
  expect(Number(gsap.getProperty(image, "opacity"))).toBe(1);
  expect(Number(gsap.getProperty(outgoing, "opacity"))).toBe(0);
});

it("restores visible untransformed content when an interrupted sequence is reverted", () => {
  const { incoming, outgoing, chars, image, outgoingChars } = fixture();
  const context = gsap.context(() => {
    createCarouselTransition(gsap, incoming, outgoing, chars, outgoingChars)
      .pause()
      .seek(0.25);
  });
  expect(image.style.transform).not.toBe("");
  context.revert();
  for (const element of [
    incoming,
    outgoing,
    image,
    ...chars,
    ...outgoingChars,
  ]) {
    expect(element.style.transform).toBe("");
    expect(element.style.opacity).toBe("");
    expect(element.style.visibility).toBe("");
  }
});

it("restarts expanded tracking on each wrapped line and leaves line geometry untouched", () => {
  const { incoming, outgoing, chars } = fixture();
  chars.forEach((char, index) => {
    char.getBoundingClientRect = () => ({ top: index < 2 ? 0 : 56 }) as DOMRect;
  });
  const timeline = createCarouselTransition(gsap, incoming, outgoing, chars);
  timeline.pause().seek(0.05);
  expect(chars.map((char) => Number(gsap.getProperty(char, "x")))).toEqual([
    36, 38.5, 36, 38.5,
  ]);
  expect(chars.every((char) => Number(gsap.getProperty(char, "y")) === 0)).toBe(
    true,
  );
  expect(incoming.querySelector("h1")!.style.letterSpacing).toBe("");
  timeline.progress(1);
  expect(chars.every((char) => Number(gsap.getProperty(char, "x")) === 0)).toBe(
    true,
  );
});

it("waits for the complete title, then gently fades stationary supporting content", () => {
  const { incoming, outgoing, chars } = fixture();
  const timeline = createCarouselTransition(gsap, incoming, outgoing, chars);
  const description = incoming.querySelector("p")!;
  const cta = incoming.querySelector("a")!;
  timeline.pause().seek(1.25);
  expect(
    chars.every((char) => Number(gsap.getProperty(char, "opacity")) === 1),
  ).toBe(true);
  expect(Number(gsap.getProperty(description, "opacity"))).toBe(0);
  expect(Number(gsap.getProperty(cta, "opacity"))).toBe(0);
  timeline.seek(1.34);
  expect(Number(gsap.getProperty(description, "opacity"))).toBeGreaterThan(0);
  expect(Number(gsap.getProperty(description, "opacity"))).toBeLessThan(0.5);
  expect(Number(gsap.getProperty(cta, "opacity"))).toBe(0);
  timeline.seek(1.55);
  expect(Number(gsap.getProperty(cta, "opacity"))).toBeGreaterThan(0);
  for (const element of [description, cta]) {
    expect(Number(gsap.getProperty(element, "x"))).toBe(0);
    expect(Number(gsap.getProperty(element, "y"))).toBe(0);
  }
  timeline.progress(1);
  expect(Number(gsap.getProperty(cta, "opacity"))).toBe(1);
});

it("caps the full sequence for long headlines", () => {
  const { incoming, outgoing, chars } = fixture();
  const manyChars = Array.from({ length: 180 }, () => {
    const char = chars[0].cloneNode(true) as HTMLElement;
    incoming.querySelector("h1")!.append(char);
    return char;
  });
  const timeline = createCarouselTransition(
    gsap,
    incoming,
    outgoing,
    manyChars,
  );
  expect(timeline.duration()).toBeGreaterThan(1);
  expect(timeline.duration()).toBeLessThanOrEqual(1.8);
  timeline.pause().seek(0.05);
  expect(Number(gsap.getProperty(manyChars.at(-1)!, "x"))).toBeLessThanOrEqual(
    84,
  );
  timeline.pause().seek(1.8);
  expect(
    Number(gsap.getProperty(incoming.querySelector("a")!, "opacity")),
  ).toBe(1);
});
