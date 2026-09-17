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
  globals: { viewport: { value: "foundationDesktop", isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", { name: "Explore" }),
    ).toBeVisible();
    const email = canvas.getByRole("link", {
      name: "dione.smith@infusiondiffusion.co.za",
    });
    await expect(email).toHaveAttribute(
      "href",
      "mailto:dione.smith@infusiondiffusion.co.za",
    );
    await expect(email.getBoundingClientRect().height).toBeGreaterThanOrEqual(
      44,
    );
    const links = within(
      within(canvasElement).getByRole("navigation", { name: "Footer" }),
    ).getAllByRole("link");
    await expect(links.map((link) => link.textContent)).toEqual([
      "Shop",
      "Fragrance Guide",
      "About",
      "Contact",
    ]);
    const policyLinks = within(
      canvas.getByRole("navigation", { name: "Policies" }),
    ).getAllByRole("link");
    await expect(policyLinks.map((link) => link.getAttribute("href"))).toEqual([
      "/policies/terms-and-conditions",
      "/policies/shipping",
      "/policies/returns",
      "/policies/privacy",
    ]);
    for (const link of [...links, ...policyLinks])
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(
        44,
      );
  },
};
export const Tablet: Story = {
  ...Desktop,
  globals: { viewport: { value: "homepageTablet", isRotated: false } },
};
export const Mobile: Story = {
  ...Desktop,
  globals: { viewport: { value: "contact390", isRotated: false } },
};
export const MobileCompact: Story = {
  ...Desktop,
  globals: { viewport: { value: "contact320", isRotated: false } },
};
