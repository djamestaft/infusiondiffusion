import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FeedbackAlert } from "@/components/ui/feedback-alert";

const meta = {
  title: "Components/FeedbackAlert",
  component: FeedbackAlert,
  parameters: { layout: "centered" },
  args: {
    title: "Delivery information",
    children: "Orders are dispatched on business days after confirmation.",
    className: "w-[min(38.75rem,calc(100vw-2.5rem))]",
  },
} satisfies Meta<typeof FeedbackAlert>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Info: Story = { args: { tone: "info" } };
export const Success: Story = {
  args: {
    tone: "success",
    title: "Saved successfully",
    children: "Your delivery preference has been updated.",
    announcement: "status",
  },
};
export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Limited availability",
    children: "Only a small quantity remains for this fragrance.",
  },
};
export const Error: Story = {
  args: {
    tone: "error",
    title: "We could not save this",
    children: "Check your connection and try again.",
    announcement: "alert",
  },
};
export const WithoutTitle: Story = {
  args: {
    title: undefined,
    children: "Orders are dispatched on business days after confirmation.",
  },
};
export const LongContent: Story = {
  args: {
    title:
      "We could not confirm the delivery preference for this unusually detailed destination",
    children:
      "Check your connection and try again. If the problem continues, keep your current selection and contact support with the delivery destination and the items you intended to order so that nothing important is lost.",
  },
};
export const Midnight: Story = {
  args: {
    tone: "warning",
    title: "Limited availability",
    children: "Only a small quantity remains for this fragrance.",
  },
  decorators: [
    (Story) => (
      <div className="dark bg-background p-8">
        <Story />
      </div>
    ),
  ],
};
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
