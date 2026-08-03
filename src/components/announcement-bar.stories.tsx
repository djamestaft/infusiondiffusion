import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { AnnouncementBar } from "@/components/announcement-bar";

const meta = {
  title: "Components/AnnouncementBar",
  component: AnnouncementBar,
  parameters: { layout: "fullscreen" },
  args: { message: "The first collection is taking shape." },
} satisfies Meta<typeof AnnouncementBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MessageOnly: Story = {};

export const WithLink: Story = {
  args: {
    message: "Discover fragrance for lived-in rooms.",
    link: { label: "Explore", href: "/collections" },
  },
};

export const LongContent: Story = {
  args: {
    message: "Complimentary delivery in South Africa on orders over R 1 500.",
  },
  globals: { viewport: { value: "mobile1", isRotated: false } },
};

export const Hidden: Story = {
  args: { message: "   " },
};
