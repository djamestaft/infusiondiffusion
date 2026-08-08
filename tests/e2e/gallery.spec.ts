import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const title = "Rooms, composed in scent";
const mode = process.env.GALLERY_E2E_MODE ?? "auto";
const exactPublished = mode === "published";
const exactFallback = mode === "fallback";

const campaignTitles = [
  "Blanc De Blanc — Travertine Light",
  "Bois De Santal — Emerald Study",
  "Santuaire Serein — Library Study",
  "Santuaire Serein — Botanical Light",
];
const marketTitles = [
  "At the Indoor Market",
  "The Market Table",
  "Blanc De Blanc at Market",
  "The Collection on Display",
  "A Table of Fragrance",
];

function expectClose(actual: number, expected: number, tolerance = 1) {
  expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance);
}

test.describe.configure({ mode: "serial" });

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small", width: 320, height: 844 },
]) {
  test(`renders the Gallery contract at ${viewport.name}`, async ({
    page,
    request,
  }) => {
    const consoleErrors: string[] = [];
    const failedRequests: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("requestfailed", (request) => failedRequests.push(request.url()));

    await page.setViewportSize(viewport);
    const response = await page.goto("/gallery");
    expect(response?.ok()).toBeTruthy();
    await expect(page).toHaveTitle("Gallery | Infusion Diffusion");
    await expect(
      page.getByRole("heading", { level: 1, name: title }),
    ).toBeVisible();

    const emptyHeading = page.getByRole("heading", {
      level: 2,
      name: /The gallery is (being composed|temporarily unavailable)/,
    });
    if (exactPublished) {
      await expect(emptyHeading).toHaveCount(0);
      await expect(
        page.getByRole("heading", { level: 2, name: "In the Market" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: /^View / })).toHaveCount(9);
      for (const campaignTitle of campaignTitles) {
        await expect(
          page.getByRole("heading", { level: 2, name: campaignTitle }),
        ).toBeVisible();
      }
      for (const marketTitle of marketTitles) {
        await expect(
          page.getByRole("heading", { level: 3, name: marketTitle }),
        ).toBeVisible();
      }
      const imageSources = await page
        .locator('[data-testid="gallery-grid"] img')
        .evaluateAll((images) =>
          images.map((image) => image.getAttribute("src")),
        );
      expect(imageSources).toHaveLength(9);
      expect(
        imageSources.every((source) => source?.includes("cdn.sanity.io")),
      ).toBeTruthy();

      const campaignGrid = page.locator('[data-layout="campaign"]');
      const campaignFigures = campaignGrid.locator(":scope > figure");
      const campaignContentBoxes = await campaignFigures.evaluateAll(
        (figures) =>
          figures.map((figure) => {
            const button = figure.querySelector("button")!;
            const caption = figure.querySelector("figcaption")!;
            const buttonBox = button.getBoundingClientRect();
            const captionBox = caption.getBoundingClientRect();
            return {
              x: buttonBox.x,
              top: buttonBox.top,
              bottom: Math.max(buttonBox.bottom, captionBox.bottom),
            };
          }),
      );
      const campaignCaptionSpacing = await campaignGrid
        .locator("figcaption")
        .evaluateAll((captions) =>
          captions.map((caption) =>
            Number.parseFloat(getComputedStyle(caption).marginTop),
          ),
        );
      expect(campaignCaptionSpacing).toEqual([16, 16, 16, 16]);
      const marketGrid = page.locator('[data-layout="market"]');
      const marketButtons = marketGrid.locator("figure > button");
      const marketFigures = marketGrid.locator(":scope > figure");
      const buttonBoxes = await marketButtons.evaluateAll((buttons) =>
        buttons.map((button) => button.getBoundingClientRect().toJSON()),
      );
      const figureBoxes = await marketFigures.evaluateAll((figures) =>
        figures.map((figure) => figure.getBoundingClientRect().toJSON()),
      );
      if (viewport.width === 1440) {
        expectClose(campaignContentBoxes[0].x, 80);
        expectClose(campaignContentBoxes[3].x, 80);
        expectClose(campaignContentBoxes[1].x, 760);
        expectClose(campaignContentBoxes[2].x, 760);
        expectClose(
          campaignContentBoxes[3].top - campaignContentBoxes[0].bottom,
          64,
        );
        expectClose(
          campaignContentBoxes[2].top - campaignContentBoxes[1].bottom,
          32,
        );
        expectClose(buttonBoxes[0].x, 64);
        expectClose(buttonBoxes[0].width, 832);
        expectClose(buttonBoxes[0].height, 468);
        expectClose(buttonBoxes[1].x, 928);
        expectClose(buttonBoxes[1].width, 416);
        expectClose(buttonBoxes[1].height, 555);
        expectClose(buttonBoxes[2].x, 64);
        expectClose(buttonBoxes[2].width, 400);
        expectClose(buttonBoxes[2].height, 300);
        expectClose(buttonBoxes[3].x - buttonBoxes[2].right, 32);
        expectClose(
          figureBoxes[2].top -
            Math.max(figureBoxes[0].bottom, figureBoxes[1].bottom),
          32,
        );
      } else {
        expect(campaignContentBoxes.map((figure) => figure.top)).toEqual(
          [...campaignContentBoxes]
            .sort((left, right) => left.top - right.top)
            .map((figure) => figure.top),
        );
        const expectedInset = viewport.width === 390 ? 24 : 16;
        const expectedWidth = viewport.width === 390 ? 342 : 288;
        for (const box of buttonBoxes) {
          expectClose(box.x, expectedInset);
          expectClose(box.width, expectedWidth);
        }
        expectClose(figureBoxes[1].top - figureBoxes[0].bottom, 16);
      }

      const campaignImages = page.locator('[data-layout="campaign"] img').all();
      const marketImages = page.locator('[data-layout="market"] img').all();
      const resolvedCampaignImages = await campaignImages;
      const resolvedMarketImages = await marketImages;
      await expect(resolvedCampaignImages[0]).toHaveAttribute(
        "loading",
        "eager",
      );
      for (const image of [
        ...resolvedCampaignImages.slice(1),
        ...resolvedMarketImages,
      ]) {
        await expect(image).toHaveAttribute("loading", "lazy");
      }
    } else if (exactFallback) {
      await expect(emptyHeading).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Explore the collection" }),
      ).toHaveAttribute("href", "/shop");
    } else if ((await emptyHeading.count()) > 0) {
      await expect(emptyHeading).toBeVisible();
    } else {
      await expect(page.getByRole("button", { name: /^View / })).toHaveCount(9);
    }

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
    const isLocalOrigin = ["localhost", "127.0.0.1"].includes(
      new URL(page.url()).hostname,
    );
    expect(
      isLocalOrigin
        ? consoleErrors.filter(
            (message) =>
              !message.includes("data/live/events") &&
              message !== "Failed to load resource: net::ERR_FAILED",
          )
        : consoleErrors,
    ).toEqual([]);
    expect(
      isLocalOrigin
        ? failedRequests.filter((url) => !url.includes("/data/live/events/"))
        : failedRequests,
    ).toEqual([]);
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

if (exactPublished) {
  test("scopes keyboard viewers to their published Gallery group", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto("/gallery");

    const campaignTrigger = page.getByRole("button", {
      name: `View ${campaignTitles[0]}`,
    });
    await campaignTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(
      page.getByRole("button", { name: "Close gallery viewer" }),
    ).toBeFocused();
    await expect(page.getByText("Image 1 of 4")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(campaignTrigger).toBeFocused();

    const marketTrigger = page.getByRole("button", {
      name: `View ${marketTitles[0]}`,
    });
    await marketTrigger.focus();
    await page.keyboard.press("Enter");
    await expect(page.getByText("Image 1 of 5")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Previous image" }),
    ).toBeDisabled();
    await page.getByRole("button", { name: "Next image" }).click();
    await expect(page.getByText("Image 2 of 5")).toBeVisible();
    await page.getByRole("button", { name: "Close gallery viewer" }).click();
    await expect(marketTrigger).toBeFocused();
  });

  test("reviews published Gallery delivery at 1x and 2x", async ({
    browser,
  }) => {
    const selectedWidths: number[][] = [];
    for (const deviceScaleFactor of [1, 2]) {
      const context = await browser.newContext({
        deviceScaleFactor,
        viewport: { width: 1440, height: 1000 },
      });
      const page = await context.newPage();
      await page.goto("/gallery");
      await page
        .getByRole("heading", { name: "In the Market" })
        .scrollIntoViewIfNeeded();
      const widths = await page
        .locator('[data-testid="gallery-grid"] img')
        .evaluateAll((images) =>
          images.map((image) => {
            const selectedWidth = new URL(
              (image as HTMLImageElement).currentSrc,
              document.baseURI,
            ).searchParams.get("w");
            return Number(selectedWidth);
          }),
        );
      expect(widths).toHaveLength(9);
      expect(widths.every((width) => Number.isFinite(width) && width > 0)).toBe(
        true,
      );
      selectedWidths.push(widths);
      await context.close();
    }
    for (let index = 0; index < 9; index += 1) {
      expect(selectedWidths[1][index]).toBeGreaterThanOrEqual(
        selectedWidths[0][index],
      );
    }
  });
}
