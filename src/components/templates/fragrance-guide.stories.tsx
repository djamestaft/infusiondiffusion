import artwork from "./website-imagery.fixture.json";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { FragranceGuideConsultation } from "./fragrance-guide-consultation";
import { shopifyE2EProducts } from "@/lib/shopify/e2e-fixtures";

const products = shopifyE2EProducts.map((p) => ({
  ...p,
  ...(p.featuredImage
    ? {
        image: {
          src: p.featuredImage.url,
          alt: p.featuredImage.altText || p.title,
        },
      }
    : {}),
}));
const answers = [
  ["Bedroom"],
  ["Soft & restful"],
  ["Amber & vanilla"],
  ["Noticeable balance"],
  ["Evening"],
];
const meta = {
  title: "Templates/Fragrance Guide Consultation",
  component: FragranceGuideConsultation,
  args: { onContinue: fn(), products, heroImage: artwork.guide },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "INF-58 Figma consultation, exploration page2876:963: intro2878:2, question2880:9, phone2881:26/55. Five native question states; explicit progression and editable source-backed results. GSAP decorates state changes, LERP moves only the desktop stage word. Static/reduced-motion remains fully usable. Shopify supplies optional product images. Ranking remains notes/character only.",
      },
    },
  },
} satisfies Meta<typeof FragranceGuideConsultation>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Desktop: Story = {
  globals: { viewport: { value: "foundationDesktop" } },
};
export const Tablet: Story = {
  globals: { viewport: { value: "homepageTablet" } },
};
export const Mobile: Story = { globals: { viewport: { value: "contact390" } } };
export const Small: Story = { globals: { viewport: { value: "contact320" } } };
export const Empty: Story = {};
export const Room: Story = {
  args: { initialStarted: true, initialAnswers: answers },
};
export const Feeling: Story = {
  ...Room,
  args: { ...Room.args, initialQuestion: 1 },
};
export const Notes: Story = {
  ...Room,
  args: { ...Room.args, initialQuestion: 2 },
};
export const Presence: Story = {
  ...Room,
  args: { ...Room.args, initialQuestion: 3 },
};
export const Time: Story = {
  ...Room,
  args: { ...Room.args, initialQuestion: 4 },
};
export const MobileQuestion: Story = {
  ...Notes,
  globals: { viewport: { value: "contact390" } },
};
export const SmallQuestion: Story = {
  ...Notes,
  globals: { viewport: { value: "contact320" } },
};
export const Results: Story = {
  args: { initialAnswers: answers, initialReviewed: true },
};
export const MobileResults: Story = {
  ...Results,
  globals: { viewport: { value: "contact390" } },
};
export const SourceUnavailable: Story = {
  ...Results,
  args: { ...Results.args, products: null },
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
  ...Results,
  args: { ...Results.args, products: [] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        /No fragrances with an approved connection/,
      ),
    ).toBeVisible();
  },
};
export const SoldOut: Story = {
  ...Results,
  args: {
    ...Results.args,
    products: products.map((p) => ({ ...p, availableForSale: false })),
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
  ...Results,
  args: {
    ...Results.args,
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
    await expect(
      within(
        canvas.getByRole("region", { name: "Suggested fragrances" }),
      ).getAllByRole("link"),
    ).toHaveLength(1);
    await userEvent.click(canvas.getByRole("button", { name: "Edit notes" }));
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Spa-like calm" }),
    );
    await userEvent.click(
      canvas.getByRole("checkbox", { name: "Amber & vanilla" }),
    );
    for (let i = 0; i < 2; i++)
      await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await userEvent.click(
      canvas.getByRole("button", { name: "See my suggestions" }),
    );
    await expect(
      within(
        canvas.getByRole("region", { name: "Suggested fragrances" }),
      ).getAllByRole("link"),
    ).toHaveLength(3);
  },
};
export const TwoMatches: Story = {
  ...Results,
  args: {
    ...Results.args,
    products: products.filter(
      (p) => p.id.endsWith("10067255558430") || p.id.endsWith("10067255394590"),
    ),
  },
};
export const LongContent: Story = {
  ...Results,
  args: {
    ...Results.args,
    products: products.map((p) => ({
      ...p,
      title: p.title + " with an unusually long editorial product name",
    })),
  },
};
export const MissingImages: Story = {
  ...Results,
  args: { ...Results.args, products: shopifyE2EProducts },
};
export const FailedImages: Story = {
  ...Results,
  args: {
    ...Results.args,
    products: products.map((p) => ({
      ...p,
      image: { src: "/missing-guide-photo.png", alt: p.title },
    })),
  },
};
export const TwoNotesAndValidation: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Begin the guide" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Choose an answer",
    );
    await expect(
      canvas.getByRole("radio", { name: "Living room" }),
    ).toHaveFocus();
    await userEvent.keyboard(" ");
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await userEvent.click(
      canvas.getByRole("radio", { name: "Soft & restful" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    for (const name of ["Soft florals", "Spice & woods", "Spa-like calm"])
      await userEvent.click(canvas.getByRole("checkbox", { name }));
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
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await userEvent.click(
      canvas.getByRole("radio", { name: "Quiet background" }),
    );
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await userEvent.click(canvas.getByRole("radio", { name: "Any time" }));
    await userEvent.click(canvas.getByRole("button", { name: "Back" }));
    await expect(
      canvas.getByRole("radio", { name: "Quiet background" }),
    ).toBeChecked();
    await userEvent.click(canvas.getByRole("button", { name: "Continue" }));
    await userEvent.click(
      canvas.getByRole("button", { name: "See my suggestions" }),
    );
    await expect(args.onContinue).toHaveBeenCalledWith([
      ["Living room"],
      ["Soft & restful"],
      ["Spice & woods", "Spa-like calm"],
      ["Quiet background"],
      ["Any time"],
    ]);
    await expect(
      canvas.getByRole("heading", { name: "Suggested fragrances" }),
    ).toHaveFocus();
    await userEvent.click(canvas.getByRole("button", { name: "Edit room" }));
    await expect(
      canvas.queryByRole("region", { name: "Suggested fragrances" }),
    ).not.toBeInTheDocument();
  },
};
export const MasterArtwork: Story = { args: { heroImage: artwork.guide } };
export const MasterArtworkPhone: Story = {
  ...MasterArtwork,
  globals: { viewport: { value: "contact390" } },
};
