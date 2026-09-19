import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const url = "/e2e-carousel?editorial=1&choreography=1";
const active = '.hero-editorial-panel[aria-hidden="false"]';

// This fixture uses local campaigns; a remote editorial event stream is unrelated
// to its behavior and can fail CORS on the isolated worktree's local port.
test.beforeEach(async ({ context }) => {
  await context.route("**.api.sanity.io/**/data/live/events/**", (route) =>
    route.fulfill({ contentType: "text/event-stream", body: ": fixture\n\n" }),
  );
});

test("initial Save-Data prevents fetching the optional animation runtime", async ({
  page,
  browser,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop import eligibility.");
  await page.setViewportSize({ width: 1440, height: 800 });
  const eligibleRequests: string[] = [];
  page.on("request", (request) => {
    if (
      request.resourceType() === "script" &&
      /gsap_(?:index|SplitText)_/i.test(request.url())
    )
      eligibleRequests.push(request.url());
  });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("home-hero-section")).toHaveAttribute(
    "data-carousel-choreography",
    "ready",
  );
  // Positive control: identify dynamic entry modules, not Turbopack's eagerly emitted async-loader stub.
  expect(eligibleRequests.length).toBeGreaterThan(0);
  const context = await browser.newContext({
    viewport: { width: 1440, height: 800 },
    baseURL: test.info().project.use.baseURL,
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    });
  });
  const saving = await context.newPage();
  const requests: string[] = [];
  saving.on("request", (request) => {
    if (
      request.resourceType() === "script" &&
      /gsap_(?:index|SplitText)_/i.test(request.url())
    )
      requests.push(request.url());
  });
  try {
    await saving.goto(url, { waitUntil: "domcontentloaded" });
    await expect(
      saving.getByRole("button", { name: "Autoplay unavailable" }),
    ).toBeDisabled();
    await saving.getByRole("button", { name: "Next slide" }).click();
    await expect(saving.getByRole("heading", { level: 1 })).toHaveText(
      "Campaign 2",
    );
    await expect(saving.getByTestId("home-hero-section")).toHaveAttribute(
      "data-carousel-choreography",
      "static",
    );
    expect(requests).toEqual([]);
  } finally {
    await context.close();
  }
});

test("letters lead horizontally, the image pulses afterwards, then the unsplit heading returns", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Letter choreography is a desktop enhancement.");
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const hero = page.getByTestId("home-hero-section");
  await expect(hero).toHaveAttribute("data-carousel-choreography", "ready");
  // Keep autoplay out of this timing sample.
  await page.getByRole("button", { name: "Pause carousel" }).click();
  const samples = await page.evaluate(async () => {
    const frames: {
      first: number;
      last: number;
      y: number;
      imageOpacity: number;
      scale: number;
      outgoingX: number | null;
      incomingOpacity: number;
      outgoingOpacity: number;
    }[] = [];
    const started = performance.now();
    document
      .querySelector<HTMLButtonElement>('[aria-label="Next slide"]')!
      .click();
    await new Promise<void>((resolve) => {
      const sample = () => {
        const panel = document.querySelector(
          '.hero-editorial-panel[aria-hidden="false"]',
        )!;
        const letters = panel.querySelectorAll(".hero-carousel-letter");
        const image = panel.querySelector("[data-carousel-picture]")!;
        if (letters.length) {
          const first = new DOMMatrix(getComputedStyle(letters[0]).transform);
          const outgoingLetter = document.querySelector(
            '[data-phase="exit"] .hero-carousel-letter',
          );
          frames.push({
            first: first.m41,
            last: new DOMMatrix(
              getComputedStyle(letters[letters.length - 1]).transform,
            ).m41,
            y: first.m42,
            imageOpacity: Number(getComputedStyle(image).opacity),
            scale: new DOMMatrix(getComputedStyle(image).transform).m11,
            outgoingX: outgoingLetter
              ? new DOMMatrix(getComputedStyle(outgoingLetter).transform).m41
              : null,
            incomingOpacity: Number(getComputedStyle(letters[0]).opacity),
            outgoingOpacity: outgoingLetter
              ? Number(getComputedStyle(outgoingLetter).opacity)
              : 0,
          });
        }
        if (performance.now() - started < 1000) requestAnimationFrame(sample);
        else resolve();
      };
      requestAnimationFrame(sample);
    });
    return frames;
  });
  expect(
    samples.some(
      (s) => s.first > 0 && s.first < s.last && s.imageOpacity === 0,
    ),
  ).toBe(true);
  expect(samples.every((s) => s.y === 0)).toBe(true);
  expect(
    samples.some(
      (s) => s.outgoingX !== null && s.outgoingX < 0 && s.incomingOpacity === 0,
    ),
  ).toBe(true);
  expect(
    samples.some((s) => s.outgoingOpacity > 0 && s.incomingOpacity > 0),
  ).toBe(true);
  expect(samples.some((s) => s.scale > 1)).toBe(true);
  await expect(page.locator(".hero-carousel-letter")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Campaign 2",
  );
  await expect(
    page.locator(active).locator("[data-carousel-picture]"),
  ).toHaveCSS("transform", "none");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
});

test("rapid forward/reverse navigation and resize leave one complete usable campaign", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Letter choreography is a desktop enhancement.");
  await page.setViewportSize({ width: 1366, height: 768 });
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("home-hero-section")).toHaveAttribute(
    "data-carousel-choreography",
    "ready",
  );
  await page.getByRole("button", { name: "Next slide" }).click();
  await expect(page.locator(".hero-carousel-letter").first()).toBeAttached();
  await page.getByRole("button", { name: "Next slide" }).click();
  await page.getByRole("button", { name: "Previous slide" }).click();
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(page.locator('[data-phase="enter"]')).toHaveCount(0);
  await expect(page.locator(".hero-carousel-letter")).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Campaign 2",
  );
  await expect(
    page.getByRole("link", { name: "Find your fragrance" }),
  ).toBeVisible();
  await expect(page.locator(active)).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("a live reduced-motion change cancels the split and keeps the selected slide readable", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop preference interruption.");
  await page.setViewportSize({ width: 1440, height: 800 });
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await expect(page.getByTestId("home-hero-section")).toHaveAttribute(
    "data-carousel-choreography",
    "ready",
  );
  await page.getByRole("button", { name: "Next slide" }).click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".hero-carousel-letter")).toHaveCount(0);
  await expect(page.locator('[data-phase="enter"]')).toHaveCount(0);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Campaign 2",
  );
  await expect(
    page.locator(active).locator("[data-carousel-picture]"),
  ).toHaveCSS("opacity", "1");
  await expect(
    page.getByRole("button", { name: "Autoplay unavailable" }),
  ).toBeDisabled();
});

test("reduced motion and small screens retain unsplit copy, controls and image geometry", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await expect(
      page.getByRole("button", { name: "Autoplay unavailable" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Next slide" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Campaign 2",
    );
    await expect(page.locator(".hero-carousel-letter")).toHaveCount(0);
    const image = page.locator(active).getByTestId("hero-carousel-media");
    const bounds = (await image.boundingBox())!;
    expect(bounds.width / bounds.height).toBeCloseTo(1.25, 2);
    await expect(image.locator("img")).toHaveCSS("object-fit", "contain");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
});
