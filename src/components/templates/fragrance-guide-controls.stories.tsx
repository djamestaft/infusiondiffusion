import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { GuideChoice } from "./fragrance-guide-controls";
const meta = {
  title: "Molecules/Guide Choice",
  component: GuideChoice,
  args: { label: "Living room", name: "room", selected: false, onChange: fn() },
  decorators: [
    (Story) => (
      <div className="max-w-[600px] p-5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof GuideChoice>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Selected: Story = { args: { selected: true } };
export const Multiple: Story = {
  args: { label: "Amber & vanilla", multiple: true, selected: true },
};
export const LongLabel: Story = {
  args: {
    label:
      "A generously proportioned living room with an unusually long descriptive name",
  },
};
export const Keyboard: Story = {
  render: function Controlled(args) {
    const [selected, setSelected] = useState(false);
    return (
      <GuideChoice
        {...args}
        selected={selected}
        onChange={() => setSelected(!selected)}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("radio");
    input.focus();
    await userEvent.keyboard(" ");
    await expect(input).toBeChecked();
    await expect(input).toHaveFocus();
  },
};
