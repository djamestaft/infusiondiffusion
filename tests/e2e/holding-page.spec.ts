import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("shows the holding page without serious accessibility violations", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: /^Scent for living\.?$/ }),
  ).toBeVisible();

  const announcement = page.getByLabel("Announcement");
  await expect(announcement).toBeVisible();

  const announcementBox = await announcement.boundingBox();
  expect(announcementBox).not.toBeNull();
  expect(announcementBox!.height).toBeGreaterThanOrEqual(44);
  expect(announcementBox!.width).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );

  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("reports a healthy deployment", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok" });
});
