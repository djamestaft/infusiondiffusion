import { expect, test, type Page } from "@playwright/test";

const pose = (page: Page) =>
  page.locator("[data-motion-backdrop]").evaluate((element) => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return {
      x: matrix.m41,
      y: matrix.m42,
      scale: Math.hypot(matrix.m11, matrix.m12),
    };
  });

for (const viewport of [
  { width: 1440, height: 800 },
  { width: 1366, height: 768 },
  { width: 1280, height: 720 },
]) {
  test(`hero retains its crop and pose across navigation at ${viewport.width}x${viewport.height}`, async ({
    page,
    isMobile,
  }) => {
    test.skip(isMobile, "Fine-pointer hover contract");
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(page.locator(".pin-spacer")).toHaveCount(1);
    await page.evaluate(() => document.fonts.ready);
    expect((await pose(page)).scale).toBeCloseTo(1.04, 4);
    const header = await page
      .locator("nav[aria-label='Primary']")
      .evaluate((e) => e.closest("header")!.getBoundingClientRect().bottom);
    const heroY = header + 100;
    for (let i = 0; i < 4; i++) {
      await page.mouse.move(viewport.width * 0.7, heroY, { steps: 8 });
      await expect
        .poll(async () => Math.abs((await pose(page)).x))
        .toBeGreaterThan(1);
      expect((await pose(page)).scale).toBeCloseTo(1.04, 4);
      // Capture the pose at the actual leave event, before the component handler.
      await page.getByTestId("hero-atmosphere").evaluate((hero) => {
        delete hero.dataset.hoverBoundary;
        const onLeave = (event: Event) => {
          if (event.target !== hero) return;
          hero.removeEventListener("pointerleave", onLeave, true);
          const element = hero.querySelector<HTMLElement>(
            "[data-motion-backdrop]",
          )!;
          const before = getComputedStyle(element).transform;
          queueMicrotask(() => {
            hero.dataset.hoverBoundary = JSON.stringify({
              before,
              after: getComputedStyle(element).transform,
            });
          });
        };
        hero.addEventListener("pointerleave", onLeave, { capture: true });
      });
      await page.mouse.move(viewport.width * 0.7, header - 20);
      const boundary = JSON.parse(
        (await page
          .getByTestId("hero-atmosphere")
          .getAttribute("data-hover-boundary"))!,
      );
      expect(boundary.after).toBe(boundary.before);
      const frozen = await pose(page);
      await page.waitForTimeout(100);
      expect(await pose(page)).toEqual(frozen);
      await page.mouse.move(viewport.width * 0.35, heroY + 50);
      expect((await pose(page)).scale).toBeCloseTo(1.04, 4);
    }
    // An unchanged-size image load must not reset a moving backdrop.
    const backdrop = page.locator("[data-motion-backdrop]");
    await backdrop.evaluate((element) => {
      const mutations: string[] = [];
      const observer = new MutationObserver(() =>
        mutations.push((element as HTMLElement).style.transform),
      );
      observer.observe(element, {
        attributes: true,
        attributeFilter: ["style"],
      });
      Object.assign(window, {
        hoverMutations: mutations,
        hoverObserver: observer,
      });
      element.dispatchEvent(new Event("load"));
    });
    for (let i = 0; i < 8; i++) {
      await page.mouse.move(viewport.width * (i % 2 ? 0.6 : 0.4), heroY + 60, {
        steps: 5,
      });
      await page.waitForTimeout(40);
    }
    const mutations = await page.evaluate(() => {
      const state = window as typeof window & {
        hoverMutations: string[];
        hoverObserver: MutationObserver;
      };
      state.hoverObserver.disconnect();
      return state.hoverMutations;
    });
    expect(mutations.length).toBeGreaterThan(0);
    expect(mutations).not.toContain("");
    await page
      .getByTestId("home-hero-section")
      .getByRole("link")
      .first()
      .focus();
    const centered = await pose(page);
    expect(centered.x).toBe(0);
    expect(centered.y).toBe(0);
    expect(centered.scale).toBeCloseTo(1.04, 4);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(backdrop).toHaveCSS("transform", "none");
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
  });
}
