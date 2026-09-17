import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, within } from "storybook/test";
import {
  PolicyTemplate,
  PolicyErrorTemplate,
  PolicyLoadingTemplate,
} from "./policy-template";

const meta = {
  title: "Templates/Policy",
  component: PolicyTemplate,
  parameters: { layout: "fullscreen" },
  args: {
    title: "Shipping & Delivery",
    html: '<p>Last updated: 17 September 2026</p><h2>Delivery in South Africa</h2><p>Free standard delivery applies to orders of R1,000 or more. Delivery charges below R1,000 are shown at checkout.</p><h2>Questions about your order</h2><p>Contact <a href="mailto:dione.smith@infusiondiffusion.co.za">dione.smith@infusiondiffusion.co.za</a>.</p>',
  },
} satisfies Meta<typeof PolicyTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Shipping & Delivery",
    );
    await expect(
      canvas.getByRole("navigation", { name: "Policies" }),
    ).toBeVisible();
  },
};
export const Mobile: Story = {
  ...Desktop,
  globals: { viewport: { value: "contact390", isRotated: false } },
};
export const Compact: Story = {
  ...Desktop,
  globals: { viewport: { value: "contact320", isRotated: false } },
};
export const LongContent: Story = {
  args: {
    html: Array.from(
      { length: 12 },
      (_, i) =>
        `<h2>Policy section ${i + 1}</h2><p>We handle order and account information to provide our services. You can contact Dione Smith at <a href="mailto:dione.smith@infusiondiffusion.co.za">dione.smith@infusiondiffusion.co.za</a> about your information and your rights.</p>`,
    ).join(""),
  },
  globals: { viewport: { value: "contact320", isRotated: false } },
};
export const Loading: Story = { render: () => <PolicyLoadingTemplate /> };
export const Unavailable: Story = {
  render: () => <PolicyErrorTemplate reset={fn()} />,
};
