"use client";

import { useEffect, useState } from "react";

/** Opt-in preview tool; never mounted by the production website layout. */
export function ViewportDiagnostics() {
  const [measurement, setMeasurement] = useState<string | null>(null);
  useEffect(() => {
    if (
      new URLSearchParams(window.location.search).get("viewport-debug") !== "1"
    )
      return;
    let frame = 0;
    let furthestScroll = -Infinity;
    let furthestMeasurement = "";
    const read = () => {
      const root = document.documentElement;
      const footer = Array.from(document.querySelectorAll("footer")).find(
        (node) => node.getBoundingClientRect().height > 0,
      );
      const box = footer?.getBoundingClientRect();
      const viewport = window.visualViewport;
      const rounded = (value: number | undefined) =>
        value === undefined ? "—" : Math.round(value);
      // Keep the bottom-of-page evidence even if iOS moves fixed elements
      // out of view. Scrolling back up must not replace this snapshot.
      if (scrollY >= furthestScroll) {
        furthestScroll = scrollY;
        furthestMeasurement = [
          `Furthest Y: ${rounded(scrollY)}`,
          `At furthest — doc: ${rounded(root.scrollHeight)}`,
          `Footer: ${rounded(box?.bottom)} / view: ${rounded(viewport?.height)}`,
          `Beyond end: ${rounded(scrollY + (viewport?.offsetTop ?? 0) + (viewport?.height ?? innerHeight) - root.scrollHeight)}`,
        ].join("\n");
      }
      setMeasurement(
        [
          `Page: ${window.location.pathname}`,
          `Window: ${rounded(innerWidth)} × ${rounded(innerHeight)}`,
          `Document: ${rounded(root.scrollHeight)} / body ${rounded(document.body.scrollHeight)}`,
          `Scroll Y: ${rounded(scrollY)}`,
          `Footer bottom: ${rounded(box?.bottom)}`,
          `After footer: ${rounded(box ? root.scrollHeight - (box.bottom + scrollY) : undefined)}`,
          `Visible height: ${rounded(viewport?.height)}`,
          `Visible top: ${rounded(viewport?.offsetTop)} / page ${rounded(viewport?.pageTop)}`,
          `Scale: ${viewport?.scale ?? "—"}`,
          "— Retained bottom reading —",
          furthestMeasurement,
        ].join("\n"),
      );
    };
    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(read);
    };
    read();
    // Native browser scrolling may not deliver DOM scroll/resize events.
    const interval = window.setInterval(schedule, 500);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.visualViewport?.addEventListener("scroll", schedule);
    window.visualViewport?.addEventListener("resize", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    return () => {
      cancelAnimationFrame(frame);
      clearInterval(interval);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.visualViewport?.removeEventListener("scroll", schedule);
      window.visualViewport?.removeEventListener("resize", schedule);
    };
  }, []);
  if (!measurement) return null;
  return (
    <details className="dark bg-content-surface text-content-primary border-navigation-border fixed top-24 right-2 z-[100] max-h-[calc(100dvh-8rem)] max-w-[calc(100vw-16px)] overflow-y-auto rounded border p-3 text-xs">
      <summary className="min-h-11 cursor-pointer content-center">
        Viewport check
      </summary>
      <pre className="whitespace-pre-wrap">{measurement}</pre>
    </details>
  );
}
