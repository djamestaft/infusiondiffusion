import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import {
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
