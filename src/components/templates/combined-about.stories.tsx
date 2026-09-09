import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  CombinedAboutTemplate,
  type CombinedAboutProps,
} from "./combined-about";
import fixture from "./combined-about.fixture.json";

const meta = {
  title: "Templates/Combined About",
  component: CombinedAboutTemplate,
  args: fixture as CombinedAboutProps,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "INF-35: approved About 2426:516/614/708/796. Gallery snapshot from published, rights-confirmed Sanity media on 9 September 2026; editorial copy from approved Figma and existing fallbacks. Runtime uses live Sanity data.",
      },
    },
  },
} satisfies Meta<typeof CombinedAboutTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  globals: { viewport: { value: "foundationDesktop" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("heading", { name: "Guidance and encouragement" }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getAllByRole("button", { name: /^View / }),
    ).toHaveLength(9);
    await expect(
      canvas.queryByText("Blanc De Blanc — Travertine Light"),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("heading", { name: "The Market Table" }),
    ).toBeVisible();
  },
};
export const Tablet: Story = {
  globals: { viewport: { value: "homepageTablet" } },
};
export const Mobile: Story = { globals: { viewport: { value: "contact390" } } };
export const Small: Story = { globals: { viewport: { value: "contact320" } } };
export const GalleryKeyboard: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opener = canvas.getByRole("button", {
      name: "View Santuaire Serein — Botanical Light",
    });
    opener.focus();
    await userEvent.keyboard("{Enter}");
    const body = within(canvasElement.ownerDocument.body);
    await expect(body.getByRole("dialog")).toBeVisible();
    await expect(
      body.getByRole("heading", { name: "Santuaire Serein — Botanical Light" }),
    ).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(body.queryByRole("dialog")).not.toBeInTheDocument();
    await expect(opener).toHaveFocus();
  },
};
export const MissingMedia: Story = {
  args: { gallery: undefined, heroImage: undefined },
};
export const Unavailable: Story = {
  args: {
    gallery: {
      ...fixture.gallery,
      campaignItems: [],
      marketItems: [],
      unavailable: true,
    },
    heroImage: undefined,
  },
};
export const LongContent: Story = {
  globals: { viewport: { value: "contact320" } },
  args: {
    page: {
      ...fixture.page,
      chapters: fixture.page.chapters as CombinedAboutProps["page"]["chapters"],
      title:
        "The story behind the atmosphere and the rooms we return to, through every season.",
      introduction: Array(3).fill(fixture.page.introduction).join(" "),
    },
  },
};
