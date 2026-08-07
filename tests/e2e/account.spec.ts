import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const viewport of [
  { width: 1440, height: 1000 },
  { width: 390, height: 844 },
  { width: 320, height: 844 },
]) {
  test(`renders the fixture hosted account handoff at ${viewport.width}px`, async ({
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
    await expect(
      page.getByRole("heading", { level: 1, name: "Your account" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Continue to your account" }),
    ).toHaveAttribute("href", "https://accounts.example.test/account");
    await expect(page.locator("form")).toHaveCount(0);
    await expect(page.getByRole("textbox")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/,
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(
      await page.evaluate(() => document.documentElement.clientWidth),
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
}

test("keeps the hosted handoff keyboard-focusable at 200% zoom with reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/account");
  const handoff = page.getByRole("link", { name: "Continue to your account" });
  await handoff.focus();
  await expect(handoff).toBeFocused();
  await expect(handoff).not.toHaveAttribute("target");
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setPageScaleFactor", { pageScaleFactor: 2 });
  await expect(handoff).toBeVisible();
  expect(
    await page.evaluate(() => document.documentElement.scrollWidth),
  ).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth),
  );
});
