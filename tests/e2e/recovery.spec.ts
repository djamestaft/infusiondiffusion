import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [390, 1440]) {
  test(`keeps product and cart usable after image failures at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.route("**/_next/image?**", (route) => route.abort());
    await page.goto("/products/bois-de-santal-200ml");
    await expect(
      page.getByText("Image unavailable", { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { level: 1, name: "Bois De Santal" }),
    ).toBeVisible();
    const frame = page.getByText("Image unavailable", { exact: true });
    expect((await frame.boundingBox())!.height).toBeGreaterThanOrEqual(280);
    await page
      .getByRole("button", { name: "Add to cart", exact: true })
      .click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.getByRole("link", { name: "Review your bag" }).click();
    await expect(
      page.getByText("Image unavailable", { exact: true }),
    ).toBeVisible();
    expect(
      (await page
        .getByText("Image unavailable", { exact: true })
        .boundingBox())!.height,
    ).toBe(118);
    await expect(
      page.getByRole("button", { name: /Increase Bois/ }),
    ).toBeEnabled();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    expect(
      (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
        .violations,
    ).toEqual([]);
    await page.getByRole("button", { name: "Remove", exact: true }).click();
    await expect(
      page.getByRole("heading", { name: "Your bag is empty" }),
    ).toBeVisible();
  });
}

test("restores confirmed quantity after a failed update and allows retry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/products/bois-de-santal-200ml");
  await page.getByRole("button", { name: "Add to cart", exact: true }).click();
  await page.getByRole("link", { name: "Review your bag" }).click();
  await page.route("**/cart", (route) =>
    route.request().method() === "POST"
      ? route.fulfill({ status: 500, body: "Simulated failure" })
      : route.continue(),
  );
  await page.getByRole("button", { name: /Increase Bois/ }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText(
    "last confirmed selection",
  );
  await expect(page.getByLabel("Quantity 1", { exact: true })).toBeVisible();
  await page.unroute("**/cart");
  await page.getByRole("button", { name: /Increase Bois/ }).click();
  await expect(
    page.getByRole("button", { name: /Increase Bois/ }),
  ).toBeEnabled();
  await expect(page.getByLabel("Quantity 2", { exact: true })).toBeVisible();
  await expect(page.locator("main").getByRole("alert")).toHaveCount(0);
  await page.reload();
  await expect(page.getByLabel("Quantity 2", { exact: true })).toBeVisible();
});
