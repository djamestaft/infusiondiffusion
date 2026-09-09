import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FragranceGuideTemplate } from "./fragrance-guide";

import { shopifyE2EProducts } from "@/lib/shopify/e2e-fixtures";

const meta = {
  title: "Templates/Fragrance Guide Variation 02",
  component: FragranceGuideTemplate,
  args: { onContinue: fn(), products: shopifyE2EProducts },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Approved Figma layout 2172:2 and 2457:601/749/897. The live route provides preference controls, a summary and source-backed suggestions. Owner-approved note/character matching resolves products by GID. Other four answers remain summary-only.",
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
    initialReviewed: true,
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
export const SourceUnavailable: Story = {
  ...Desktop,
  args: { ...Desktop.args, products: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(/Fragrance suggestions are temporarily unavailable/),
    ).toBeVisible();
    await expect(
      canvas.queryByRole("region", { name: "Suggested fragrances" }),
    ).not.toBeInTheDocument();
    await expect(
      canvas.getByRole("link", { name: "EXPLORE THE COLLECTION" }),
    ).toHaveAttribute("href", "/shop");
  },
};
export const NoProducts: Story = {
  ...Desktop,
  args: { ...Desktop.args, products: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(/No fragrances with an approved connection/),
    ).toBeVisible();
    await expect(
      canvas.queryByRole("region", { name: "Suggested fragrances" }),
    ).not.toBeInTheDocument();
  },
};
export const SoldOut: Story = {
  ...Desktop,
  args: {
    ...Desktop.args,
    products: shopifyE2EProducts.map((p) => ({
      ...p,
      availableForSale: false,
    })),
  },
  play: async ({ canvasElement }) => {
    const region = within(
      within(canvasElement).getByRole("region", {
        name: "Suggested fragrances",
      }),
    );
    await expect(region.getAllByText("Currently unavailable")).toHaveLength(3);
    await expect(region.queryByRole("button")).not.toBeInTheDocument();
  },
};
export const OneMatch: Story = {
  ...Desktop,
  args: {
    ...Desktop.args,
    initialAnswers: [
      ["Bedroom"],
      ["Soft & restful"],
      ["Spa-like calm"],
      ["Quiet background"],
      ["Any time"],
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const region = within(
      canvas.getByRole("region", { name: "Suggested fragrances" }),
    );
    await expect(region.getAllByRole("link")).toHaveLength(1);
    await expect(region.getByRole("link")).toHaveTextContent(
      "Santuaire Serein",
    );
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Spa-like calm" }),
    );
    await expect(
      canvas.queryByRole("region", { name: "Suggested fragrances" }),
    ).not.toBeInTheDocument();
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Amber & vanilla" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "CONTINUE" }));
    const updated = within(
      canvas.getByRole("region", { name: "Suggested fragrances" }),
    );
    await expect(updated.getAllByRole("link")).toHaveLength(3);
    await expect(updated.getAllByRole("link")[0]).toHaveTextContent(
      "Ambre Egyptian",
    );
  },
};
export const TwoMatches: Story = {
  ...Desktop,
  args: {
    ...Desktop.args,
    products: shopifyE2EProducts.filter(
      (p) => p.id.endsWith("10067255558430") || p.id.endsWith("10067255394590"),
    ),
  },
  play: async ({ canvasElement }) => {
    const region = within(
      within(canvasElement).getByRole("region", {
        name: "Suggested fragrances",
      }),
    );
    await expect(region.getAllByRole("link")).toHaveLength(2);
  },
};
export const LongContent: Story = {
  ...Desktop,
  args: {
    ...Desktop.args,
    products: shopifyE2EProducts.map((p) => ({
      ...p,
      title: p.title + " with an unusually long editorial product name",
    })),
  },
};
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
    await expect(
      canvas.getByRole("heading", { name: "Your fragrance preferences" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("heading", { name: "Suggested fragrances" }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("heading", { name: "Suggested fragrances" }),
    ).toHaveFocus();
    const suggestions = canvas.getByRole("region", {
      name: "Suggested fragrances",
    });
    const preferences = canvas.getByRole("region", {
      name: "Your fragrance preferences",
    });
    await expect(
      Boolean(
        suggestions.compareDocumentPosition(preferences) &
        Node.DOCUMENT_POSITION_FOLLOWING,
      ),
    ).toBe(true);
    await userEvent.click(canvas.getByRole("radio", { name: "Bedroom" }));
    await expect(
      canvas.queryByRole("heading", { name: "Suggested fragrances" }),
    ).not.toBeInTheDocument();
  },
};
