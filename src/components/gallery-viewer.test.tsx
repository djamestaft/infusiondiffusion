import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import {
  galleryMarketAspectRatio,
  galleryMarketImageStyle,
  galleryThumbnailStyle,
  GalleryViewer,
} from "@/components/gallery-viewer";

const items = [
  {
    id: "one",
    title: "Quiet ritual",
    caption: "An authored caption.",
    image: { src: "data:image/svg+xml,test", alt: "A factual first image" },
  },
  {
    id: "two",
    title: "Evening atmosphere",
    caption: "Another authored caption.",
    image: { src: "data:image/svg+xml,test", alt: "A factual second image" },
  },
];

afterEach(cleanup);

describe("GalleryViewer", () => {
  it("derives the documentary slot ratio from projected dimensions and crop", () => {
    expect(
      galleryMarketAspectRatio(
        {
          ...items[0],
          image: {
            ...items[0].image,
            dimensions: { width: 720, height: 1280, aspectRatio: 9 / 16 },
            crop: { left: 0, right: 0, top: 0.125, bottom: 0.125 },
          },
        },
        1,
      ),
    ).toBe(3 / 4);
    expect(
      galleryMarketImageStyle({
        ...items[0],
        image: {
          ...items[0].image,
          crop: { left: 0, right: 0, top: 0.125, bottom: 0.125 },
        },
      }),
    ).toEqual({ objectPosition: "50% 50%" });
  });

  it("applies authored crop edges while preserving the hotspot anchor", () => {
    expect(
      galleryThumbnailStyle({
        ...items[0],
        image: {
          ...items[0].image,
          hotspot: { x: 0.25, y: 0.75 },
          crop: { left: 0.1, top: 0.2, right: 0.1, bottom: 0.1 },
        },
      }),
    ).toEqual({
      objectPosition: "25% 75%",
      transform: "scale(1.25, 1.4285714285714284)",
      transformOrigin: "50% 54.99999999999999%",
    });
  });

  it("renders the documentary layout with H3 items and lazy media", () => {
    render(
      <GalleryViewer
        items={items}
        layout="market"
        headingLevel={3}
        prioritizeFirst={false}
      />,
    );

    const grid = screen.getByTestId("gallery-grid");
    expect(grid).toHaveAttribute("data-layout", "market");
    expect(grid).toHaveClass(
      "gap-y-4",
      "lg:grid-cols-3",
      "min-[1408px]:!grid-cols-[repeat(3,minmax(0,400px))]",
    );
    expect(grid.children[1]).toHaveClass("min-[1408px]:w-[416px]");
    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "View Quiet ritual" }),
    ).toHaveClass("aspect-video");
    expect(
      screen.getByRole("button", { name: "View Evening atmosphere" }),
    ).toHaveClass("aspect-3/4");
    const images = screen.getAllByRole("img");
    expect(images[0]).toHaveAttribute("loading", "lazy");
  });

  it("opens from a titled thumbnail and maintains honest navigation boundaries", async () => {
    const user = userEvent.setup();
    render(<GalleryViewer items={items} />);
    const trigger = screen.getByRole("button", { name: "View Quiet ritual" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(screen.getByText("Image 1 of 2")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Previous image" }),
    ).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Next image" }));
    expect(screen.getByText("Image 2 of 2")).toBeVisible();
    expect(screen.getByRole("button", { name: "Next image" })).toBeDisabled();
    await user.click(
      screen.getByRole("button", { name: "Close gallery viewer" }),
    );
    expect(trigger).toHaveFocus();
  });

  it("focuses Close initially and restores the invoking thumbnail after Escape", async () => {
    const user = userEvent.setup();
    render(<GalleryViewer items={items} />);
    const trigger = screen.getByRole("button", { name: "View Quiet ritual" });
    await user.click(trigger);
    const close = screen.getByRole("button", { name: "Close gallery viewer" });
    expect(close).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });

  it("retains an understandable failed image slot and viewer exit path", async () => {
    const user = userEvent.setup();
    render(<GalleryViewer items={items} />);
    fireEvent.error(screen.getByRole("img", { name: "A factual first image" }));
    expect(screen.getByText("A factual first image")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "View Quiet ritual" }));
    expect(screen.getAllByText("A factual first image")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: "Close gallery viewer" }),
    ).toBeVisible();
  });

  it("omits navigation for a single item", async () => {
    const user = userEvent.setup();
    render(<GalleryViewer items={[items[0]]} />);
    await user.click(screen.getByRole("button", { name: "View Quiet ritual" }));
    expect(screen.getByText("Image 1 of 1")).toBeVisible();
    expect(screen.queryByRole("button", { name: "Previous image" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Next image" })).toBeNull();
  });
});
