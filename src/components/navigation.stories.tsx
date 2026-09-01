import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { userEvent, within } from "storybook/test";

import { Navigation } from "@/components/navigation";

const meta = {
  title: "Components/Navigation",
  component: Navigation,
  parameters: { layout: "fullscreen" },
  args: { currentHref: "/shop" },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ivory: Story = {};

export const CurrentAbout: Story = {
  args: { currentHref: "/about" },
};

export const CurrentContact: Story = {
  args: { currentHref: "/contact" },
};

export const CurrentContactMobileOpen: Story = {
  args: { currentHref: "/contact" },
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open menu" }),
    );
  },
};

export const CurrentAboutMobileOpen: Story = {
  args: { currentHref: "/about" },
  globals: { viewport: { value: "mobile1", isRotated: false } },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open menu" }),
    );
  },
};

export const Midnight: Story = {
  args: { theme: "midnight" },
};

export const ProvisionedAccount: Story = {
  args: { accountHref: "/account" },
};

export const MobileClosed: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
};

export const MobileOpen: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
  play: async ({ canvasElement }) => {
    await userEvent.click(
      within(canvasElement).getByRole("button", { name: "Open menu" }),
    );
  },
};

export const MobileOpen320: Story = {
  globals: { viewport: { value: "contact320", isRotated: false } },
  play: MobileOpen.play,
};

export const LongLabels: Story = {
  args: {
    destinations: [
      { label: "Shop the complete collection", href: "/shop" },
      { label: "A considered guide to fragrance", href: "/fragrance-guide" },
      { label: "About Infusion Diffusion", href: "/about" },
      { label: "Contact our fragrance studio", href: "/contact" },
    ],
  },
};

export const EmptyDestinations: Story = {
  args: { destinations: [] },
};
