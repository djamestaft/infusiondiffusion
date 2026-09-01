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
export const Destructive: Story = {
  args: { variant: "destructive", children: "Remove item" },
};
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
export const LoadingLink: Story = {
  args: {
    asChild: true,
    loading: true,
    children: <a href="#collection">Explore the collection</a>,
  },
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: "Explore the collection",
    });
    await expect(link).toHaveAttribute("aria-busy", "true");
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(link).toHaveAttribute("tabindex", "-1");
    await expect(link.querySelector("svg")).toBeVisible();
  },
};
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
export const MidnightRoles: Story = {
  render: () => (
    <div className="dark bg-background flex flex-wrap items-center gap-4 p-12">
      <Button>Shop fragrance</Button>
      <Button variant="secondary">Shop fragrance</Button>
      <Button variant="quiet">Shop fragrance</Button>
      <Button variant="destructive">Remove item</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const buttons = within(canvasElement).getAllByRole("button");
    await expect(buttons).toHaveLength(4);
    for (const button of buttons) {
      await expect(button).toBeVisible();
      await expect(
        button.getBoundingClientRect().height,
      ).toBeGreaterThanOrEqual(44);
    }
  },
};
export const MobileReflow: Story = {
  args: {
    children:
      "Explore every fragrance in the complete seasonal collection for your home",
  },
  decorators: [
    (Story) => (
      <div className="w-[calc(100vw-40px)] max-w-80">
        <Story />
      </div>
    ),
  ],
  globals: { viewport: { value: "contact390", isRotated: false } },
  play: async ({ canvasElement }) => {
    const button = within(canvasElement).getByRole("button");
    await expect(button).toBeVisible();
    await expect(button).toHaveTextContent("complete seasonal collection");
    const bounds = button.getBoundingClientRect();
    await expect(bounds.height).toBeGreaterThan(44);
    await expect(bounds.width).toBeLessThanOrEqual(320);
  },
};
export const MobileReflow320: Story = {
  ...MobileReflow,
  globals: { viewport: { value: "contact320", isRotated: false } },
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
