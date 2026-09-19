import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const next = (page: Page) =>
  page.getByRole("button", { name: "Continue", exact: true }).click();
const finish = (page: Page) =>
  page.getByRole("button", { name: "See my suggestions", exact: true }).click();
for (const width of [1440, 1280, 768, 390, 320]) {
  test(`Guide consultation gives source-backed suggestions at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: width === 1280 ? 720 : 900 });
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/fragrance-guide");
    await expect(page).toHaveTitle(
      "A practical home fragrance guide | Infusion Diffusion",
    );
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Find the atmosphere that belongs in your room",
    );
    await page.getByRole("button", { name: "Begin the guide" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toBeFocused();
    await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
      "outline-style",
      "none",
    );
    await expect(page.getByRole("group")).toHaveCount(1);
    await next(page);
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Choose an answer",
    );
    await expect(
      page.getByRole("radio", { name: "Living room", exact: true }),
    ).toBeFocused();
    await page.keyboard.press("Space");
    await next(page);
    await page.getByText("Soft & restful", { exact: true }).click();
    await next(page);
    for (const name of ["Soft florals", "Spice & woods", "Spa-like calm"])
      await page.getByText(name, { exact: true }).click();
    await expect(page.locator("form").getByRole("alert")).toContainText(
      "Choose up to two",
    );
    await expect(
      page.getByRole("checkbox", { name: "Spa-like calm", exact: true }),
    ).not.toBeChecked();
    await next(page);
    await page.getByText("Quiet background", { exact: true }).click();
    await next(page);
    await page.getByText("Any time", { exact: true }).click();
    await page.getByRole("button", { name: "Back", exact: true }).click();
    await expect(
      page.getByRole("radio", { name: "Quiet background", exact: true }),
    ).toBeChecked();
    await next(page);
    await finish(page);
    const summary = page.getByRole("region", {
      name: "Your fragrance preferences",
    });
    const suggestions = page.getByRole("region", {
      name: "Suggested fragrances",
    });
    await expect(summary).toContainText("Soft florals, Spice & woods");
    await expect(suggestions.getByRole("link")).toHaveCount(3);
    await expect(
      page.getByRole("heading", { name: "Suggested fragrances" }),
    ).toBeFocused();
    expect(
      await suggestions.evaluate((node) =>
        Boolean(
          node.compareDocumentPosition(
            document.getElementById("guide-preferences-heading")!,
          ) & Node.DOCUMENT_POSITION_FOLLOWING,
        ),
      ),
    ).toBe(true);
    const links = await suggestions
      .getByRole("link")
      .evaluateAll((nodes) => nodes.map((a) => a.getAttribute("href")));
    await page.getByRole("button", { name: "Edit room" }).click();
    await expect(suggestions).toHaveCount(0);
    await page.getByText("Bedroom", { exact: true }).click();
    await page.getByRole("button", { name: "Question 5: Time" }).click();
    await finish(page);
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
    expect(errors).toEqual([]);
    await suggestions.getByRole("link").first().click();
    await expect(page).toHaveURL(/\/products\//);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
}

test("Guide keyboard, reduced-motion and editing recovery at a narrow zoomed viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/fragrance-guide");
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
  await page.getByRole("button", { name: "Begin the guide" }).press("Enter");
  for (const [index, name] of [
    "Bedroom",
    "Soft & restful",
    "Spa-like calm",
    "Quiet background",
    "Any time",
  ].entries()) {
    const input = page.getByRole(index === 2 ? "checkbox" : "radio", {
      name,
      exact: true,
    });
    await input.focus();
    await input.press("Space");
    await page
      .getByRole("button", {
        name: index < 4 ? "Continue" : "See my suggestions",
        exact: true,
      })
      .press("Enter");
  }
  const suggestions = page.getByRole("region", {
    name: "Suggested fragrances",
  });
  await expect(suggestions.getByRole("link")).toHaveCount(1);
  await expect(suggestions.getByRole("link")).toContainText("Santuaire Serein");
  await expect(page.getByRole("heading", { level: 1 })).toHaveCSS(
    "transform",
    "none",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Edit notes" }).press("Enter");
  const note = page.getByRole("checkbox", { name: "Spa-like calm" });
  await note.focus();
  await note.press("Space");
  await expect(suggestions).toHaveCount(0);
  await page
    .getByRole("button", { name: "Continue", exact: true })
    .press("Enter");
  await expect(page.locator("form").getByRole("alert")).toBeVisible();
});
