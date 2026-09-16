import { expect, test } from "@playwright/test";

for (const width of [1440, 1024, 768, 390, 320]) {
  test(`shared shell and Home selection fit at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    const header = page.getByRole("navigation", { name: "Primary" });
    const footer = page.getByRole("contentinfo");
    const links = footer.getByRole("navigation", { name: "Footer" });
    await expect(links.getByRole("link")).toHaveText([
      "Shop",
      "Fragrance Guide",
      "About",
      "Contact",
    ]);
    await expect(header.getByRole("link", { name: "Gallery" })).toHaveCount(0);
    await expect(header.locator('a[aria-current="page"]')).toHaveCount(0);
    const cards = page
      .getByTestId("home-cabinet-inner")
      .locator('a[aria-label^="View "]:visible');
    await expect(cards).toHaveCount(width >= 640 && width < 1024 ? 4 : 3);
    const navBox = (await links.boundingBox())!;
    const logoBox = (await footer
      .getByRole("link", { name: "Infusion Diffusion home" })
      .boundingBox())!;
    await expect(
      footer.getByRole("heading", { name: "Explore" }),
    ).toBeVisible();
    const email = footer.getByRole("link", {
      name: "dione.smith@infusiondiffusion.co.za",
    });
    await expect(email).toHaveAttribute(
      "href",
      "mailto:dione.smith@infusiondiffusion.co.za",
    );
    const emailBox = (await email.boundingBox())!;
    expect(emailBox.x + emailBox.width).toBeLessThanOrEqual(width);
    expect(emailBox.height).toBeGreaterThanOrEqual(44);
    if (width >= 1024) {
      expect(navBox.x - (logoBox.x + logoBox.width)).toBeGreaterThanOrEqual(32);
    } else {
      expect(navBox.y).toBeGreaterThan(logoBox.y + logoBox.height);
      expect(Math.abs(navBox.x - logoBox.x)).toBeLessThan(1);
    }
    for (const link of await links.getByRole("link").all()) {
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
}
