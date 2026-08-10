import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const viewports = [
  { name: "desktop-1440", width: 1440, height: 1000 },
  { name: "mobile-390", width: 390, height: 844 },
  { name: "mobile-320", width: 320, height: 844 },
] as const;

const routes = [
  { name: "home", path: "/", heading: /Fragrance, composed/ },
  { name: "shop", path: "/shop", heading: "The collection" },
  {
    name: "product-bois-de-santal",
    path: "/products/bois-de-santal-200ml",
    heading: "Bois De Santal",
  },
  { name: "gallery", path: "/gallery", heading: /Rooms, composed/ },
  {
    name: "fragrance-guide",
    path: "/fragrance-guide",
    heading: "A practical guide to choosing home fragrance",
  },
  { name: "about", path: "/about", heading: /story behind/ },
  { name: "contact", path: "/contact", heading: "Let’s talk fragrance." },
  { name: "account", path: "/account", heading: "Your account" },
] as const;

function directoryFor(viewport: (typeof viewports)[number]) {
  return viewport.name === "desktop-1440"
    ? "desktop-1440"
    : viewport.name === "mobile-390"
      ? "mobile-390"
      : "mobile-320";
}

async function openSeededCart(page: Page) {
  await page.goto("/products/bois-de-santal-200ml", {
    waitUntil: "networkidle",
  });
  await page.getByRole("button", { name: "Add to bag" }).click();
  await page.getByRole("link", { name: "Review your bag" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Your bag" }),
  ).toBeVisible();
}

for (const viewport of viewports) {
  test(`captures every public storefront route at ${viewport.width}px`, async ({
    page,
  }) => {
    test.setTimeout(90_000);
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    const failedFirstPartyRequests: string[] = [];
    let firstPartyOrigin = "";
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("requestfailed", (request) => {
      if (
        firstPartyOrigin &&
        new URL(request.url()).origin === firstPartyOrigin
      )
        failedFirstPartyRequests.push(request.url());
    });
    const healthResponse = await page.request.get("/api/health");
    expect(healthResponse.ok()).toBeTruthy();
    firstPartyOrigin = new URL(healthResponse.url()).origin;
    await page.setViewportSize(viewport);
    await page.emulateMedia({ reducedMotion: "reduce" });

    for (const route of routes) {
      await page.goto(route.path, { waitUntil: "networkidle" });
      await expect(
        page.getByRole("heading", { level: 1, name: route.heading }),
      ).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      await expect
        .poll(() =>
          page.evaluate(
            () =>
              document.images.length > 0 ||
              document.querySelector("h1") !== null ||
              document.body.textContent?.includes(
                "Room · Ritual · Atmosphere",
              ) ||
              document.body.textContent?.includes("Image coming soon") ||
              document.body.textContent?.includes("A practical guide"),
          ),
        )
        .toBeTruthy();
      await page.locator("body").focus();
      await page.keyboard.press("Tab");
      await expect(
        page
          .getByRole("navigation", { name: "Primary" })
          .getByRole("link", { name: "Infusion Diffusion home" }),
      ).toBeFocused();
      if (viewport.name === "desktop-1440") {
        expect(
          (
            await new AxeBuilder({ page })
              .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
              .analyze()
          ).violations,
        ).toEqual([]);
      }
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(viewport.width);
      await expect(page.getByRole("contentinfo")).toBeVisible();
      if (process.env.SAVE_STOREFRONT_EVIDENCE) {
        const directory = join(
          process.cwd(),
          "docs/features/evidence/storefront-redesign",
          directoryFor(viewport),
        );
        await mkdir(directory, { recursive: true });
        await page.screenshot({
          path: join(directory, `${route.name}.png`),
          fullPage: true,
        });
      }
    }

    await openSeededCart(page);
    await page.locator("body").focus();
    await page.keyboard.press("Tab");
    await expect(
      page
        .getByRole("navigation", { name: "Primary" })
        .getByRole("link", { name: "Infusion Diffusion home" }),
    ).toBeFocused();
    if (viewport.name === "desktop-1440") {
      expect(
        (
          await new AxeBuilder({ page })
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze()
        ).violations,
      ).toEqual([]);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(viewport.width);
    await expect(page.getByRole("contentinfo")).toBeVisible();
    if (process.env.SAVE_STOREFRONT_EVIDENCE) {
      const directory = join(
        process.cwd(),
        "docs/features/evidence/storefront-redesign",
        directoryFor(viewport),
      );
      await mkdir(directory, { recursive: true });
      await page.screenshot({
        path: join(directory, "cart.png"),
        fullPage: true,
      });
    }
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
    expect(failedFirstPartyRequests).toEqual([]);
  });
}

test("reflows every public route at an effective 200% zoom viewport", async ({
  page,
}) => {
  await page.setViewportSize({ width: 640, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of routes) {
    await page.goto(route.path, { waitUntil: "networkidle" });
    await expect(
      page.getByRole("heading", { level: 1, name: route.heading }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(640);
  }
  await openSeededCart(page);
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(640);
});
