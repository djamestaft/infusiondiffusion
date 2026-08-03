import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import {
  ContentHeader,
  Eyebrow,
  Heading,
  Lead,
} from "@/components/ui/content-primitives";

const meta = {
  title: "Components/ContentPrimitives",
  component: ContentHeader,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="bg-content-surface min-h-screen px-5 py-16 sm:px-20">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Choose atmosphere with intention.",
    headingLevel: 2,
    headingTreatment: "headline",
    context: { type: "eyebrow", label: "The fragrance library" },
    lead: "Compare fragrance character, room context, format and care before choosing the piece that belongs in your home.",
  },
} satisfies Meta<typeof ContentHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole("heading", {
        level: 2,
        name: "Choose atmosphere with intention.",
      }),
    ).toBeInTheDocument();
  },
};

export const EyebrowPrimitive: Story = {
  render: () => <Eyebrow>The fragrance library</Eyebrow>,
};

export const HeadingPrimitive: Story = {
  render: () => (
    <Heading level={2} treatment="headline">
      Choose atmosphere with intention.
    </Heading>
  ),
};

export const LeadPrimitive: Story = {
  render: () => <Lead>Concrete context supports the expressive heading.</Lead>,
};

export const WithBadge: Story = {
  args: {
    context: { type: "badge", label: "Gift edit", variant: "accent" },
  },
};

export const Centered: Story = {
  args: {
    align: "center",
    context: { type: "badge", label: "Gift edit", variant: "accent" },
    title: "A considered gesture for lived-in rooms.",
  },
};

export const WithButton: Story = {
  args: {
    action: {
      type: "button",
      label: "Explore fragrances",
      href: "#fragrances",
    },
  },
};

export const WithTextLink: Story = {
  args: {
    action: {
      type: "link",
      label: "Read the collection story",
      href: "#story",
    },
  },
};

export const Midnight: Story = {
  args: {
    align: "center",
    context: { type: "badge", label: "Gift edit", variant: "accent" },
    title: "A considered gesture for lived-in rooms.",
    lead: "Gift-worthy fragrance with clear format, care and delivery guidance.",
    action: {
      type: "button",
      label: "View the gift edit",
      href: "#gift-edit",
    },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-content-surface px-5 py-24 sm:px-20">
        <Story />
      </div>
    ),
  ],
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  args: {
    headingTreatment: "title",
    action: {
      type: "button",
      label: "Explore fragrances",
      href: "#fragrances",
    },
  },
};

export const LongContent: Story = {
  args: {
    context: {
      type: "badge",
      label: "Seasonal collection with intentionally extended editorial copy",
    },
    title:
      "Fragrance for rooms that gather people, hold memory, and change gently through the day.",
    lead: "A deliberately extended introduction proves that editorial content remains readable without clipping, destructive truncation, or a page-specific typography override when descriptions grow through translation or careful product explanation.",
    action: {
      type: "button",
      label: "Read the collection story",
      href: "#collection-story",
    },
  },
};
