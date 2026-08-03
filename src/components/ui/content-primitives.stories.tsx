import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ContentHeader,
  Eyebrow,
  Heading,
  Lead,
} from "@/components/ui/content-primitives";
import { TextLink } from "@/components/ui/text-link";

const meta = {
  title: "Components/ContentPrimitives",
  component: ContentHeader,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-[#fcfaf5] px-5 py-16 sm:px-20">
        <Story />
      </div>
    ),
  ],
  args: {
    title: "Choose atmosphere with intention.",
    headingLevel: 2,
    headingTreatment: "headline",
    eyebrow: <Eyebrow>The fragrance library</Eyebrow>,
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

export const IndividualPrimitives: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <Eyebrow>The fragrance library</Eyebrow>
      <Heading level={2} treatment="headline">
        Choose atmosphere with intention.
      </Heading>
      <Lead>Concrete context supports the expressive heading.</Lead>
    </div>
  ),
};

export const WithBadge: Story = {
  args: {
    eyebrow: undefined,
    badge: <Badge variant="accent">Gift edit</Badge>,
  },
};

export const Centered: Story = {
  args: {
    align: "center",
    eyebrow: undefined,
    badge: <Badge variant="accent">Gift edit</Badge>,
    title: "A considered gesture for lived-in rooms.",
  },
};

export const WithButton: Story = {
  args: {
    action: (
      <Button asChild>
        <a href="#fragrances">Explore fragrances</a>
      </Button>
    ),
  },
};

export const WithTextLink: Story = {
  args: {
    action: (
      <TextLink href="#story" variant="standalone">
        Read the collection story
      </TextLink>
    ),
  },
};

export const Midnight: Story = {
  args: {
    align: "center",
    eyebrow: undefined,
    badge: <Badge variant="accent">Gift edit</Badge>,
    title: "A considered gesture for lived-in rooms.",
    lead: "Gift-worthy fragrance with clear format, care and delivery guidance.",
    action: (
      <Button asChild>
        <a href="#gift-edit">View the gift edit</a>
      </Button>
    ),
  },
  decorators: [
    (Story) => (
      <div className="dark bg-[#11110f] px-5 py-24 sm:px-20">
        <Story />
      </div>
    ),
  ],
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  args: {
    headingTreatment: "title",
    action: (
      <Button asChild>
        <a href="#fragrances">Explore fragrances</a>
      </Button>
    ),
  },
};

export const LongContent: Story = {
  args: {
    eyebrow: undefined,
    badge: (
      <Badge>
        Seasonal collection with intentionally extended editorial copy
      </Badge>
    ),
    title:
      "Fragrance for rooms that gather people, hold memory, and change gently through the day.",
    lead: "A deliberately extended introduction proves that editorial content remains readable without clipping, destructive truncation, or a page-specific typography override when descriptions grow through translation or careful product explanation.",
    action: (
      <Button asChild>
        <a href="#collection-story">Read the collection story</a>
      </Button>
    ),
  },
};
