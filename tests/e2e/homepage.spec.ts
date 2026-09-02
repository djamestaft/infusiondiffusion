import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const approvedHomeViewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small", width: 320, height: 844 },
] as const;

const homeStoryUrl = (story: string) =>
  `http://127.0.0.1:6006/iframe.html?id=templates-storefront--${story}&viewMode=story`;

for (const viewport of approvedHomeViewports) {
  test(`preserves the approved Home composition at ${viewport.width}px`, async ({
    page,
  }) => {
    test.setTimeout(60_000);
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/", { waitUntil: "domcontentloaded" });

    const orderedSections = [
      page.getByRole("heading", { level: 1 }),
      page.getByRole("heading", { name: "A cabinet of atmosphere" }),
      page.getByRole("heading", {
        name: "Choose by the room, then by the feeling",
      }),
      page.getByRole("region", { name: "Bespoke diffusers" }),
      page.getByRole("heading", { name: "Made to linger" }),
      page.getByRole("heading", { name: "Artistry in Fragrance" }),
      page.getByRole("heading", { name: "Made meaningful by the details" }),
      page.getByRole("heading", {
        name: "Six fragrances. A roomful of possibility.",
      }),
    ];

    const positions: number[] = [];
    for (const section of orderedSections) {
      await expect(section).toBeVisible();
      positions.push((await section.boundingBox())!.y);
    }
    expect(positions).toEqual([...positions].sort((a, b) => a - b));
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(viewport.width);

    for (const action of await page
      .getByRole("link", { name: /Shop the collection|Discover our story/ })
      .all()) {
      const box = await action.boundingBox();
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }

    if (process.env.SAVE_HOME_EVIDENCE) {
      await page.screenshot({
        path: `docs/features/evidence/home-${viewport.width}.png`,
        fullPage: true,
      });
    }
  });
}

test("renders Home SEO metadata from the site-settings boundary", async ({
  page,
}) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page).toHaveTitle("Infusion Diffusion");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /room sprays, reed diffusers, and candles/i,
  );
});

test("reflows Home long content and preserves an empty-catalogue recovery", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto(homeStoryUrl("home-long-content"), {
    waitUntil: "domcontentloaded",
  });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
    timeout: 20_000,
  });
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);

  await page.goto(homeStoryUrl("home-empty-catalogue"), {
    waitUntil: "domcontentloaded",
  });
  await expect(
    page.getByText("The collection is being prepared.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Shop the collection" }).first(),
  ).toHaveAttribute("href", "/shop");
});

test("renders the live homepage journey accessibly", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");

  const navigationHeader = page
    .getByRole("navigation", { name: "Primary" })
    .locator("..");
  await expect(navigationHeader).toHaveCSS("border-bottom-style", "solid");
  await expect(navigationHeader).toHaveCSS(
    "border-bottom-color",
    "rgb(197, 164, 71)",
  );
  await expect(navigationHeader).toHaveCSS(
    "width",
    `${await page.evaluate(() => document.documentElement.clientWidth)}px`,
  );

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Fragrance, composed for the rooms you live in",
    }),
  ).toBeVisible();
  const collectionLinks = page.getByRole("link", {
    name: "Shop the collection",
  });
  await expect(collectionLinks).toHaveCount(2);
  await expect(collectionLinks.first()).toHaveAttribute("href", "/shop");
  await expect(collectionLinks.last()).toHaveAttribute("href", "/shop");
  await expect(page.getByText(/R\s?(395|430)/).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /^View / }).first(),
  ).toHaveAttribute("href", /\/products\//);
  await expect(
    page.getByRole("heading", { level: 2, name: "Artistry in Fragrance" }),
  ).toBeVisible();
  await expect(page.getByText(/8–12 months/)).toBeVisible();
  await expect(page.getByText(/Designed for themed elegance/)).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Discover our story" }),
  ).toHaveAttribute("href", "/about");
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("reveals each following section at the viewport edge", async ({
  page,
}) => {
  await page.goto("/");

  const waitingReveals = page.locator(
    '[data-scroll-reveal][data-reveal-state="waiting"]',
  );
  await expect.poll(() => waitingReveals.count()).toBeGreaterThan(0);
  await waitingReveals
    .first()
    .evaluate((element) => element.setAttribute("data-e2e-target", ""));
  const nextSection = page.locator("[data-e2e-target]");

  await nextSection.scrollIntoViewIfNeeded();
  await expect(nextSection).toHaveAttribute("data-reveal-state", "visible");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(nextSection).toHaveCSS("opacity", "1");
  await expect(nextSection).toHaveCSS("transform", "none");
});

test("reports a healthy deployment", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok" });
});

test("keeps the hero, CTA, and navigation divider intact at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Shop the collection" }).first(),
  ).toHaveAttribute("href", "/shop");
  const navigationHeader = page
    .getByRole("navigation", { name: "Primary" })
    .locator("..");
  await expect(navigationHeader).toHaveCSS(
    "border-bottom-color",
    "rgb(197, 164, 71)",
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});

test("renders the full-width elevated cabinet band with exact spacing", async ({
  page,
}, testInfo) => {
  await page.goto("/");
  const expectedGap = testInfo.project.name === "mobile" ? 52 : 72;
  const band = page.getByTestId("home-cabinet-band");
  const inner = page.getByTestId("home-cabinet-inner");
  const hero = page.getByTestId("home-hero-section");
  const heading = page.getByRole("heading", {
    name: "A cabinet of atmosphere",
  });
  const firstCard = page.getByRole("link", { name: /^View / }).first();
  await band.scrollIntoViewIfNeeded();
  await expect(band).toBeVisible();
  const [bandBox, innerBox, heroBox, headingBox] = await Promise.all([
    band.boundingBox(),
    inner.boundingBox(),
    hero.boundingBox(),
    heading.boundingBox(),
  ]);
  expect(bandBox).not.toBeNull();
  expect(innerBox).not.toBeNull();
  expect(heroBox).not.toBeNull();
  expect(headingBox).not.toBeNull();
  expect(bandBox!.width).toBe(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
  expect(innerBox!.width).toBeLessThanOrEqual(1280);
  expect(headingBox!.y - (heroBox!.y + heroBox!.height)).toBe(expectedGap);
  const controls = page.getByTestId("hero-carousel-controls");
  if (await controls.count()) {
    const controlsBox = await controls.boundingBox();
    expect(controlsBox).not.toBeNull();
    expect(headingBox!.y - (controlsBox!.y + controlsBox!.height)).toBe(
      expectedGap,
    );
  }
  await expect(band).toHaveCSS("background-color", "rgb(227, 231, 218)");
  await expect(band).toHaveCSS("border-top-width", "0px");
  await expect(band).toHaveCSS("box-shadow", "none");
  await expect(firstCard).toHaveCSS("background-color", "rgb(238, 240, 231)");
  await expect(firstCard).toHaveCSS("border-top-width", "0px");
  await expect(firstCard).toHaveCSS("box-shadow", "none");
});

test("supports keyboard pagination and manual pause/play", async ({ page }) => {
  test.skip(
    test.info().project.name === "mobile",
    "Keyboard flow is desktop-specific",
  );
  await page.goto("/e2e-carousel");
  const carousel = page.getByLabel("Homepage campaign imagery");
  await expect(carousel).toHaveAttribute("data-autoplay", "running");
  await expect(
    page.getByRole("button", { name: "Pause carousel" }),
  ).toBeVisible();

  const third = page.getByRole("button", { name: "Show slide 3 of 3" });
  await third.focus();
  await page.keyboard.press("Enter");
  await expect(third).toHaveAttribute("aria-current", "true");
  await expect(carousel).toHaveAttribute("data-autoplay", "paused");
  await expect(
    page.getByText("Slide 3 of 3", { exact: true }).last(),
  ).toHaveAttribute("aria-live", "polite");

  const play = page.getByRole("button", { name: "Play carousel" });
  await play.click();
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await expect(carousel).toHaveAttribute("data-autoplay", "running");
  await page.getByRole("button", { name: "Pause carousel" }).click();
  await expect(carousel).toHaveAttribute("data-autoplay", "paused");
});

test("renders responsive corner brackets outside the image", async ({
  page,
}, testInfo) => {
  await page.goto("/e2e-carousel");
  const mobile = testInfo.project.name === "mobile";
  const expected = mobile
    ? { clearance: 12, offset: 8, arm: 40, gap: 20 }
    : { clearance: 20, offset: 12, arm: 56, gap: 24 };
  const stage = page.getByTestId("hero-carousel-stage");
  const media = page.getByTestId("hero-carousel-media");
  const controls = page.getByTestId("hero-carousel-controls");
  const topLeft = page.getByTestId("hero-carousel-bracket-top-left");
  const topRight = page.getByTestId("hero-carousel-bracket-top-right");
  const bottomLeft = page.getByTestId("hero-carousel-bracket-bottom-left");
  const bottomRight = page.getByTestId("hero-carousel-bracket-bottom-right");
  const [
    stageBox,
    mediaBox,
    controlsBox,
    topLeftBox,
    topRightBox,
    bottomLeftBox,
    bottomRightBox,
  ] = await Promise.all([
    stage.boundingBox(),
    media.boundingBox(),
    controls.boundingBox(),
    topLeft.boundingBox(),
    topRight.boundingBox(),
    bottomLeft.boundingBox(),
    bottomRight.boundingBox(),
  ]);
  expect(stageBox).not.toBeNull();
  expect(mediaBox).not.toBeNull();
  expect(controlsBox).not.toBeNull();
  expect(topLeftBox).not.toBeNull();
  expect(topRightBox).not.toBeNull();
  expect(bottomLeftBox).not.toBeNull();
  expect(bottomRightBox).not.toBeNull();
  expect(mediaBox!.x - stageBox!.x).toBe(expected.clearance);
  expect(mediaBox!.x - topLeftBox!.x).toBe(expected.offset);
  expect(mediaBox!.y - topLeftBox!.y).toBe(expected.offset);
  expect(
    topRightBox!.x + topRightBox!.width - (mediaBox!.x + mediaBox!.width),
  ).toBe(expected.offset);
  expect(mediaBox!.y - topRightBox!.y).toBe(expected.offset);
  expect(mediaBox!.x - bottomLeftBox!.x).toBe(expected.offset);
  expect(
    bottomLeftBox!.y + bottomLeftBox!.height - (mediaBox!.y + mediaBox!.height),
  ).toBe(expected.offset);
  expect(
    bottomRightBox!.x + bottomRightBox!.width - (mediaBox!.x + mediaBox!.width),
  ).toBe(expected.offset);
  expect(
    bottomRightBox!.y +
      bottomRightBox!.height -
      (mediaBox!.y + mediaBox!.height),
  ).toBe(expected.offset);
  for (const bracketBox of [
    topLeftBox,
    topRightBox,
    bottomLeftBox,
    bottomRightBox,
  ]) {
    expect(bracketBox!.width).toBe(expected.arm);
    expect(bracketBox!.height).toBe(expected.arm);
  }
  expect(controlsBox!.y - (stageBox!.y + stageBox!.height)).toBe(expected.gap);
  expect(
    Math.abs(
      controlsBox!.x +
        controlsBox!.width / 2 -
        (stageBox!.x + stageBox!.width / 2),
    ),
  ).toBeLessThan(1);
  await expect(media).toHaveCSS("border-radius", "8px");
  for (const { locator, radius, borders } of [
    {
      locator: topLeft,
      radius: "border-top-left-radius",
      borders: ["border-top-width", "border-left-width"],
    },
    {
      locator: topRight,
      radius: "border-top-right-radius",
      borders: ["border-top-width", "border-right-width"],
    },
    {
      locator: bottomLeft,
      radius: "border-bottom-left-radius",
      borders: ["border-bottom-width", "border-left-width"],
    },
    {
      locator: bottomRight,
      radius: "border-bottom-right-radius",
      borders: ["border-bottom-width", "border-right-width"],
    },
  ]) {
    await expect(locator).toHaveCSS(radius, "8px");
    for (const border of borders)
      await expect(locator).toHaveCSS(border, "1px");
    await expect(locator).toHaveCSS("box-shadow", "none");
    await expect(locator).toHaveCSS("background-image", "none");
  }
  const bracketPixel = await topLeft.evaluate((element) => {
    const color = getComputedStyle(element).borderTopColor;
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data];
  });
  expect(bracketPixel).toEqual([197, 164, 71, 140]);
});

test("restarts a full cycle after explicit pause and play", async ({
  page,
}) => {
  test.skip(
    test.info().project.name === "mobile",
    "Timing contract runs deterministically in Chromium",
  );
  await page.goto("/e2e-carousel");
  const first = page.getByRole("button", { name: "Show slide 1 of 3" });
  await page.waitForTimeout(1_200);
  await page.getByRole("button", { name: "Pause carousel" }).click();
  await expect(page.locator(".hero-carousel-progress")).toHaveCount(0);
  await page.waitForTimeout(2_000);
  await expect(first).toHaveAttribute("aria-current", "true");

  await page.getByRole("button", { name: "Play carousel" }).click();
  await expect(page.locator(".hero-carousel-progress")).toHaveCSS(
    "animation-duration",
    "3s",
  );
  await page.waitForTimeout(2_750);
  await expect(first).toHaveAttribute("aria-current", "true");
  await page.waitForTimeout(500);
  await expect(
    page.getByRole("button", { name: "Show slide 2 of 3" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(page.getByLabel("Homepage campaign imagery")).toHaveAttribute(
    "data-autoplay",
    "running",
  );
});

test("suppresses autoplay for reduced motion", async ({ page }) => {
  test.skip(
    test.info().project.name === "mobile",
    "Covered in the Chromium media-emulation contract",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/e2e-carousel");
  await expect(page.getByLabel("Homepage campaign imagery")).toHaveAttribute(
    "data-autoplay",
    "paused",
  );
  await expect(
    page.getByRole("button", { name: "Autoplay unavailable" }),
  ).toBeDisabled();
});

test("autoplays continuously every three seconds and ignores hover", async ({
  page,
}) => {
  test.skip(
    test.info().project.name === "mobile",
    "Timing contract runs deterministically in Chromium",
  );
  test.setTimeout(40_000);
  await page.goto("/e2e-carousel");
  await expect(page.getByLabel("Homepage campaign imagery")).toHaveAttribute(
    "data-autoplay",
    "running",
  );
  const carousel = page.getByLabel("Homepage campaign imagery");
  await carousel.hover();
  await expect(carousel).toHaveAttribute("data-autoplay", "running");
  await expect(page.locator(".hero-carousel-progress")).toHaveCSS(
    "animation-duration",
    "3s",
  );
  await page.waitForTimeout(3_250);
  await expect(
    page.getByRole("button", { name: "Show slide 2 of 3" }),
  ).toHaveAttribute("aria-current", "true");
  await page.waitForTimeout(3_250);
  await expect(
    page.getByRole("button", { name: "Show slide 3 of 3" }),
  ).toHaveAttribute("aria-current", "true");
  await page.waitForTimeout(3_250);
  await expect(
    page.getByRole("button", { name: "Show slide 1 of 3" }),
  ).toHaveAttribute("aria-current", "true");
  await expect(carousel).toHaveAttribute("data-autoplay", "running");
});
