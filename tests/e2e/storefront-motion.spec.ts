import { expect, test } from "@playwright/test";

test.describe("Home and About motion enhancement", () => {
  test("desktop pins with reversible travel, then restores natural flow", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Fine-pointer desktop enhancement");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    const collection = page.getByTestId("home-cabinet-band");
    await expect(collection).toHaveAttribute("data-motion-active", "true");
    const track = collection.locator("[data-motion-track]");
    const top = await collection.evaluate(
      (element) => element.getBoundingClientRect().top + scrollY,
    );
    const x = () =>
      track.evaluate(
        (element) => new DOMMatrix(getComputedStyle(element).transform).m41,
      );
    await page.evaluate((y) => scrollTo(0, y), top + 500);
    await expect.poll(x).toBeLessThan(-100);
    const forward = await x();
    await page.evaluate((y) => scrollTo(0, y), top + 100);
    await expect.poll(x).toBeGreaterThan(forward + 50);
    await collection
      .getByRole("button", { name: "View without motion" })
      .click();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(collection).not.toHaveAttribute("data-motion-active", "true");
    await expect(
      collection.getByRole("link", { name: /^View / }).last(),
    ).toBeVisible();
  });

  test("keyboard products and skip remain reachable", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Keyboard desktop enhancement");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    const collection = page.getByTestId("home-cabinet-band");
    await expect(collection).toHaveAttribute("data-motion-active", "true");
    const last = collection.getByRole("link", { name: /^View / }).last();
    await last.focus();
    await expect(last).toBeFocused();
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    const bounds = await last.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(1440);
    await collection
      .getByRole("link", { name: /Skip (fragrance )?collection/ })
      .click();
    await expect(page.locator("#home-guidance-title")).toBeFocused();
  });

  test("live preferences, short viewports and resize clean up the owned pin", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Desktop lifecycle");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    await page.setViewportSize({ width: 1440, height: 650 });
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });

  test("ten route remounts do not accumulate pins", async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Desktop lifecycle");
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/");
    for (let i = 0; i < 10; i++) {
      await expect(page.locator(".pin-spacer")).toHaveCount(1);
      await page.locator("a[href='/about']").first().click();
      await expect(page.getByTestId("about-page")).toBeVisible();
      await expect(page.locator(".pin-spacer")).toHaveCount(0);
      await page
        .getByRole("link", { name: "Infusion Diffusion home" })
        .first()
        .click();
    }
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
  });

  test("About gallery interruption restores focus and all four chapters", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    // Keep the live route contract, then exercise interruption with deterministic
    // photographs: CI intentionally has no published Sanity dataset.
    await page.goto("/about");
    await expect(page.locator("[data-testid^='about-chapter-']")).toHaveCount(
      4,
    );
    await page.goto(
      `${process.env.STORYBOOK_BASE_URL ?? "http://127.0.0.1:6006"}/iframe.html?id=templates-combined-about--motion-chapters&viewMode=story`,
    );
    if (!(await page.evaluate(() => matchMedia("(pointer: coarse)").matches)))
      await expect(page.locator("[data-motion-chapter]")).toHaveCount(4);
    await expect(page.locator("[data-testid^='about-chapter-']")).toHaveCount(
      4,
    );
    const photograph = page
      .getByTestId("about-chapter-principles")
      .getByRole("button", { name: /^View / });
    await photograph.scrollIntoViewIfNeeded();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const before = await page.evaluate(() => scrollY);
    const bounds = (await photograph.boundingBox())!;
    await page.mouse.click(
      bounds.x + bounds.width / 2,
      bounds.y + bounds.height / 2,
    );
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => scrollY)).toBeCloseTo(before, 0);
    await page.keyboard.press("Escape");
    await expect(photograph).toBeFocused();
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await page.waitForTimeout(500);
    await expect
      .poll(() => page.evaluate(() => scrollY))
      .toBeCloseTo(before, 0);
  });

  test("known baseline: full-route no-JS streaming remains unsupported", async ({
    browser,
    baseURL,
  }) => {
    test.fail(
      true,
      "Existing Cache Components streaming hides full-page Suspense content without JavaScript; tracked in motion evidence.",
    );
    const context = await browser.newContext({
      javaScriptEnabled: false,
      baseURL,
      viewport: { width: 390, height: 844 },
    });
    const page = await context.newPage();
    for (const route of ["/", "/about"]) {
      await page.goto(route);
      await expect(
        page.getByRole("heading", { level: 1 }).first(),
      ).toBeVisible();
      await expect(page.locator(".pin-spacer")).toHaveCount(0);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
    await context.close();
  });
});

test("a failed GSAP module leaves all source products usable", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Only eligible desktop attempts GSAP imports");
  await page.setViewportSize({ width: 1440, height: 1000 });
  let blocked = 0;
  await page.route("**/_next/static/chunks/*.js", async (route) => {
    const response = await route.fetch();
    const body = await response.text();
    if (body.includes("Invalid property") && body.includes("gsap")) {
      blocked++;
      await route.abort("failed");
    } else await route.fulfill({ response });
  });
  await page.goto("/");
  await expect.poll(() => blocked).toBeGreaterThan(0);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  const collection = page.getByTestId("home-cabinet-band");
  await expect(
    collection.getByRole("link", { name: /^View / }).last(),
  ).toBeVisible();
  await expect(
    collection.getByRole("link", { name: "Shop all fragrances" }),
  ).toHaveAttribute("href", "/shop");
  await page.unrouteAll({ behavior: "wait" });
});

test("reduced motion and data saving do not fetch GSAP", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop eligibility is the variable under test");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  const imports: Promise<string | null>[] = [];
  page.on("response", (response) => {
    if (response.request().resourceType() === "script")
      imports.push(
        response
          .text()
          .then((body) =>
            body.includes("Invalid property") && body.includes("gsap")
              ? response.url()
              : null,
          )
          .catch(() => null),
      );
  });
  await page.goto("/");
  await expect(page.getByTestId("home-cabinet-band")).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect((await Promise.all(imports)).filter(Boolean)).toEqual([]);
  await page.goto("about:blank");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() =>
    Object.defineProperty(navigator, "connection", {
      configurable: true,
      value: { saveData: true },
    }),
  );
  imports.length = 0;
  await page.goto("/");
  await expect(page.getByTestId("home-cabinet-band")).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect((await Promise.all(imports)).filter(Boolean)).toEqual([]);
});

test("pointer depth is bounded, settles, and stops on focus", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Fine pointer effect");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect(page.getByTestId("home-cabinet-band")).toHaveAttribute(
    "data-motion-active",
    "true",
  );
  const backdrop = page.locator("[data-motion-backdrop]");
  await page.evaluate(() => document.fonts.ready);
  await expect
    .poll(async () => {
      // Keep real pointer input active while late font/image measurements settle.
      await page.mouse.move(1100, 350);
      await page.mouse.move(1200, 400);
      return backdrop.evaluate((element) => element.style.transform);
    })
    .toContain("translate3d");
  const position = await backdrop.evaluate((element) => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return { x: matrix.m41, y: matrix.m42 };
  });
  expect(Math.abs(position.x)).toBeLessThanOrEqual(18);
  expect(Math.abs(position.y)).toBeLessThanOrEqual(12);
  await page.getByTestId("home-hero-section").getByRole("link").first().focus();
  await expect(backdrop).toHaveCSS(
    "transform",
    "matrix(1.04, 0, 0, 1.04, 0, 0)",
  );
});

test("a partially clipped first product switches to static on keyboard focus", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Fine-pointer desktop pin");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  const collection = page.getByTestId("home-cabinet-band");
  await expect(collection).toHaveAttribute("data-motion-active", "true");
  const top = await collection.evaluate(
    (e) => e.getBoundingClientRect().top + scrollY,
  );
  await page.evaluate((y) => scrollTo(0, y), top - 142 + 35);
  const first = collection.getByRole("link", { name: /^View / }).first();
  await expect
    .poll(() => first.evaluate((e) => e.getBoundingClientRect().left))
    .toBeLessThan(64);
  await first.focus();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(first).toBeFocused();
});

for (const viewport of [
  { width: 1440, height: 800 },
  { width: 1366, height: 768 },
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
]) {
  test(`normal laptop ${viewport.width}x${viewport.height} has a complete usable pin`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Fine-pointer laptop composition");
    await page.setViewportSize(viewport);
    await page.goto("/");
    const collection = page.getByTestId("home-cabinet-band");
    await expect(collection).toHaveAttribute("data-motion-active", "true");
    const box = (await collection.boundingBox())!;
    const top = await page
      .locator('nav[aria-label="Primary"]')
      .evaluate((e) => e.closest("header")!.getBoundingClientRect().bottom);
    expect(box.height).toBeLessThanOrEqual(viewport.height - top - 28);
    const card = collection.getByRole("link", { name: /^View / }).first();
    expect((await card.boundingBox())!.width).toBeGreaterThanOrEqual(250);
    const skip = collection.getByRole("link", {
      name: /Skip (fragrance )?collection/,
    });
    await skip.click();
    await expect(page.locator("#home-guidance-title")).toBeFocused();
  });
}
