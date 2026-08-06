import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("renders the live homepage journey accessibly", async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });

  await page.goto("/");

  const navigationHeader = page
    .getByRole("navigation", { name: "Primary" })
    .locator("..");
  await expect(navigationHeader).toHaveCSS("border-bottom-style", "solid");
  await expect(navigationHeader).toHaveCSS(
    "border-bottom-color",
    "rgb(197, 164, 71)",
  );
  await expect(navigationHeader).toHaveCSS(
    "width",
    `${await page.evaluate(() => document.documentElement.clientWidth)}px`,
  );

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

test("reveals each following section at the viewport edge", async ({
  page,
}) => {
  await page.goto("/");

  const waitingReveals = page.locator(
    '[data-scroll-reveal][data-reveal-state="waiting"]',
  );
  await expect.poll(() => waitingReveals.count()).toBeGreaterThan(0);
  await waitingReveals
    .first()
    .evaluate((element) => element.setAttribute("data-e2e-target", ""));
  const nextSection = page.locator("[data-e2e-target]");

  await nextSection.scrollIntoViewIfNeeded();
  await expect(nextSection).toHaveAttribute("data-reveal-state", "visible");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(nextSection).toHaveCSS("opacity", "1");
  await expect(nextSection).toHaveCSS("transform", "none");
});

test("reports a healthy deployment", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.ok()).toBeTruthy();
  await expect(response.json()).resolves.toMatchObject({ status: "ok" });
});

test("keeps the hero, CTA, and navigation divider intact at 320px", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: "Shop the collection" }).first(),
  ).toHaveAttribute("href", "/shop");
  const navigationHeader = page
    .getByRole("navigation", { name: "Primary" })
    .locator("..");
  await expect(navigationHeader).toHaveCSS(
    "border-bottom-color",
    "rgb(197, 164, 71)",
  );
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(320);
});
