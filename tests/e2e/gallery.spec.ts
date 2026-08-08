import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const title = "Rooms, composed in scent";

test.describe.configure({ mode: "serial" });

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small", width: 320, height: 844 },
]) {
  test(`renders the honest Gallery fallback at ${viewport.name}`, async ({
    page,
    request,
  }) => {
    await page.setViewportSize(viewport);
    const response = await page.goto("/gallery");
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle("Gallery | Infusion Diffusion");
    await expect(
      page.getByRole("heading", { level: 1, name: title }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        level: 2,
        name: /The gallery is (being composed|temporarily unavailable)/,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Explore the collection" }),
    ).toHaveAttribute("href", "/shop");
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(
      await page.evaluate(() => document.documentElement.clientWidth),
    );
    expect((await request.get("/api/health")).ok()).toBeTruthy();
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

test("keeps Gallery readable with reduced motion and 200% zoom", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/gallery");
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
  await expect(
    page.getByRole("heading", { level: 1, name: title }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
});
