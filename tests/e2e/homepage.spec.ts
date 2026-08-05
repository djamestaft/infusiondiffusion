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
    page.getByRole("heading", { level: 2, name: "Born from fragrance" }),
  ).toBeVisible();
  await expect(page.getByText(/8–12 months/)).toBeVisible();
  await expect(page.getByText(/Jacqui Kirchmann/)).toBeVisible();
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
