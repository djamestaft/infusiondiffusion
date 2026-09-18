import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { EditorialImage } from "./editorial-image";

describe("editorial art direction", () => {
  afterEach(cleanup);
  it("provides a phone source and one accessible fallback image", () => {
    const { container } = render(
      <EditorialImage
        image={{
          src: "/desktop.png",
          mobileSrc: "/phone.png",
          alt: "A diffuser and gift bag",
        }}
      />,
    );
    expect(container.querySelectorAll("img")).toHaveLength(1);
    expect(container.querySelector("source")?.getAttribute("media")).toBe(
      "(max-width: 639px)",
    );
    expect(container.querySelector("source")?.getAttribute("srcset")).toContain(
      "phone.png",
    );
    expect(screen.getByRole("img").getAttribute("src")).toContain(
      "desktop.png",
    );
  });
  it("keeps desktop as the fallback when phone artwork is absent", () => {
    const { container } = render(
      <EditorialImage image={{ src: "/desktop.png", alt: "Gift packaging" }} />,
    );
    expect(container.querySelector("source")).toBeNull();
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Gift packaging");
  });
  it("removes failed decorative media without adding an inaccessible label", () => {
    const { container } = render(
      <EditorialImage
        image={{ src: "/broken.png", alt: "Packaging" }}
        decorative
      />,
    );
    fireEvent.error(container.querySelector("img")!);
    expect(container.querySelector("picture")).toBeNull();
  });
});
