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
  timeline.pause().seek(0.02);
  expect(Number(gsap.getProperty(outgoingChars[0], "x"))).toBeLessThan(0);
  expect(Number(gsap.getProperty(outgoingChars[0], "y"))).toBe(0);
  expect(Number(gsap.getProperty(chars[0], "opacity"))).toBe(0);
  expect(Number(gsap.getProperty(image, "opacity"))).toBe(0);
  timeline.seek(0.04);
  expect(Number(gsap.getProperty(chars[0], "opacity"))).toBe(0);
  expect(Number(gsap.getProperty(outgoingChars[0], "opacity"))).toBeLessThan(1);
  timeline.seek(0.1);
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
  timeline.pause().seek(0.08);
  const first = Number(gsap.getProperty(chars[0], "x"));
  const last = Number(gsap.getProperty(chars.at(-1)!, "x"));
  expect(last).toBeGreaterThan(36);
  expect(first).toBeGreaterThan(0);
  expect(first).toBeLessThan(last);
  expect(Number(gsap.getProperty(chars[0], "y"))).toBe(0);
  expect(Number(gsap.getProperty(image, "opacity"))).toBe(0);
  timeline.seek(0.25);
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
  timeline.pause().seek(0.02);
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

it("shows stationary supporting content together instantly when the faster title settles", () => {
  const { incoming, outgoing, chars } = fixture();
  const timeline = createCarouselTransition(gsap, incoming, outgoing, chars);
  const support = [incoming.querySelector("p")!, incoming.querySelector("a")!];
  timeline.pause().seek(0.57);
  for (const element of support)
    expect(Number(gsap.getProperty(element, "opacity"))).toBe(0);
  timeline.seek(0.58);
  expect(chars.every((char) => Number(gsap.getProperty(char, "x")) === 0)).toBe(
    true,
  );
  for (const element of support) {
    expect(Number(gsap.getProperty(element, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(element, "x"))).toBe(0);
    expect(Number(gsap.getProperty(element, "y"))).toBe(0);
  }
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
  expect(timeline.duration()).toBeGreaterThan(0);
  expect(timeline.duration()).toBeLessThanOrEqual(0.6);
  timeline.pause().seek(0.02);
  expect(Number(gsap.getProperty(manyChars.at(-1)!, "x"))).toBeLessThanOrEqual(
    84,
  );
  timeline.pause().seek(0.6);
  expect(
    Number(gsap.getProperty(incoming.querySelector("a")!, "opacity")),
  ).toBe(1);
});

it("reveals description letters once from top to bottom while keeping the CTA visible", () => {
  const { incoming, outgoing, chars } = fixture();
  const description = incoming.querySelector("p")!;
  description.innerHTML = "<span>Top</span><span>Bottom</span>";
  const descriptionChars = [...description.querySelectorAll("span")];
  descriptionChars.forEach((char, index) => {
    char.getBoundingClientRect = () => ({ top: index * 26 }) as DOMRect;
  });
  let timeline!: ReturnType<typeof createCarouselTransition>;
  const context = gsap.context(() => {
    timeline = createCarouselTransition(
      gsap,
      incoming,
      outgoing,
      chars,
      [],
      descriptionChars,
    );
    timeline.pause().seek(0.59);
  });
  expect(Number(gsap.getProperty(description, "opacity"))).toBe(1);
  expect(
    Number(gsap.getProperty(incoming.querySelector("a")!, "opacity")),
  ).toBe(1);
  expect(
    Number(gsap.getProperty(descriptionChars[0], "opacity")),
  ).toBeGreaterThan(0);
  expect(Number(gsap.getProperty(descriptionChars[0], "opacity"))).toBeLessThan(
    1,
  );
  expect(Number(gsap.getProperty(descriptionChars[1], "opacity"))).toBe(0);
  let previous = [0, 0];
  for (const time of [0.6, 0.65, 0.7, 0.75, 0.8, 0.82]) {
    timeline.seek(time);
    const opacities = descriptionChars.map((char) =>
      Number(gsap.getProperty(char, "opacity")),
    );
    opacities.forEach((opacity, index) =>
      expect(opacity).toBeGreaterThanOrEqual(previous[index]),
    );
    expect(opacities[0]).toBeGreaterThanOrEqual(opacities[1]);
    previous = opacities;
  }
  timeline.seek(0.82);
  for (const char of descriptionChars) {
    expect(Number(gsap.getProperty(char, "opacity"))).toBe(1);
    expect(Number(gsap.getProperty(char, "x"))).toBe(0);
    expect(Number(gsap.getProperty(char, "y"))).toBe(0);
  }
  expect(timeline.duration()).toBeLessThanOrEqual(0.82);
  context.revert();
  for (const element of [
    description,
    ...descriptionChars,
    incoming.querySelector("a")!,
  ])
    expect((element as HTMLElement).style.opacity).toBe("");
});
