import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const closeWith of [
  "Escape",
  "Continue shopping",
  "Close and move focus",
]) {
  test(`returns focus after closing the drawer with ${closeWith} during a delayed refresh`, async ({
    page,
  }) => {
    await page.setViewportSize({
      width: closeWith === "Escape" ? 1440 : 390,
      height: 900,
    });
    let releaseRefresh!: () => void;
    const refreshGate = new Promise<void>((resolve) => {
      releaseRefresh = resolve;
    });
    let refreshHeld = false;
    await page.route("**/products/bois-de-santal-200ml*", async (route) => {
      if (
        route.request().method() === "GET" &&
        route.request().headers().rsc === "1"
      ) {
        refreshHeld = true;
        await refreshGate;
      }
      await route.continue();
    });
    try {
      await page.goto("/products/bois-de-santal-200ml");
      await page
        .getByRole("button", { name: "Add to cart", exact: true })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect.poll(() => refreshHeld).toBe(true);
      await expect(
        page.getByRole("button", {
          name: "Adding",
          exact: true,
          includeHidden: true,
        }),
      ).toBeDisabled();
      if (closeWith !== "Continue shopping")
        await page.keyboard.press("Escape");
      else
        await page
          .getByRole("button", { name: closeWith, exact: true })
          .click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.getByRole("group", { name: "Add fragrance to bag" }),
      ).toBeFocused();
      if (closeWith === "Close and move focus") {
        await page.keyboard.press("Tab");
        await expect(
          page.getByRole("group", { name: "Add fragrance to bag" }),
        ).not.toBeFocused();
      }
      const focusBeforeRefresh = await page.evaluateHandle(
        () => document.activeElement,
      );
      releaseRefresh();
      await expect(
        page.getByRole("button", { name: "Add to cart", exact: true }),
      ).toBeEnabled();
      if (closeWith === "Close and move focus") {
        expect(
          await page.evaluate(
            (previous) => document.activeElement === previous,
            focusBeforeRefresh,
          ),
        ).toBe(true);
      } else {
        await expect(
          page.getByRole("button", { name: "Add to cart", exact: true }),
        ).toBeFocused();
      }
      await page.keyboard.press("Tab");
      await expect(
        page.getByRole("button", { name: "Add to cart", exact: true }),
      ).not.toBeFocused();
    } finally {
      releaseRefresh();
    }
  });
}

test("adds, persists, updates and removes a Shopify fixture cart", async ({
  page,
}) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.goto("/products/bois-de-santal-200ml");
  await page.getByRole("button", { name: "Add to cart" }).click();
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
  await expect(page.getByRole("button", { name: "Add to cart" })).toBeFocused();
  await page.getByRole("button", { name: "Add to cart" }).click();
  await page.getByRole("link", { name: "Review your bag" }).click();
  await expect(page).toHaveTitle("Your bag | Infusion Diffusion");
  await expect(
    page.getByRole("heading", { level: 1, name: "Your cart" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Checkout unavailable" }),
  ).toBeDisabled();
  const summaryTitle = await page
    .getByRole("heading", { name: "Order summary" })
    .boundingBox();
  const summaryPanel = await page
    .getByTestId("cart-summary-panel")
    .boundingBox();
  expect(summaryPanel!.y - (summaryTitle!.y + summaryTitle!.height)).toBe(16);
  expect(
    (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
      .violations,
  ).toEqual([]);
  await page.getByRole("button", { name: /Increase Bois De Santal/ }).click();
  await expect(page.getByLabel("Quantity 3")).toBeVisible();
  await expect(
    page.getByText("3 items in your cart", { exact: false }),
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
