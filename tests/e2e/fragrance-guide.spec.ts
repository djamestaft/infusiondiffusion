import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the Sanity-backed fragrance guide accessibly", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/fragrance-guide");
  await expect(page).toHaveTitle(
    "A practical home fragrance guide | Infusion Diffusion",
  );

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "A practical guide to choosing home fragrance",
    }),
  ).toBeVisible();
  const currentLink = page.locator('a[aria-current="page"]:visible', {
    hasText: "Fragrance Guide",
  });
  if (!(await currentLink.isVisible())) {
    await page.getByRole("button", { name: "Open menu" }).click();
  }
  await expect(currentLink).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(4);
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
