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
      .getByRole("link", { name: "Skip fragrance collection" })
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
    await page.goto("/about");
    await expect(page.locator("[data-testid^='about-chapter-']")).toHaveCount(
      4,
    );
    const photograph = page
      .getByTestId("about-chapter-principles")
      .getByRole("button", { name: /^View / });
    await photograph.scrollIntoViewIfNeeded();
    await photograph.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(photograph).toBeFocused();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("static HTML works with JavaScript disabled", async ({
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
