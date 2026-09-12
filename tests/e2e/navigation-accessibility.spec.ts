import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("mobile menu remains reachable in landscape and releases focus on desktop", async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/shop");
  const primary = page.getByRole("navigation", {
    name: "Primary",
    exact: true,
  });
  const home = primary.getByRole("link", { name: "Infusion Diffusion home" });
  expect((await home.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  const opener = page.getByRole("button", { name: "Open menu" });
  await opener.click();
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  const first = dialog.getByRole("link", { name: "Infusion Diffusion home" });
  const last = dialog.getByRole("link", { name: "Contact", exact: true });
  expect((await first.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await expect(first).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(last).toBeFocused();
  await expect(last).toBeInViewport();
  await page.keyboard.press("Tab");
  await expect(first).toBeFocused();
  await expect(first).toBeInViewport();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await expect(dialog).toHaveCount(0);
  await opener.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(dialog).toHaveCount(0);
  await expect(home).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await page.setViewportSize({ width: 320, height: 568 });
  await opener.click();
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close menu" }).click();
  await expect(opener).toBeFocused();
});

for (const route of [
  "/shop",
  "/products/bois-de-santal-200ml",
  "/fragrance-guide",
  "/cart",
]) {
  test(`shopping reflow and keyboard targets at 320 CSS pixels: ${route}`, async ({
    page,
  }) => {
    // Equivalent reflow width to a 640px viewport at 200% browser zoom.
    await page.setViewportSize({ width: 320, height: 450 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(320);
    const targets = await page
      .locator(":is(header, main, footer) :is(a[href], button, input)")
      .evaluateAll((elements) =>
        elements.flatMap((element) => {
          const target =
            element instanceof HTMLInputElement && element.labels?.length
              ? element.labels[0]
              : element;
          const box = target.getBoundingClientRect();
          if (
            !box.width ||
            !box.height ||
            getComputedStyle(target).visibility === "hidden"
          )
            return [];
          return box.width < 44 || box.height < 44
            ? [
                {
                  label: target.textContent?.trim(),
                  width: box.width,
                  height: box.height,
                },
              ]
            : [];
        }),
      );
    expect(targets).toEqual([]);
    if (route === "/fragrance-guide") {
      const choice = page.getByRole("radio").first();
      await choice.focus();
      await page.keyboard.press("Space");
      await expect(choice).toBeChecked();
      expect(
        await choice.evaluate(
          (element) => getComputedStyle(element.closest("label")!).outlineWidth,
        ),
      ).toBe("3px");
    }
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  });
}

test("preserves visible focus through repeated desktop menu transitions", async ({
  page,
}) => {
  await page.setViewportSize({ width: 844, height: 390 });
  await page.goto("/shop");
  const home = page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link", { name: "Infusion Diffusion home" });
  for (let attempt = 0; attempt < 10; attempt++) {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(
      page
        .getByRole("dialog")
        .getByRole("link", { name: "Infusion Diffusion home" }),
    ).toBeFocused();
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page.getByRole("dialog")).toHaveCount(0);
    await expect(home).toBeFocused();
    expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
      "hidden",
    );
  }
});
