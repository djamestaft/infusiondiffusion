import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { GalleryViewer } from "@/components/gallery-viewer";
import type { GalleryItem } from "@/sanity/lib/editorial-pages";

const fixture = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="600" height="760"><rect width="600" height="760" fill="#DDE2D4"/><rect x="160" y="100" width="280" height="560" fill="#45483A"/></svg>')}`;
const items: GalleryItem[] = [
  {
    id: "quiet",
    title: "Quiet ritual",
    caption: "A considered moment in a lived-in room.",
    image: {
      src: fixture,
      alt: "Test-only gallery fixture showing a dark vessel",
    },
  },
  {
    id: "material",
    title: "Material study",
    caption: "Light, vessel and fragrance in conversation.",
    image: {
      src: fixture,
      alt: "Test-only gallery fixture showing a fragrance vessel",
    },
  },
  {
    id: "evening",
    title: "Evening atmosphere",
    caption: "A room settling into the evening.",
    image: { src: fixture, alt: "Test-only gallery fixture showing a room" },
  },
  {
    id: "corner",
    title: "A considered corner",
    caption: "A detail from an everyday interior.",
    image: {
      src: fixture,
      alt: "Test-only gallery fixture showing an interior detail",
    },
  },
];

const meta = {
  title: "Components/GalleryViewer",
  component: GalleryViewer,
  parameters: { layout: "padded" },
} satisfies Meta<typeof GalleryViewer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Populated: Story = { args: { items } };
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  args: { items },
};
export const OneItem: Story = { args: { items: [items[0]] } };
export const MaximumContent: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  args: {
    items: Array.from({ length: 10 }, (_, index) => ({
      ...items[index % items.length],
      id: `item-${index}`,
      title: `title-${"unbroken-".repeat(8)}${index}`,
      caption: "caption-".repeat(150),
    })),
  },
};
export const MalformedLegacyCaption: Story = {
  args: {
    items: [
      {
        ...items[0],
        caption: "Additional details are unavailable for this image.",
      },
    ],
  },
};
export const ImageFailure: Story = {
  args: {
    items: [
      {
        ...items[0],
        image: {
          src: "https://cdn.sanity.io/missing-gallery-fixture.jpg",
          alt: "Test-only failed gallery image",
        },
      },
    ],
  },
};
export const ViewerFirst: Story = {
  args: { items },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "View Quiet ritual" }),
    );
    const page = within(document.body);
    await expect(page.getByRole("dialog")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Previous image" }),
    ).toBeDisabled();
  },
};
export const ViewerMiddle: Story = {
  args: { items },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "View Material study" }),
    );
    const page = within(document.body);
    await expect(
      page.getByRole("button", { name: "Previous image" }),
    ).toBeEnabled();
    await expect(
      page.getByRole("button", { name: "Next image" }),
    ).toBeEnabled();
  },
};
export const ReducedMotion: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  args: { items },
};
