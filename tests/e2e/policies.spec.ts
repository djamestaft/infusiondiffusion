import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const policies = [
  ["terms-and-conditions", "Terms & Conditions"],
  ["shipping", "Shipping & Delivery"],
  ["returns", "Returns & Refunds"],
  ["privacy", "Privacy & Cookies"],
];
for (const [slug, title] of policies) {
  test(`${title} is readable and linked in the footer`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/policies/${slug}`);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator("article h2").first()).toBeVisible();
    const nav = page.getByRole("navigation", { name: "Policies" });
    await expect(nav.getByRole("link")).toHaveCount(4);
    await expect(
      nav.getByRole("link", { name: title, exact: true }),
    ).toHaveAttribute("href", `/policies/${slug}`);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}
test("unknown policies return the not-found page", async ({ page }) => {
  await page.goto("/policies/does-not-exist");
  await expect(
    page.getByRole("heading", { name: "404", exact: true }),
  ).toBeVisible();
});
test("policy footer links can be followed with the keyboard", async ({
  page,
}) => {
  await page.goto("/policies/shipping");
  const privacy = page
    .getByRole("navigation", { name: "Policies" })
    .getByRole("link", { name: "Privacy & Cookies" });
  await privacy.focus();
  await expect(privacy).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/policies\/privacy$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Privacy & Cookies",
  );
});
