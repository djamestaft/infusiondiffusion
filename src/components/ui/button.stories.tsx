import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowUpRight } from "lucide-react";
import { expect, fn, userEvent, within } from "storybook/test";

import { Button } from "@/components/ui/button";

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  args: { children: "Shop fragrance" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
export const Secondary: Story = { args: { variant: "secondary" } };
export const Quiet: Story = { args: { variant: "quiet" } };
export const Large: Story = {
  args: { size: "large", children: "Explore the collection" },
};
export const Icon: Story = {
  args: {
    size: "icon",
    "aria-label": "Open collection",
    children: (
      <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={1.75} />
    ),
  },
};
export const AsLink: Story = {
  args: {
    asChild: true,
    children: (
      <a href="#collection">
        Explore the collection
        <ArrowUpRight
          aria-hidden="true"
          className="size-4"
          strokeWidth={1.75}
        />
      </a>
    ),
  },
};
export const Loading: Story = { args: { loading: true } };
export const Disabled: Story = { args: { disabled: true } };
export const LongLabel: Story = {
  args: {
    children: "Explore every fragrance in the complete seasonal collection",
  },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};
export const Midnight: Story = {
  args: { variant: "primary" },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-12">
        <Story />
      </div>
    ),
  ],
};
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    await expect(canvas.getByRole("button")).toHaveFocus();
  },
};
export const LoadingPreventsRepeatActivation: Story = {
  args: { loading: true, onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await expect(button).toBeDisabled();
    await expect(button).toHaveAttribute("aria-busy", "true");
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
