/** Frame-level hover reproduction; output stays outside the checkout by default.
 * MOTION_REPRO_URL selects a preview; HEADERS_FILE is optional protected-preview
 * access and is sent only to the exact preview origin, never other hosts.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { chromium, webkit, firefox } from "@playwright/test";

const base = process.env.MOTION_REPRO_URL ?? "http://127.0.0.1:3100";
const out = process.env.OUT_DIR ?? "/tmp/infusion-hover-verified";
const headers = process.env.HEADERS_FILE
  ? JSON.parse(await fs.readFile(process.env.HEADERS_FILE, "utf8"))
  : {};
await fs.mkdir(out, { recursive: true });
const report = { base, started: new Date().toISOString(), cases: [] };
const requestedEngines = (
  process.env.ENGINES ?? "chromium,webkit,firefox"
).split(",");
for (const [engineName, engine] of Object.entries({
  chromium,
  webkit,
  firefox,
})) {
  if (!requestedEngines.includes(engineName)) continue;
  const browser = await engine.launch();
  for (const [width, height] of [
    [1440, 800],
    [1366, 768],
    [1280, 720],
  ]) {
    const name = `${engineName}-${width}x${height}`;
    const record =
      (engineName === "chromium" && width === 1440) ||
      (engineName === "webkit" && width === 1280);
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
    page.on("pageerror", (error) => errors.push(String(error)));
    const response = await page.goto(base, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.locator(".motion-collection[data-motion-active]").waitFor();
    await page.waitForTimeout(800);
    const initial = await page.evaluate(() => {
      const hero = document.querySelector('[data-testid="hero-atmosphere"]');
      const backdrop = hero.querySelector("[data-motion-backdrop]");
      const pose = () => {
        const matrix = new DOMMatrix(getComputedStyle(backdrop).transform);
        return {
          x: matrix.m41,
          y: matrix.m42,
          scale: Math.hypot(matrix.m11, matrix.m12),
        };
      };
      const state = {
        phase: "initial",
        frames: [],
        boundaries: [],
        clears: [],
        running: true,
      };
      window.__heroHover = state;
      const sample = (time) => {
        state.frames.push({ time, phase: state.phase, ...pose() });
        if (state.running) requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
      hero.addEventListener(
        "pointerleave",
        (event) => {
          const before = pose();
          queueMicrotask(() =>
            state.boundaries.push({
              phase: state.phase,
              related: event.relatedTarget?.tagName,
              before,
              after: pose(),
            }),
          );
        },
        { capture: true },
      );
      new MutationObserver(() => {
        if (!backdrop.style.transform)
          state.clears.push({ phase: state.phase, ...pose() });
      }).observe(backdrop, { attributes: true, attributeFilter: ["style"] });
      return {
        pose: pose(),
        headerBottom: document
          .querySelector("nav[aria-label='Primary']")
          .closest("header")
          .getBoundingClientRect().bottom,
      };
    });
    const phase = (value) =>
      page.evaluate((value) => {
        window.__heroHover.phase = value;
      }, value);
    const boundary = initial.headerBottom;
    await phase("first-hover");
    await page.mouse.move(width * 0.6, boundary + 100, { steps: 12 });
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(out, `${name}-first-hover.png`) });
    await phase("navigation-crossings");
    for (const x of [0.62, 0.15, 0.45, 0.7]) {
      await page.mouse.move(width * x, boundary + 45, { steps: 12 });
      await page.waitForTimeout(150);
      await page.mouse.move(width * x, boundary - 20, { steps: 8 });
      await page.waitForTimeout(200);
      await page.mouse.move(width * (1 - x), boundary + 80, { steps: 12 });
      await page.waitForTimeout(200);
    }
    await phase("continuous-hover-and-load");
    for (let i = 0; i < 24; i++) {
      await page.mouse.move(
        width * (0.35 + (i % 5) * 0.07),
        boundary + 90 + (i % 4) * 35,
        { steps: 5 },
      );
      if (i === 5 || i === 15)
        await page.locator("[data-motion-backdrop]").dispatchEvent("load");
      await page.waitForTimeout(200);
    }
    await page.screenshot({ path: path.join(out, `${name}-continuous.png`) });
    await phase("offscreen");
    await page.evaluate(() => scrollTo(0, 1600));
    await page.waitForTimeout(300);
    const offscreen = await page
      .locator("[data-motion-backdrop]")
      .evaluate((element) => element.style.transform);
    await page.waitForTimeout(300);
    const offscreenStable =
      offscreen ===
      (await page
        .locator("[data-motion-backdrop]")
        .evaluate((element) => element.style.transform));
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(300);
    await phase("re-entry");
    await page.mouse.move(width * 0.6, boundary + 140, { steps: 10 });
    await page.waitForTimeout(300);
    await phase("keyboard-focus");
    await page
      .getByTestId("home-hero-section")
      .getByRole("link")
      .first()
      .focus();
    await page.waitForTimeout(100);
    const focus = await page
      .locator("[data-motion-backdrop]")
      .evaluate((element) => {
        const m = new DOMMatrix(getComputedStyle(element).transform);
        return { x: m.m41, y: m.m42, scale: m.m11 };
      });
    await phase("reduced-motion");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(200);
    const reduced = await page
      .locator("[data-motion-backdrop]")
      .evaluate((element) => getComputedStyle(element).transform);
    const trace = await page.evaluate(() => {
      window.__heroHover.running = false;
      return window.__heroHover;
    });
    const activePhases = [
      "initial",
      "first-hover",
      "navigation-crossings",
      "continuous-hover-and-load",
      "re-entry",
    ];
    const active = trace.frames.filter((frame) =>
      activePhases.includes(frame.phase),
    );
    const scaleChanges = active.filter(
      (frame) => Math.abs(frame.scale - 1.04) > 0.0001,
    ).length;
    const boundaryResets = trace.boundaries.filter(
      (event) => JSON.stringify(event.before) !== JSON.stringify(event.after),
    ).length;
    const navigationLeaves = trace.boundaries.filter(
      (event) => event.phase === "navigation-crossings",
    ).length;
    const hoverClears = trace.clears.filter((event) =>
      activePhases.includes(event.phase),
    ).length;
    const steps = active
      .slice(1)
      .map((frame, index) =>
        Math.hypot(frame.x - active[index].x, frame.y - active[index].y),
      );
    const maxStep = Math.max(...steps);
    const result = {
      name,
      viewport: { width, height },
      status: response.status(),
      initial,
      scaleChanges,
      navigationLeaves,
      boundaryResets,
      hoverClears,
      maxStep,
      activeFrames: active.length,
      offscreenStable,
      focus,
      reduced,
      errors,
      trace,
    };
    result.passed =
      Math.abs(initial.pose.scale - 1.04) < 0.0001 &&
      scaleChanges === 0 &&
      navigationLeaves >= 4 &&
      boundaryResets === 0 &&
      hoverClears === 0 &&
      maxStep < 12 &&
      offscreenStable &&
      focus.x === 0 &&
      focus.y === 0 &&
      Math.abs(focus.scale - 1.04) < 0.0001 &&
      reduced === "none";
    await page.close();
    if (record) await page.video().saveAs(path.join(out, `${name}.webm`));
    await context.close();
    report.cases.push(result);
    await fs.writeFile(
      path.join(out, "browser-trace.json"),
      JSON.stringify(report, null, 2),
    );
    console.log(
      JSON.stringify({
        name,
        passed: result.passed,
        scaleChanges,
        boundaryResets,
        hoverClears,
        maxStep,
        activeFrames: active.length,
        errors: errors.length,
      }),
    );
  }
  await browser.close();
}
report.finished = new Date().toISOString();
await fs.writeFile(
  path.join(out, "browser-trace.json"),
  JSON.stringify(report, null, 2),
);
await fs.writeFile(
  path.join(out, "index.html"),
  `<!doctype html><meta charset="utf-8"><title>Hero hover continuity evidence</title><style>body{font:16px system-ui;margin:2rem;max-width:1100px;background:#fafaf7;color:#222}video,img{max-width:100%}td,th{padding:.5rem;text-align:left}section{margin-block:3rem}</style><h1>Hero hover continuity</h1><p>Preview: <a href="${base}">${base}</a>. Each trace tests first hover, four navigation crossings, six seconds of continuous movement including image-load events, offscreen return, keyboard focus and reduced motion. Videos are browser recordings; frame-level transforms are in <a href="browser-trace.json">the trace</a>.</p><table><tr><th>Case</th><th>Scale changes</th><th>Boundary resets</th><th>Hover clears</th><th>Max frame displacement</th></tr>${report.cases.map((c) => `<tr><td>${c.name}</td><td>${c.scaleChanges}</td><td>${c.boundaryResets}</td><td>${c.hoverClears}</td><td>${c.maxStep.toFixed(2)}px</td></tr>`).join("")}</table><section><h2>Chromium 1440×800</h2><video controls src="chromium-1440x800.webm"></video></section><section><h2>WebKit 1280×720</h2><video controls src="webkit-1280x720.webm"></video></section>`,
);
if (report.cases.some((result) => !result.passed)) process.exitCode = 1;
