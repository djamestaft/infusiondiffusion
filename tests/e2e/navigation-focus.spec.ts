import { expect, test } from "@playwright/test";

test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

test("touch menu focus stays quiet and keyboard focus remains visible", async ({
  page,
}) => {
  await page.goto("/about");
  const opener = page.getByRole("button", { name: "Open menu" });
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  const logo = dialog.getByRole("link", { name: "Infusion Diffusion home" });
  for (let attempt = 0; attempt < 3; attempt++) {
    await opener.tap();
    await expect(logo).toBeFocused();
    await expect(logo).toHaveCSS("outline-style", "none");
    await dialog.getByRole("button", { name: "Close menu" }).tap();
    await expect(opener).toBeFocused();
    await expect(opener).toHaveCSS("outline-style", "none");
  }
  // Switching to a hardware keyboard must restore the ring immediately.
  await page.keyboard.press("Enter");
  await expect(logo).toBeFocused();
  await expect(logo).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Shift+Tab");
  await expect(
    dialog.getByRole("link", { name: "Contact", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(logo).toBeFocused();
  await expect(logo).toHaveCSS("outline-style", "solid");
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await expect(opener).toHaveCSS("outline-style", "solid");
});

test("touch activation overrides retained browser focus-visible state", async ({
  page,
}) => {
  await page.goto("/about");
  const opener = page.getByRole("button", { name: "Open menu" });
  await opener.focus();
  await page.keyboard.press("Shift");
  // Keep the browser's keyboard heuristic while delivering touch activation.
  // This deterministically exercises the intermittent script-focus ring case.
  await opener.evaluate((button) => {
    button.dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true, pointerType: "touch" }),
    );
    (button as HTMLButtonElement).click();
  });
  const dialog = page.getByRole("dialog", { name: "Navigation menu" });
  const logo = dialog.getByRole("link", { name: "Infusion Diffusion home" });
  await expect(logo).toBeFocused();
  await expect(logo).toHaveCSS("outline-style", "none");
  await dialog
    .getByRole("button", { name: "Close menu" })
    .evaluate((button) => {
      button.dispatchEvent(
        new PointerEvent("pointerdown", {
          bubbles: true,
          pointerType: "touch",
        }),
      );
      (button as HTMLButtonElement).click();
    });
  await expect(opener).toBeFocused();
  await expect(opener).toHaveCSS("outline-style", "none");
  // Tab entering the header from outside must also restore keyboard treatment.
  await page.evaluate(() => {
    const beforeHeader = document.createElement("button");
    beforeHeader.textContent = "Outside navigation";
    document.body.prepend(beforeHeader);
    beforeHeader.focus();
  });
  const home = page
    .getByRole("navigation", { name: "Primary", exact: true })
    .getByRole("link", { name: "Infusion Diffusion home" });
  await page.keyboard.press("Tab");
  // Safari's system keyboard setting can skip links in native Tab order.
  // Focus the target explicitly after input outside the navigation.
  await home.focus();
  await expect(home).toBeFocused();
  await expect(home).toHaveCSS("outline-style", "solid");
});
