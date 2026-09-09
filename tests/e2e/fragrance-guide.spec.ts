import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [1440, 768, 390, 320]) {
  test(`Guide notes produce source-backed suggestions at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    const pageErrors: string[] = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));
    await page.goto("/fragrance-guide");
    await expect(page).toHaveTitle(
      "A practical home fragrance guide | Infusion Diffusion",
    );
    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "Find the atmosphere that belongs in your room",
      }),
    ).toBeVisible();
    await page.getByRole("button", { name: "CONTINUE", exact: true }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Choose an answer for each question",
    );
    await expect(
      page.getByRole("radio", { name: "Living room", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Space");
    await page.getByText("Soft & restful", { exact: true }).click();
    await page.getByText("Soft florals", { exact: true }).click();
    await page.getByText("Spice & woods", { exact: true }).click();
    await page.getByText("Spa-like calm", { exact: true }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Choose up to two",
    );
    await expect(
      page.getByRole("checkbox", { name: "Spa-like calm", exact: true }),
    ).not.toBeChecked();
    await page.getByText("Quiet background", { exact: true }).click();
    await page.getByText("Any time", { exact: true }).click();
    await page.getByRole("button", { name: "BACK", exact: true }).click();
    await expect(
      page.getByRole("radio", { name: "Quiet background", exact: true }),
    ).toBeChecked();
    await page.getByRole("button", { name: "CONTINUE", exact: true }).click();
    const summary = page.getByRole("region", {
      name: "Your fragrance preferences",
    });
    await expect(summary).toBeVisible();
    await expect(summary).toContainText("Soft florals, Spice & woods");
    const suggestions = page.getByRole("region", {
      name: "Suggested fragrances",
    });
    await expect(suggestions).toBeVisible();
    await expect(suggestions.getByRole("link")).toHaveCount(3);
    await expect(summary.getByRole("heading")).toBeFocused();
    const links = await suggestions
      .getByRole("link")
      .evaluateAll((nodes) => nodes.map((a) => a.getAttribute("href")));
    await page.getByText("Bedroom", { exact: true }).click();
    await expect(suggestions).toHaveCount(0);
    await page.getByRole("button", { name: "CONTINUE", exact: true }).click();
    await expect(suggestions.getByRole("link")).toHaveCount(3);
    expect(
      await suggestions
        .getByRole("link")
        .evaluateAll((nodes) => nodes.map((a) => a.getAttribute("href"))),
    ).toEqual(links);
    expect(
      await page.evaluate(
        () =>
          document.documentElement.scrollWidth <=
          document.documentElement.clientWidth,
      ),
    ).toBe(true);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
    expect(pageErrors).toEqual([]);
    await suggestions.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/products\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}

test("Guide single-result recovery remains usable with zoom and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/fragrance-guide");
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
  for (const name of [
    "Bedroom",
    "Soft & restful",
    "Spa-like calm",
    "Quiet background",
    "Any time",
  ]) {
    const input = page.getByRole(
      name === "Spa-like calm" ? "checkbox" : "radio",
      { name, exact: true },
    );
    await input.focus();
    await input.press("Space");
  }
  await page.getByRole("button", { name: "CONTINUE", exact: true }).focus();
  await page.keyboard.press("Enter");
  const suggestions = page.getByRole("region", {
    name: "Suggested fragrances",
  });
  await expect(suggestions.getByRole("link")).toHaveCount(1);
  await expect(suggestions.getByRole("link")).toContainText("Santuaire Serein");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page
    .getByRole("checkbox", { name: "Spa-like calm", exact: true })
    .focus();
  await page.keyboard.press("Space");
  await expect(suggestions).toHaveCount(0);
  await page.getByRole("button", { name: "CONTINUE", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("form").getByRole("alert")).toBeVisible();
});
