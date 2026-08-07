import AxeBuilder from "@axe-core/playwright";
import type { Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small", width: 320, height: 844 },
];

async function expectNoHorizontalOverflow(page: Page) {
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
}

async function expectAccountLayout(page: Page) {
  await expect(
    page.getByRole("heading", { level: 1, name: "Your account" }),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
  const main = page.getByRole("main");
  expect(
    await main.evaluate(
      (element) => element.scrollHeight >= element.clientHeight,
    ),
  ).toBeTruthy();
}

for (const viewport of viewports) {
  test(`renders the fixture hosted account handoff at ${viewport.name}`, async ({
    page,
    request,
  }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    await page.setViewportSize(viewport);
    await page.goto("/");
    await page.getByRole("link", { name: "Account" }).first().click();
    await expect(page).toHaveURL(/\/account$/);
    await expectAccountLayout(page);
    await expect(
      page.getByRole("link", { name: "Continue to your account" }),
    ).toHaveAttribute("href", "https://accounts.example.test/account");
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.getByRole("textbox")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    expect((await request.get("/api/health")).ok()).toBeTruthy();
    expect(
      (await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze())
        .violations,
    ).toEqual([]);
    expect(errors).toEqual([]);
    if (process.env.SAVE_ACCOUNT_EVIDENCE)
      await page.screenshot({
        path: `docs/features/evidence/account-${viewport.width}.png`,
        fullPage: true,
      });
  });

  for (const state of [
    "disabled",
    "configuration-missing",
    "not-provisioned",
    "error",
    "long-content",
  ]) {
    test(`keeps ${state} account content responsive at ${viewport.name}`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto(`/e2e-account/${state}`);
      await expectAccountLayout(page);
      if (state === "long-content") {
        const longCopy = page.getByText(/accountaccessinformation/);
        await expect(longCopy).toBeVisible();
        const bounds = await longCopy.boundingBox();
        expect(bounds?.x).toBeGreaterThanOrEqual(0);
        expect(bounds && bounds.x + bounds.width).toBeLessThanOrEqual(
          viewport.width,
        );
        const mainBounds = await page.getByRole("main").boundingBox();
        expect(
          bounds && mainBounds && bounds.y + bounds.height,
        ).toBeLessThanOrEqual(
          (mainBounds?.y ?? 0) +
            (await page
              .getByRole("main")
              .evaluate((element) => element.scrollHeight)),
        );
      }
    });
  }
}

test("follows the mobile account Tab order and exposes visible focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.goto("/account");
  await page.locator("body").focus();
  await expect(page.locator("body")).toBeFocused();

  const expectedOrder = [
    page.getByRole("link", { name: "Infusion Diffusion home" }),
    page.getByRole("link", { name: "Account", exact: true }),
    page.getByRole("link", { name: "Cart", exact: true }),
    page.getByRole("button", { name: "Open menu", exact: true }),
    page.getByRole("link", { name: "Continue to your account", exact: true }),
  ];
  for (const target of expectedOrder) {
    await page.keyboard.press("Tab");
    await expect(target).toBeFocused();
    await expect
      .poll(() =>
        target.evaluate((element) => {
          const style = getComputedStyle(element);
          return style.outlineStyle !== "none" && style.outlineWidth !== "0px";
        }),
      )
      .toBeTruthy();
  }
});

test("reflows at an effective 200% zoom viewport without page scaling", async ({
  page,
}) => {
  // A 1280px desktop viewport at 200% browser zoom exposes a 640px CSS layout
  // viewport. Setting that viewport verifies the real reflow layout rather than
  // CDP page scaling, which only magnifies pixels and leaves layout unchanged.
  await page.setViewportSize({ width: 640, height: 844 });
  await page.goto("/e2e-account/long-content");
  await expect(page.evaluate(() => window.innerWidth)).resolves.toBe(640);
  await expectAccountLayout(page);
  await expect(page.getByText(/accountaccessinformation/)).toBeVisible();
});

test("removes the loading pulse when reduced motion is requested", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/e2e-account/loading");
  await expectAccountLayout(page);
  await expect(page.getByRole("main").locator(".animate-pulse")).toHaveCSS(
    "animation-name",
    "none",
  );
});
