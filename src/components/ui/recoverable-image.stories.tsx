import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { RecoverableImage } from "./recoverable-image";

const meta = {
  title: "Components/RecoverableImage",
  component: RecoverableImage,
  args: {
    src: "/images/products/fixtures/bois-de-santal.png",
    alt: "Bois De Santal reed diffuser",
    fill: true,
    sizes: "280px",
    className: "object-contain",
  },
  decorators: [
    (Story) => (
      <div className="relative size-[280px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RecoverableImage>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Loaded: Story = {};
export const Failed: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole("img").dispatchEvent(new Event("error"));
    await expect(await canvas.findByText("Image unavailable")).toBeVisible();
    await expect(canvas.queryByRole("img")).not.toBeInTheDocument();
  },
};
