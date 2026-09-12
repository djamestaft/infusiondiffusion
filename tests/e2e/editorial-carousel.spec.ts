import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [1900, 1440, 1280, 1024, 768, 390, 320]) {
  test(`editorial carousel and floating navigation at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/e2e-carousel?editorial=1");
    await page.evaluate(() => document.fonts.ready);
    const header = page.locator("header");
    await expect(header).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
    await expect(header).toHaveCSS("height", width >= 1024 ? "86px" : "78px");
    expect(
      await header.evaluate((n) => getComputedStyle(n, "::after").content),
    ).toBe("none");
    if (width >= 1024) {
      const heading = (await page
        .getByRole("heading", { level: 1 })
        .boundingBox())!;
      const previous = (await page
        .getByRole("button", { name: "Previous slide" })
        .boundingBox())!;
      if (width >= 1536) {
        expect(previous.x + previous.width / 2).toBeCloseTo(heading.x / 2, 0);
      } else {
        expect(heading.x - previous.x - previous.width).toBeGreaterThanOrEqual(
          40,
        );
      }
    }
    const hero = page.getByTestId("home-hero-section");
    await expect(hero).toBeVisible();
    const media = page.getByTestId("hero-carousel-media").first();
    await expect(media).toHaveCSS("border-top-width", "1px");
    await expect(media).toHaveCSS("border-top-color", "rgb(197, 164, 71)");
    const counter = page.locator("[data-carousel-rotation]");
    await expect(counter.locator("svg")).toHaveCount(0);
    await expect(counter).toHaveCSS("font-size", "11px");
    await expect(counter).toHaveCSS("color", "rgb(197, 164, 71)");
    const mediaBox = (await media.boundingBox())!;
    const counterBox = (await counter.boundingBox())!;
    expect(counterBox.x + counterBox.width / 2).toBeCloseTo(
      mediaBox.x + mediaBox.width / 2,
      0,
    );

    const height = (await hero.boundingBox())!.height;
    const next = page.getByRole("button", { name: "Next slide" });
    await next.click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Campaign 2",
    );
    await expect(
      page.getByRole("link", { name: "Find your fragrance" }),
    ).toHaveAttribute("href", "/fragrance-guide");
    expect((await hero.boundingBox())!.height).toBe(height);
    await page.keyboard.press("ArrowLeft");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Campaign 1",
    );
    await page.evaluate(() => scrollTo(0, 100));
    await expect(header).toHaveCSS("background-color", "rgb(25, 25, 22)");
    await expect(header).toHaveCSS("height", width >= 1024 ? "86px" : "78px");
    expect(
      await header.evaluate(
        (n) => getComputedStyle(n, "::after").backgroundColor,
      ),
    ).toBe("rgb(197, 164, 71)");
    if (width < 1024) {
      const opener = page.getByRole("button", { name: "Open menu" });
      await opener.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await page.keyboard.press("Shift+Tab");
      await expect(dialog.getByRole("link", { name: "Contact" })).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(opener).toBeFocused();
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    const audit = await new AxeBuilder({ page }).analyze();
    expect(audit.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("slides horizontally without fading, reverses, and wraps cleanly", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/e2e-carousel?editorial=1");
  const next = page.getByRole("button", { name: "Next slide" });
  const previous = page.getByRole("button", { name: "Previous slide" });
  const sample = async () =>
    page
      .locator(
        ".hero-editorial-panel[data-phase='enter'], .hero-editorial-panel[data-phase='exit']",
      )
      .evaluateAll((nodes) =>
        nodes.map((node) => {
          const animation = node.getAnimations()[0];
          if (!animation)
            throw new Error("Expected horizontal slide animation");
          animation.pause();
          animation.currentTime = 300;
          const style = getComputedStyle(node);
          return {
            phase: node.getAttribute("data-phase"),
            x: new DOMMatrixReadOnly(style.transform).m41,
            opacity: style.opacity,
            width: node.getBoundingClientRect().width,
          };
        }),
      );
  const viewport = page.getByTestId("hero-carousel-viewport");
  const finish = async () => {
    await page
      .locator(".hero-editorial-panel")
      .evaluateAll((nodes) =>
        nodes.forEach((n) => n.getAnimations().forEach((a) => a.finish())),
      );
    await expect(
      page.locator(".hero-editorial-panel[data-phase='enter']"),
    ).toHaveCount(0);
  };
  await next.click();
  let panels = await sample();
  await expect(viewport).not.toHaveCSS("mask-image", "none");
  expect(panels.find((p) => p.phase === "enter")!.x).toBeGreaterThan(0);
  expect(panels.find((p) => p.phase === "exit")!.x).toBeLessThan(0);
  expect(panels.map((p) => p.opacity)).toEqual(["1", "1"]);
  await finish();
  await expect(viewport).toHaveCSS("mask-image", "none");
  await previous.click();
  panels = await sample();
  expect(panels.find((p) => p.phase === "enter")!.x).toBeLessThan(0);
  expect(panels.find((p) => p.phase === "exit")!.x).toBeGreaterThan(0);
  await finish();
  await previous.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Campaign 3",
  );
  await finish();
  await next.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Campaign 1",
  );
  panels = await sample();
  expect(panels.find((p) => p.phase === "enter")!.x).toBeGreaterThan(0);
  await finish();
  await next.click();
  await next.click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Campaign 3",
  );
  await finish();
  await expect(
    page.locator('.hero-editorial-panel[data-phase="idle"]'),
  ).toHaveCount(1);
});

test("autoplay advances, offers a pause control and stops outside the viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/e2e-carousel?editorial=1");
  const hero = page.getByTestId("home-hero-section");
  await expect(hero).toHaveAttribute("data-autoplay", "running");
  await page.clock.runFor(6_650);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Campaign 2",
  );
  await page.getByRole("button", { name: "Pause carousel" }).click();
  await page.clock.runFor(12_000);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Campaign 2",
  );
  await page.getByRole("button", { name: "Play carousel" }).click();
  await page.mouse.move(20, 20);
  await expect(hero).toHaveAttribute("data-autoplay", "running");
  await page.clock.runFor(6_650);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Campaign 3",
  );
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await expect(hero).toHaveAttribute("data-autoplay", "paused");
  await page.clock.runFor(12_000);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Campaign 3",
  );
});

for (const [width, height] of [
  [1280, 650],
  [1440, 700],
  [375, 667],
  [390, 844],
  [320, 568],
]) {
  test(`counter fits short viewport ${width}x${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/e2e-carousel?editorial=1");
    const counter = page.locator("[data-carousel-rotation]");
    await expect(counter).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const box = (await counter.boundingBox())!;
    expect(box.y + box.height).toBeLessThanOrEqual(height);
    await expect(page.getByTestId("hero-carousel-media").first()).toBeVisible();
  });
}
