import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FragranceGuideTemplate } from "./fragrance-guide";

const approvedShortlist = [
  {
    title: "Ambre Egyptian",
    description:
      "Strongest for a warm, enveloping evening with amber, vanilla and sandalwood.",
    href: "/products/ambre-egyptian",
  },
  {
    title: "Été Mystique",
    description:
      "A more mysterious evening profile with fig, night florals, incense, amber and musk.",
    href: "/products/ete-mystique",
  },
  {
    title: "Noir de la Nuit",
    description:
      "A balanced fresh-to-warm journey: citrus and eucalyptus settle into spice, woods and amber.",
    href: "/products/noir-de-la-nuit",
  },
];
const meta = {
  title: "Templates/Fragrance Guide Variation 02",
  component: FragranceGuideTemplate,
  args: { onContinue: fn() },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Approved Figma layout 2172:2 and 2457:601/749/897. Storybook-only preparation: sample rankings and product links are design references, not a validated matching engine. The live Guide is unchanged pending INF-27 matching approval.",
      },
    },
  },
} satisfies Meta<typeof FragranceGuideTemplate>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Desktop: Story = {
  globals: { viewport: { value: "foundationDesktop" } },
  args: {
    initialQuestion: 1,
    initialAnswers: [
      ["Bedroom"],
      ["Soft & restful"],
      ["Amber & vanilla"],
      ["Noticeable balance"],
      ["Evening"],
    ],
    shortlist: approvedShortlist,
  },
};
export const Tablet: Story = {
  ...Desktop,
  globals: { viewport: { value: "homepageTablet" } },
};
export const Mobile: Story = {
  ...Desktop,
  globals: { viewport: { value: "contact390" } },
};
export const Small: Story = {
  ...Desktop,
  globals: { viewport: { value: "contact320" } },
};
export const Empty: Story = {};
export const TwoNotesAndValidation: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "CONTINUE" }));
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Choose an answer for each question",
    );
    await expect(
      canvas.getByRole("radio", { name: "Living room" }),
    ).toHaveFocus();
    await userEvent.keyboard(" ");
    await userEvent.click(
      canvas.getByRole("radio", { name: "Soft & restful" }),
    );
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Soft florals" }),
    );
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Spice & woods" }),
    );
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Spa-like calm" }),
    );
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Choose up to two",
    );
    await expect(
      canvas.getByRole("checkbox", { name: "Spa-like calm" }),
    ).not.toBeChecked();
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Soft florals" }),
    );
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Spa-like calm" }),
    );
    await userEvent.click(
      canvas.getByRole("radio", { name: "Quiet background" }),
    );
    await userEvent.click(canvas.getByRole("radio", { name: "Any time" }));
    await userEvent.click(canvas.getByRole("button", { name: "BACK" }));
    await expect(
      canvas.getByRole("radio", { name: "Quiet background" }),
    ).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "CONTINUE" }));
    await expect(args.onContinue).toHaveBeenCalledWith([
      ["Living room"],
      ["Soft & restful"],
      ["Spice & woods", "Spa-like calm"],
      ["Quiet background"],
      ["Any time"],
    ]);
    await expect(canvas.queryByRole("alert")).not.toBeInTheDocument();
  },
};
