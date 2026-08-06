import AxeBuilder from "@axe-core/playwright";
import type { APIRequestContext, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

const fallbackTitle = "Let’s talk fragrance.";
const fallbackDescription =
  "Questions about scent, care, delivery, or choosing a room fragrance? Email us directly and we’ll help you find the clearest next step.";

async function assertDefaultContact(
  page: Page,
  request: APIRequestContext,
  viewport: { width: number; height: number },
) {
  const consoleErrors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  await page.setViewportSize(viewport);
  const response = await page.goto("/contact");
  expect(response?.ok()).toBeTruthy();
  await expect(page).toHaveTitle("Contact | Infusion Diffusion");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    fallbackDescription,
  );
  await expect(
    page.getByRole("heading", { level: 1, name: fallbackTitle }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 2 })).toHaveCount(2);
  const emailAction = page.getByRole("link", {
    name: "Email Infusion Diffusion",
  });
  const visibleEmail = page.locator("address a");
  await expect(emailAction).toHaveAttribute(
    "href",
    /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/,
  );
  const mailtoHref = await emailAction.getAttribute("href");
  expect(mailtoHref).not.toBeNull();
  await expect(visibleEmail).toHaveAttribute("href", mailtoHref!);
  await expect(page.locator("form")).toHaveCount(0);
  await expect(page.getByRole("textbox")).toHaveCount(0);
  await expect(page.getByText("Online form unavailable")).toBeVisible();
  await expect(page.getByRole("link", { name: "Cart" })).toBeVisible();
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
  expect(
    consoleErrors.filter(
      (message) =>
        !message.includes("Unable to load Sanity editorial page: contact") &&
        !message.includes("Unable to load Sanity site settings") &&
        !message.includes("j222nd1i.api.sanity.io") &&
        !message.includes("net::ERR_FAILED"),
    ),
  ).toEqual([]);
}

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
  { name: "small", width: 320, height: 844 },
]) {
  test(`renders the unobscured Contact fallback at ${viewport.name}`, async ({
    page,
    request,
  }) => {
    await assertDefaultContact(page, request, viewport);
    if (process.env.SAVE_CONTACT_EVIDENCE) {
      await page.screenshot({
        path: `docs/features/evidence/contact-${viewport.width}.png`,
        fullPage: true,
      });
    }
  });
}

test("keeps the mobile drawer keyboard-operable and restores the unobscured page", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/contact");
  const menu = page.getByRole("button", { name: "Open menu" });
  // A pointer activation first waits for the hydrated client control; the
  // subsequent Enter activation is the keyboard behavior under test.
  await menu.click();
  await expect(
    page.getByRole("dialog", { name: "Navigation menu" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await menu.focus();
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.press("Enter");
  await expect(
    page.getByRole("dialog", { name: "Navigation menu" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("dialog", { name: "Navigation menu" })
      .locator('a[aria-current="page"]', { hasText: "Contact" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("dialog", { name: "Navigation menu" }),
  ).toHaveCount(0);
  await expect(menu).toBeFocused();
  await expect(
    page.getByRole("link", { name: "Email Infusion Diffusion" }),
  ).toBeVisible();
});

test("keeps Contact readable at 200% zoom and with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contact");
  // Browser page scale simulates zoom without mutating server-rendered markup,
  // which would otherwise create a hydration mismatch in development.
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
  await expect(
    page.getByRole("heading", { level: 1, name: fallbackTitle }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Email Infusion Diffusion" }),
  ).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
});
