import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "Components/Field",
  component: Field,
  parameters: { layout: "centered" },
  args: {
    label: "Email address",
    description: "We only use this address for requested updates.",
    children: <Input type="email" placeholder="name@example.com" />,
  },
  decorators: [
    (Story) => (
      <div className="w-96 max-w-[calc(100vw-40px)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Required: Story = { args: { required: true } };
export const Optional: Story = { args: { optional: true } };
export const Invalid: Story = {
  args: { error: "Enter a valid email address." },
};
export const TextareaField: Story = {
  args: {
    label: "Fragrance consultation note",
    description:
      "Include the room size, time of day, and fragrance families you enjoy.",
    optional: true,
    children: (
      <Textarea placeholder="Describe the atmosphere you want to create." />
    ),
  },
};
export const LongContent: Story = {
  args: {
    label:
      "The email address where you would like to receive considered recommendations",
    error:
      "Enter a complete address so we can send your fragrance consultation notes without delay.",
  },
};
export const Midnight: Story = {
  decorators: [
    (Story) => (
      <div className="dark bg-background w-96 max-w-[calc(100vw-40px)] p-8">
        <Story />
      </div>
    ),
  ],
};
export const KeyboardAndErrorAssociation: Story = {
  args: { required: true, error: "Enter a valid email address." },
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Email address",
    });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(input).toHaveAccessibleDescription(
      "Enter a valid email address.",
    );
  },
};
