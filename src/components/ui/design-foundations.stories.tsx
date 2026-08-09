import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

const colors = [
  ["Deep Ink", "#11110f", "var(--content-primary)"],
  ["Mineral Sage", "#eef0e7", "var(--content-surface)"],
  ["Sage Elevated", "#e3e7da", "var(--content-surface-elevated)"],
  ["Porcelain", "#fcfaf5", "var(--action-primary-foreground)"],
  ["Accessible Gold", "#735716", "var(--content-accent)"],
  ["Antique Gold", "#c5a447", "var(--navigation-divider)"],
] as const;

function Foundations() {
  return (
    <main className="bg-content-surface text-content-primary min-h-screen p-5 sm:p-12">
      <div className="mx-auto grid max-w-7xl gap-16">
        <header className="grid gap-4">
          <p className="text-content-accent text-xs font-semibold tracking-[0.08em] uppercase">
            Foundations · approved atoms
          </p>
          <h1 className="font-display text-5xl leading-[1.167] sm:text-7xl">
            The Perfumer&apos;s Cabinet
          </h1>
          <p className="text-content-secondary max-w-[70ch] text-base leading-[1.625]">
            A deterministic review surface for semantic colour, typography,
            spacing, shape, depth, focus, and motion.
          </p>
        </header>

        <section aria-labelledby="foundation-colors" className="grid gap-6">
          <h2 id="foundation-colors" className="font-display text-3xl">
            Semantic colour roles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {colors.map(([name, value, background]) => (
              <article
                key={name}
                className="border-border overflow-hidden rounded-lg border"
              >
                <div
                  aria-hidden="true"
                  className="h-28"
                  style={{ background }}
                />
                <div className="bg-content-surface grid gap-1 p-4">
                  <h3 className="font-semibold">{name}</h3>
                  <code className="text-content-secondary text-sm">
                    {value}
                  </code>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="foundation-type" className="grid gap-6">
          <h2 id="foundation-type" className="font-display text-3xl">
            Typography
          </h2>
          <div className="border-border grid gap-8 border-y py-8">
            <p className="font-display text-[clamp(3rem,6vw,4.5rem)] leading-[1.111] tracking-[-0.02em]">
              Compose the room in scent.
            </p>
            <p className="font-display text-5xl leading-[1.167] tracking-[-0.01em]">
              A quieter kind of luxury.
            </p>
            <p className="font-display text-3xl leading-9">Bois de Santal</p>
            <p className="text-content-secondary max-w-[70ch] text-base leading-[1.625]">
              Manrope explains and operates. Marcellus expresses. Body copy
              remains calm, legible, and deliberately measured.
            </p>
            <p className="text-content-accent text-xs font-semibold tracking-[0.08em] uppercase">
              Reed diffuser · 200ml
            </p>
          </div>
        </section>

        <section aria-labelledby="foundation-space" className="grid gap-6">
          <h2 id="foundation-space" className="font-display text-3xl">
            Space, shape, and depth
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="bg-content-surface-elevated rounded-sm p-6 shadow-[var(--shadow-subtle)]">
              Control · 4px
            </div>
            <div className="bg-content-surface-elevated rounded-lg p-8 shadow-[var(--shadow-raised)]">
              Surface · 8px
            </div>
            <button
              className="bg-action-primary text-action-primary-foreground outline-action-focus min-h-11 rounded-md px-5 outline-2 outline-offset-2 focus-visible:outline"
              type="button"
            >
              Keyboard focus
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

const meta = {
  title: "Foundations/Approved atoms",
  component: Foundations,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Foundations>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Ivory: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent(
      "The Perfumer's Cabinet",
    );
    await expect(
      canvas.getByRole("button", { name: "Keyboard focus" }),
    ).toBeVisible();
  },
};

export const Midnight: Story = {
  decorators: [
    (Story) => (
      <div className="dark">
        <Story />
      </div>
    ),
  ],
};

export const Mobile320: Story = {
  parameters: { viewport: { defaultViewport: "mobile320" } },
};
export const Mobile390: Story = {
  parameters: { viewport: { defaultViewport: "mobile390" } },
};
export const ReducedMotion: Story = {
  parameters: { chromatic: { prefersReducedMotion: "reduce" } },
};
