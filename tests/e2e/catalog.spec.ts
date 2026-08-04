import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of ["/shop", "/products/bois-de-santal-200ml"]) {
  test(`${path} renders live catalogue content accessibly`, async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });

    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText(/R\s?(395|430)/).first()).toBeVisible();
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
}

test("collection cards navigate to a live product without a false purchase action", async ({
  page,
}) => {
  await page.goto("/shop");
  await page.getByRole("link", { name: "View Bois De Santal" }).click();
  await expect(page).toHaveURL(/\/products\/bois-de-santal-200ml$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Bois De Santal" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Add to bag" })).toHaveCount(0);
});

test("unknown product handles return 404", async ({ page }) => {
  await page.goto("/products/not-a-real-fragrance");
  await expect(
    page.getByRole("heading", { name: "This page could not be found." }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
    "content",
    /noindex/,
  );
});
