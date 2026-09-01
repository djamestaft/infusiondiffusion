import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "@/components/ui/button";

const swatches = [
  ["Ink 900", "var(--ink-900)"],
  ["Graphite 700", "var(--graphite-700)"],
  ["Sage 050", "var(--sage-50)"],
  ["Sage 100", "var(--sage-100)"],
  ["Bone 050", "var(--bone-50)"],
  ["Porcelain 000", "var(--porcelain-0)"],
  ["Gold 500", "var(--gold-500)"],
  ["Gold 300", "var(--gold-300)"],
] as const;

const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96] as const;

function RuntimeFoundation() {
  return (
    <main className="bg-content-surface text-content-primary min-h-screen px-5 py-12 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-content-accent font-sans text-xs font-semibold tracking-[0.08em] uppercase">
          Approved runtime foundation
        </p>
        <h1 className="font-display mt-4 max-w-4xl text-[clamp(2.5rem,6vw,4rem)] leading-[1.05]">
          Expression and operation stay distinct
        </h1>
        <p className="text-content-secondary mt-4 max-w-[72ch] font-sans text-lg leading-[1.5]">
          Marcellus carries atmosphere and hierarchy. Manrope carries body,
          controls, prices, and commerce facts.
        </p>

        <section
          className="border-content-secondary/35 mt-12 border-t pt-8"
          aria-labelledby="color-heading"
        >
          <h2
            id="color-heading"
            className="font-sans text-sm font-semibold tracking-[0.06em] uppercase"
          >
            Semantic color roles
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
            {swatches.map(([name, color]) => (
              <figure key={name}>
                <div
                  className="border-content-secondary/60 h-20 rounded-sm border"
                  style={{ background: color }}
                />
                <figcaption className="mt-2 font-sans text-xs">
                  {name}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section
          className="border-content-secondary/35 mt-12 grid gap-10 border-t pt-8 lg:grid-cols-[1fr_1.2fr]"
          aria-labelledby="interaction-heading"
        >
          <div>
            <h2
              id="interaction-heading"
              className="font-sans text-sm font-semibold tracking-[0.06em] uppercase"
            >
              Interaction
            </h2>
            <p className="text-content-secondary mt-3 max-w-[60ch]">
              Primary actions use the approved gold pair and retain a visible
              three-pixel keyboard focus treatment.
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary action</Button>
            </div>
          </div>
          <div>
            <h2 className="font-sans text-sm font-semibold tracking-[0.06em] uppercase">
              4-point spacing
            </h2>
            <div
              className="mt-6 flex min-h-24 items-end gap-3 overflow-hidden"
              aria-label="Approved spacing scale"
            >
              {spacing.map((value) => (
                <div
                  key={value}
                  className="flex min-w-0 flex-1 flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-[var(--olive-700)]"
                    style={{ height: `${value}px` }}
                  />
                  <span className="text-content-secondary font-sans text-[10px]">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const meta = {
  title: "Foundation/Runtime tokens",
  component: RuntimeFoundation,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof RuntimeFoundation>;

export default meta;
type Story = StoryObj<typeof meta>;

const verify = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(canvas.getAllByRole("figure")).toHaveLength(8);
  await userEvent.tab();
  await expect(
    canvas.getByRole("button", { name: "Primary action" }),
  ).toHaveFocus();
};

export const Desktop1440: Story = {
  globals: { viewport: { value: "foundationDesktop", isRotated: false } },
  play: ({ canvasElement }) => verify(canvasElement),
};

export const Tablet768: Story = {
  globals: { viewport: { value: "homepageTablet", isRotated: false } },
  play: ({ canvasElement }) => verify(canvasElement),
};

export const Mobile390: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
  play: ({ canvasElement }) => verify(canvasElement),
};

export const Mobile320: Story = {
  globals: { viewport: { value: "contact320", isRotated: false } },
  play: ({ canvasElement }) => verify(canvasElement),
};
