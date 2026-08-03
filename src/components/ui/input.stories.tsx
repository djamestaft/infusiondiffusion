import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Input } from "@/components/ui/input";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "centered" },
  args: { "aria-label": "Email address", placeholder: "name@example.com" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const EmailFilled: Story = {
  args: { type: "email", value: "amara@example.com", readOnly: true },
};
export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Unavailable" },
};
export const ReadOnly: Story = { args: { readOnly: true, value: "REF-1048" } };
export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "not-an-email" },
};
export const LongValue: Story = {
  args: {
    value: "averylongemailaddressfortesting@exampleinternationaldomain.co.za",
    readOnly: true,
  },
};
export const Midnight: Story = {
  decorators: [
    (Story) => (
      <div className="dark bg-background w-80 p-8">
        <Story />
      </div>
    ),
  ],
};
export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="w-[calc(100vw-40px)] max-w-80">
        <Story />
      </div>
    ),
  ],
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
export const KeyboardFocus: Story = {
  play: async ({ canvasElement }) => {
    const input = within(canvasElement).getByRole("textbox", {
      name: "Email address",
    });
    await userEvent.tab();
    await expect(input).toHaveFocus();
    await expect(input.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
  },
};
