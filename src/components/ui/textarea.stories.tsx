import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  args: { "aria-label": "Message", placeholder: "Tell us how we can help." },
  decorators: [
    (Story) => (
      <div className="w-96 max-w-[calc(100vw-40px)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Filled: Story = {
  args: {
    defaultValue:
      "I would like help choosing a fragrance for a sunlit living room.",
  },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Unavailable" },
};
export const ReadOnly: Story = {
  args: { readOnly: true, value: "This note has already been submitted." },
};
export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "Too short" },
};
export const LongContent: Story = {
  args: {
    defaultValue:
      "I am looking for a composed home fragrance that works from late afternoon into the evening without overwhelming a smaller room. Please share recommendations and care guidance for first-time diffuser use.",
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
export const Resizable: Story = {
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole("textbox", {
      name: "Message",
    });
    await expect(textarea).toBeVisible();
    await expect(getComputedStyle(textarea).resize).toBe("vertical");
  },
};
