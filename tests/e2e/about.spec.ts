import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the text-first About fallback accessibly", async ({ page }) => {
  await page.goto("/about");
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
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});
