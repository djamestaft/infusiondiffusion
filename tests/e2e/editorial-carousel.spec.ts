import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [1440, 768, 390, 320]) {
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
    await expect(header).toHaveCSS("height", "64px");
    const hero = page.getByTestId("home-hero-section");
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
