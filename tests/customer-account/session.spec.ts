import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const signedIn = {
  status: "signed-in",
  profile: {
    name: "Amara Jacobs",
    email: "amara@example.test",
    initials: "AJ",
  },
};
for (const width of [1440, 768, 390, 320])
  test(`signed-in account at ${width}`, async ({ page }) => {
    await page.route("**/api/account", (route) =>
      route.fulfill({ json: signedIn }),
    );
    await page.setViewportSize({ width, height: 950 });
    await page.goto("/account");
    await expect(page.getByText("amara@example.test")).toBeVisible();
    await expect(
      page
        .getByRole("link", { name: "Account, signed in as Amara Jacobs" })
        .filter({ visible: true }),
    ).toHaveText("AJ");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    expect(
      (
        await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze()
      ).violations,
    ).toEqual([]);
  });
test("refresh, return, logout and another customer never retain old details", async ({
  page,
  context,
}) => {
  let state: unknown = signedIn;
  await context.route("**/api/account", (route) =>
    route.fulfill({ json: state }),
  );
  let posts = 0;
  await context.route("**/account/logout", async (route) => {
    expect(route.request().method()).toBe("POST");
    posts++;
    state = { status: "signed-out" };
    await route.fulfill({
      status: 303,
      headers: { location: "/account?notice=signed-out" },
    });
  });
  await page.goto("/account");
  await expect(page.getByText("amara@example.test")).toBeVisible();
  await page.reload();
  await expect(page.getByText("amara@example.test")).toBeVisible();
  await page.goto("/shop");
  await expect(
    page
      .getByRole("link", { name: "Account, signed in as Amara Jacobs" })
      .filter({ visible: true }),
  ).toHaveText("AJ");
  await page.goto("/account");
  await expect(page.getByText("amara@example.test")).toBeVisible();
  const other = await context.newPage();
  await other.goto("/account");
  await expect(other.getByText("amara@example.test")).toBeVisible();
  await page.bringToFront();
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(
    page.getByRole("link", { name: "Sign in", exact: true }),
  ).toBeVisible();
  expect(posts).toBe(1);
  await expect(other.getByText("amara@example.test")).toHaveCount(0);
  state = {
    status: "signed-in",
    profile: {
      name: "Lebo Ndlovu",
      email: "lebo@example.test",
      initials: "LN",
    },
  };
  await other.bringToFront();
  await other.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(other.getByText("lebo@example.test")).toBeVisible();
  await expect(other.getByText("amara@example.test")).toHaveCount(0);
});
test("service errors clear identity and support retry without claiming expiry", async ({
  page,
}) => {
  let fail = false;
  await page.route("**/api/account", (route) =>
    route.fulfill({
      status: fail ? 503 : 200,
      json: fail ? { status: "error" } : signedIn,
    }),
  );
  await page.goto("/account");
  await expect(page.getByText("amara@example.test")).toBeVisible();
  fail = true;
  await page.evaluate(() => window.dispatchEvent(new Event("focus")));
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  await expect(page.getByText("amara@example.test")).toHaveCount(0);
  fail = false;
  await page.getByRole("button", { name: "Try again" }).click();
  await expect(page.getByText("amara@example.test")).toBeVisible();
});
test("rendered HTML and unauthenticated profile contain no customer identity", async ({
  request,
}) => {
  const html = await (await request.get("/account")).text();
  expect(html).not.toContain("amara@example.test");
  const r = await request.get("/api/account");
  expect(r.headers()["cache-control"]).toContain("no-store");
  expect(await r.json()).not.toHaveProperty("profile");
});
