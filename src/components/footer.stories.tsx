import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Footer } from "@/components/footer";

const meta = {
  title: "Components/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Footer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Desktop: Story = {
  globals: { viewport: { value: "desktop", isRotated: false } },
  play: async ({ canvasElement }) => {
    const links = within(
      within(canvasElement).getByRole("navigation", { name: "Footer" }),
    ).getAllByRole("link");
    await expect(links.map((link) => link.textContent)).toEqual([
      "Shop",
      "Fragrance Guide",
      "About",
      "Contact",
    ]);
    for (const link of links)
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(
        44,
      );
  },
};
export const Tablet: Story = {
  ...Desktop,
  globals: { viewport: { value: "tablet", isRotated: false } },
};
export const Mobile: Story = {
  ...Desktop,
  globals: { viewport: { value: "contact390", isRotated: false } },
};
export const MobileCompact: Story = {
  ...Desktop,
  globals: { viewport: { value: "contact320", isRotated: false } },
};
