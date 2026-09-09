import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const width of [1440, 768, 390, 320]) {
  test(`Guide preferences work without unverified recommendations at ${width}px`, async ({
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
    await expect(summary).toContainText(
      "Personalised recommendations are not available yet",
    );
    await expect(
      summary.getByRole("link", { name: "EXPLORE THE COLLECTION" }),
    ).toHaveAttribute("href", "/shop");
    await expect(
      page.getByRole("heading", { name: "Your room, shortlisted" }),
    ).toHaveCount(0);
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
  });
}
