import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowUpRight } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";

import { TextLink } from "@/components/ui/text-link";

const meta = {
  title: "Components/TextLink",
  component: TextLink,
  parameters: { layout: "centered" },
  args: { href: "#delivery", children: "View delivery details" },
} satisfies Meta<typeof TextLink>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  decorators: [
    (Story) => (
      <p className="max-w-lg text-base leading-7">
        Complimentary delivery applies to qualifying orders. <Story />
      </p>
    ),
  ],
};
export const Standalone: Story = {
  args: {
    variant: "standalone",
    children: "Explore the collection",
    icon: <ArrowUpRight className="size-4" strokeWidth={1.75} />,
  },
};
export const Inverse: Story = {
  args: { variant: "inverse", children: "Explore the collection" },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-12">
        <Story />
      </div>
    ),
  ],
};
export const LongLabel: Story = {
  args: {
    variant: "standalone",
    children:
      "Read detailed delivery and returns information for South African orders",
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("link")).toHaveFocus();
  },
};
