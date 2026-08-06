import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small", width: 320, height: 844 },
]) {
  test(`renders the text-first About fallback accessibly at ${viewport.name}`, async ({
    page,
    request,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    await page.setViewportSize(viewport);
    await page.goto("/about");
    await expect(page).toHaveTitle(
      "About Infusion Diffusion | Infusion Diffusion",
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Discover the Infusion Diffusion story, from more than 130 fragrance oils to six fragrances composed for lived-in rooms.",
    );
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "The story behind the atmosphere.",
      }),
    ).toBeVisible();
    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(5);
    await expect(
      page.getByRole("link", { name: /Explore the Fragrance Guide/i }),
    ).toHaveAttribute("href", "/fragrance-guide");
    const about = page.locator('a[aria-current="page"]:visible', {
      hasText: "About",
    });
    if (!(await about.isVisible()))
      await page.getByRole("button", { name: "Open menu" }).click();
    await expect(about).toBeVisible();
    await expect(
      page.locator('[data-testid="about-chapter-origin"]'),
    ).toHaveCSS("background-color", "rgb(245, 241, 232)");
    await expect(
      page.locator('[data-testid="about-chapter-development"]'),
    ).toHaveCSS("background-color", "rgb(238, 240, 231)");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(
      await page.evaluate(() => document.documentElement.clientWidth),
    );
    expect((await request.get("/api/health")).ok()).toBeTruthy();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    expect(
      consoleErrors.filter(
        (message) =>
          !message.includes("Unable to load Sanity About page") &&
          !message.includes("j222nd1i.api.sanity.io") &&
          !message.includes("net::ERR_FAILED"),
      ),
    ).toEqual([]);
  });
}
