import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Badge } from "@/components/ui/badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  args: { children: "New", variant: "neutral" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const badge = canvas.getByText("New");
    await expect(badge).toHaveAttribute("data-slot", "badge");
    await expect(badge).not.toHaveAttribute("role", "status");
  },
};

export const Accent: Story = {
  args: { children: "Limited", variant: "accent" },
};

export const LongContent: Story = {
  args: {
    children: "Seasonal collection with intentionally extended editorial copy",
  },
  render: (args) => (
    <div className="w-64">
      <Badge {...args} />
    </div>
  ),
};

export const Midnight: Story = {
  render: () => (
    <div className="dark flex flex-wrap gap-4 bg-[#11110f] p-8">
      <Badge>New</Badge>
      <Badge variant="accent">Gift edit</Badge>
    </div>
  ),
};
