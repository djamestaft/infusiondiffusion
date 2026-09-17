import { expect, test } from "@playwright/test";

for (const width of [1440, 768, 390, 320]) {
  test(`soft-launch notice clears navigation and remains visible at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["/", "/shop", "/cart", "/account"]) {
      await page.goto(route);
      // Account streams a replaceable loading shell with its own navigation.
      if (route === "/account")
        await expect(
          page.getByRole("link", {
            name: "Continue to your account",
            exact: true,
          }),
        ).toBeVisible();
      const notice = page.getByRole("complementary", { name: "Announcement" });
      await expect(notice).toHaveText(
        "Payments are in test mode. We’re launching shortly.",
      );
      const nav = page.getByRole("navigation", {
        name: "Primary",
        exact: true,
      });
      const noticeBox = (await notice.boundingBox())!;
      const navBox = (await nav.boundingBox())!;
      expect(navBox.y).toBeCloseTo(noticeBox.y + noticeBox.height, 1);
      expect(navBox.height).toBe(
        width >= 1024 ? (route === "/" ? 86 : 85) : route === "/" ? 78 : 77,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      await page.evaluate(() => window.scrollTo(0, 200));
      expect((await notice.boundingBox())!.y).toBeCloseTo(0, 1);
      if (width < 1024) {
        const opener = page.getByRole("button", { name: "Open menu" });
        await opener.click();
        const dialog = page.getByRole("dialog", { name: "Navigation menu" });
        await expect(
          dialog.getByRole("complementary", { name: "Announcement" }),
        ).toBeVisible();
        await expect(
          page.getByRole("complementary", { name: "Announcement" }),
        ).toHaveCount(1);
        await page.keyboard.press("Escape");
        await expect(opener).toBeFocused();
      }
    }
  });
}
