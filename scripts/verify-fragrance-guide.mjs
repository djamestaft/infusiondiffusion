/** Real browser consultation proof; protected-preview headers stay on its origin. */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium, webkit, firefox } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const base = process.env.GUIDE_URL ?? "http://127.0.0.1:3100";
const out = process.env.OUT_DIR ?? "/tmp/fragrance-guide-browser-proof";
const headers = process.env.HEADERS_FILE
  ? JSON.parse(await fs.readFile(process.env.HEADERS_FILE, "utf8"))
  : {};
const engines = (process.env.ENGINES ?? "chromium,webkit,firefox").split(",");
const widths = (process.env.WIDTHS ?? "1440,1280,390,320")
  .split(",")
  .map(Number);
await fs.mkdir(out, { recursive: true });
const report = { base, started: new Date().toISOString(), cases: [] };
for (const [name, engine] of Object.entries({ chromium, webkit, firefox })) {
  if (!engines.includes(name)) continue;
  const browser = await engine.launch();
  for (const width of widths) {
    const height = width === 1280 ? 720 : 900;
    const id = `${name}-${width}x${height}`;
    const record = name === "chromium" && [1440, 390].includes(width);
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: "no-preference",
      recordVideo: record
        ? { dir: path.join(out, "videos"), size: { width, height } }
        : undefined,
    });
    await context.route("**/*", async (route) => {
      const request = route.request();
      await route.continue({
        headers:
          new URL(request.url()).origin === new URL(base).origin
            ? { ...request.headers(), ...headers }
            : request.headers(),
      });
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto(new URL("/fragrance-guide", base).href);
    await page.getByRole("button", { name: "Begin the guide" }).waitFor();
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(650);
    await page.screenshot({
      path: path.join(out, `${id}-intro.png`),
      fullPage: false,
    });
    await page.evaluate(() => {
      const state = { running: true, frames: [] };
      window.__guideProof = state;
      const tick = (time) => {
        const h = document.querySelector(".guide-consultation h1");
        if (h) {
          const css = getComputedStyle(h);
          state.frames.push({
            time,
            title: h.textContent,
            transform: css.transform,
            opacity: css.opacity,
            outline: css.outlineStyle,
            groups: document.querySelectorAll(".guide-consultation fieldset")
              .length,
          });
        }
        if (state.running) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    const clickChoice = (text) => page.getByText(text, { exact: true }).click();
    const next = () =>
      page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByRole("button", { name: "Begin the guide" }).click();
    await page.waitForTimeout(650);
    const titleOutline = await page
      .getByRole("heading", { level: 1 })
      .evaluate((e) => getComputedStyle(e).outlineStyle);
    await clickChoice("Bedroom");
    await page.screenshot({
      path: path.join(out, `${id}-room.png`),
      fullPage: false,
    });
    await next();
    await next();
    const missingBlocked = await page
      .locator("form")
      .getByRole("alert")
      .isVisible();
    await clickChoice("Soft & restful");
    await next();
    for (const choice of ["Spa-like calm", "Amber & vanilla", "Spice & woods"])
      await clickChoice(choice);
    const noteLimit =
      (await page.locator("form").getByRole("alert").isVisible()) &&
      !(await page
        .getByRole("checkbox", { name: "Spice & woods" })
        .isChecked());
    await clickChoice("Amber & vanilla");
    await page.screenshot({
      path: path.join(out, `${id}-notes.png`),
      fullPage: false,
    });
    await next();
    await clickChoice("Quiet background");
    await next();
    await clickChoice("Any time");
    await page.getByRole("button", { name: "Back", exact: true }).click();
    const backPreserved = await page
      .getByRole("radio", { name: "Quiet background" })
      .isChecked();
    await next();
    await page.getByRole("button", { name: "See my suggestions" }).click();
    const region = page.getByRole("region", { name: "Suggested fragrances" });
    await region.waitFor();
    await page.waitForTimeout(650);
    const links = await region.getByRole("link").evaluateAll((nodes) =>
      nodes.map((n) => ({
        href: n.getAttribute("href"),
        text: n.textContent,
      })),
    );
    await page.screenshot({
      path: path.join(out, `${id}-results.png`),
      fullPage: true,
    });
    const violations = (
      await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze()
    ).violations.map((v) => ({ id: v.id, impact: v.impact }));
    await page.getByRole("button", { name: "Edit room" }).click();
    const staleRemoved = (await region.count()) === 0;
    await clickChoice("Living room");
    await page.getByRole("button", { name: "Question 5: Time" }).click();
    await page.getByRole("button", { name: "See my suggestions" }).click();
    const sameResult =
      JSON.stringify(links) ===
      JSON.stringify(
        await region.getByRole("link").evaluateAll((nodes) =>
          nodes.map((n) => ({
            href: n.getAttribute("href"),
            text: n.textContent,
          })),
        ),
      );
    await page.getByRole("button", { name: "Reset guide" }).click();
    const resetIntro = await page
      .getByRole("button", { name: "Begin the guide" })
      .isVisible();
    await page.getByRole("button", { name: "Begin the guide" }).click();
    const resetEmpty =
      (await page.getByRole("radio", { checked: true }).count()) === 0 &&
      (await page
        .getByRole("button", { name: "Question 5: Time" })
        .isDisabled());
    await page.emulateMedia({ reducedMotion: "reduce" });
    await clickChoice("Bedroom");
    await next();
    await page.waitForTimeout(80);
    const reduced = await page
      .getByRole("heading", { level: 1 })
      .evaluate((e) => ({
        transform: getComputedStyle(e).transform,
        animation: getComputedStyle(e).animationName,
        outline: getComputedStyle(e).outlineStyle,
      }));
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    const trace = await page.evaluate(() => {
      window.__guideProof.running = false;
      return window.__guideProof.frames;
    });
    const animated = trace.filter(
      (f) => f.transform !== "none" && f.opacity !== "1",
    ).length;
    const result = {
      id,
      width,
      height,
      missingBlocked,
      noteLimit,
      backPreserved,
      staleRemoved,
      sameResult,
      resetIntro,
      resetEmpty,
      titleOutline,
      reduced,
      overflow,
      links,
      violations,
      errors,
      animatedFrames: animated,
      frames: trace,
    };
    result.passed =
      missingBlocked &&
      noteLimit &&
      backPreserved &&
      staleRemoved &&
      sameResult &&
      resetIntro &&
      resetEmpty &&
      titleOutline === "none" &&
      reduced.transform === "none" &&
      reduced.animation === "none" &&
      reduced.outline === "none" &&
      !overflow &&
      !violations.length &&
      !errors.length &&
      animated > 0 &&
      links.length === 1 &&
      links[0].text.includes("Santuaire Serein") &&
      trace.every((f) => f.groups <= 1);
    await page.close();
    if (record) await page.video().saveAs(path.join(out, `${id}.webm`));
    await context.close();
    report.cases.push(result);
    await fs.writeFile(
      path.join(out, "report.json"),
      JSON.stringify(report, null, 2),
    );
    console.log(
      JSON.stringify({
        ...result,
        frames: undefined,
        links: result.links.map((l) => l.href),
      }),
    );
  }
  await browser.close();
}
report.finished = new Date().toISOString();
await fs.writeFile(
  path.join(out, "report.json"),
  JSON.stringify(report, null, 2),
);
await fs.writeFile(
  path.join(out, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>Fragrance guide review</title><style>body{font:16px system-ui;max-width:1100px;margin:2rem auto;padding:1rem;background:#f6f5ef;color:#222}video,img{max-width:100%}td,th{padding:.5rem;text-align:left}</style><h1>Fragrance guide review</h1><p><a href="${base}/fragrance-guide">${base}/fragrance-guide</a></p><p>Real browser results, transition frame sampling, validation, back/edit/reset, reduced motion, accessibility and overflow. <a href="report.json">Raw report</a>. Browser videos are25fps; frame samples do not establish field frame rate.</p><table><tr><th>Browser/size</th><th>Pass</th><th>Animated samples</th></tr>${report.cases.map((c) => `<tr><td>${c.id}</td><td>${c.passed}</td><td>${c.animatedFrames}</td></tr>`).join("")}</table><h2>Desktop sequence</h2><video controls src="chromium-1440x900.webm"></video><h2>Phone sequence</h2><video controls src="chromium-390x900.webm"></video>${report.cases
    .filter((c) => c.id.startsWith("chromium"))
    .map(
      (c) =>
        `<h2>${c.id}</h2><a href="${c.id}-intro.png">Introduction</a> · <a href="${c.id}-room.png">Room</a> · <a href="${c.id}-notes.png">Notes</a> · <a href="${c.id}-results.png">Results</a>`,
    )
    .join("")}`,
);
if (report.cases.some((c) => !c.passed)) process.exitCode = 1;
