import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the live homepage journey accessibly", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Fragrance, composed for the rooms you live in",
    }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Shop the collection" }),
  ).toHaveAttribute("href", "/shop");
  await expect(page.getByText(/R\s?(395|430)/).first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: /^View / }).first(),
  ).toHaveAttribute("href", /\/products\//);
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

test("reports a healthy deployment", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok" });
});
