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
    if (width >= 1024) {
      expect(Math.abs(navBox.x + navBox.width / 2 - width / 2)).toBeLessThan(1);
      expect(navBox.x - (logoBox.x + logoBox.width)).toBeGreaterThanOrEqual(31);
    } else if (width >= 640) {
      expect(navBox.x - (logoBox.x + logoBox.width)).toBeGreaterThanOrEqual(31);
    } else {
      expect(Math.abs(logoBox.x + logoBox.width / 2 - width / 2)).toBeLessThan(
        1,
      );
    }
    if (width >= 640) {
      const boxes = await Promise.all(
        (await links.getByRole("link").all()).map((link) => link.boundingBox()),
      );
      const gaps = boxes
        .slice(1)
        .map((box, index) => box!.x - (boxes[index]!.x + boxes[index]!.width));
      expect(Math.max(...gaps) - Math.min(...gaps)).toBeLessThan(1);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
}
