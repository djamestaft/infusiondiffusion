import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("adds, persists, updates and removes a Shopify fixture cart", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto("/products/bois-de-santal-200ml");
  await page.getByRole("button", { name: "Add to bag" }).click();
  await expect(page.getByRole("dialog")).toContainText("Added to your bag");
  await expect(
    page.locator('a[aria-label="Cart, 1 item"]').first(),
  ).toBeAttached();
  const cookie = (await page.context().cookies()).find(
    (item) => item.name === "infusion_cart",
  );
  expect(cookie).toMatchObject({ httpOnly: true, sameSite: "Lax" });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Add to bag" })).toBeFocused();
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.getByRole("link", { name: "Review your bag" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Your bag" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Checkout unavailable" }),
  ).toBeDisabled();
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
  await page.getByRole("button", { name: /Increase Bois De Santal/ }).click();
  await expect(page.getByLabel("Quantity 3")).toBeVisible();
  await expect(
    page.getByText("3 items held for this visit.", { exact: false }),
  ).toBeVisible();
  await expect(
    page.locator('a[aria-label="Cart, 3 items"]').first(),
  ).toBeAttached();
  await page.reload();
  await expect(page.getByLabel("Quantity 3")).toBeVisible();
  await page.setViewportSize({ width: 320, height: 568 });
  const controls = await Promise.all([
    page.getByRole("button", { name: /Decrease Bois De Santal/ }).boundingBox(),
    page.getByLabel("Quantity 3").boundingBox(),
    page.getByRole("button", { name: /Increase Bois De Santal/ }).boundingBox(),
  ]);
  expect(new Set(controls.map((box) => box?.y)).size).toBe(1);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
  await page.getByRole("button", { name: "Remove" }).click();
  await expect(
    page.getByRole("heading", { name: "Your bag is empty" }),
  ).toBeVisible();
  expect(consoleErrors).toEqual([]);
});
