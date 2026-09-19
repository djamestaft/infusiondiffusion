import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { FragranceGuideConsultation as FragranceGuideTemplate } from "./fragrance-guide-consultation";
import { shopifyE2EProducts } from "@/lib/shopify/e2e-fixtures";

beforeEach(() =>
  vi.stubGlobal("matchMedia", () => ({
    matches: false,
    addEventListener() {},
    removeEventListener() {},
  })),
);
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const choices = [
  "Bedroom",
  "Soft & restful",
  "Spa-like calm",
  "Quiet background",
  "Any time",
];

it("resets the current guide to an empty introduction and clears completed answers", async () => {
  const user = userEvent.setup();
  render(
    <FragranceGuideTemplate
      initialAnswers={choices.map((value) => [value])}
      initialQuestion={2}
    />,
  );
  await user.click(screen.getByRole("button", { name: "Reset guide" }));
  expect(screen.queryByRole("group")).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Begin the guide" }));
  expect(screen.getByRole("radio", { name: "Bedroom" })).not.toBeChecked();
  expect(
    screen.getByRole("button", { name: "Question 3: Notes" }),
  ).toBeDisabled();
  await user.click(screen.getByRole("radio", { name: "Living room" }));
  await user.click(screen.getByRole("button", { name: "Continue" }));
  expect(
    screen.getByRole("radio", { name: "Soft & restful" }),
  ).not.toBeChecked();
});

it("resets completed results without retaining stale recommendations", async () => {
  const user = userEvent.setup();
  render(
    <FragranceGuideTemplate
      initialAnswers={choices.map((value) => [value])}
      initialReviewed
      products={shopifyE2EProducts}
    />,
  );
  await user.click(screen.getByRole("button", { name: "Reset guide" }));
  expect(
    screen.queryByRole("region", { name: "Suggested fragrances" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Begin the guide" })).toBeVisible();
});

it("cannot skip an unanswered question with rapid Continue input", async () => {
  const user = userEvent.setup();
  render(<FragranceGuideTemplate />);
  await user.click(screen.getByRole("button", { name: /begin the guide/i }));
  await user.click(screen.getByRole("radio", { name: "Bedroom" }));
  await user.dblClick(screen.getByRole("button", { name: /continue/i }));
  await user.click(screen.getByRole("button", { name: /continue/i }));
  expect(
    screen.getByRole("group", { name: "How should the room feel?" }),
  ).toBeVisible();
  expect(screen.getByRole("alert")).toBeVisible();
  expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
});

it("retains a product recommendation and availability after its photo fails", () => {
  render(
    <FragranceGuideTemplate
      initialAnswers={choices.map((value) => [value])}
      initialReviewed
      products={shopifyE2EProducts.map((product) => ({
        ...product,
        availableForSale: false,
        image: {
          src: "/images/homepage-bespoke-diffuser-blurb.png",
          alt: `${product.title} photograph`,
        },
      }))}
    />,
  );
  const region = within(
    screen.getByRole("region", { name: "Suggested fragrances" }),
  );
  const link = region.getByRole("link");
  fireEvent.error(region.getByRole("img"));
  expect(region.getByRole("link")).toBe(link);
  expect(link).toHaveTextContent("Santuaire Serein");
  expect(link).toHaveTextContent("Currently unavailable");
  expect(link).toHaveTextContent("spa-inspired character");
});

it("introduces five questions, validates each step and preserves answers on Back", async () => {
  const user = userEvent.setup();
  render(<FragranceGuideTemplate />);
  expect(screen.queryAllByRole("radio")).toHaveLength(0);
  await user.click(screen.getByRole("button", { name: /begin the guide/i }));
  expect(screen.getAllByRole("group")).toHaveLength(1);
  await user.click(screen.getByRole("button", { name: /continue/i }));
  expect(screen.getByRole("alert")).toBeVisible();
  expect(screen.getByRole("radio", { name: "Living room" })).toHaveFocus();
  await user.click(screen.getByRole("radio", { name: "Bedroom" }));
  expect(screen.getByRole("radio", { name: "Bedroom" })).toBeChecked();
  expect(
    screen.queryByRole("radio", { name: "Soft & restful" }),
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: /continue/i }));
  await user.click(screen.getByRole("radio", { name: "Soft & restful" }));
  await user.click(screen.getByRole("button", { name: /^back$/i }));
  expect(screen.getByRole("radio", { name: "Bedroom" })).toBeChecked();
  await user.click(screen.getByRole("button", { name: /continue/i }));
  expect(screen.getByRole("radio", { name: "Soft & restful" })).toBeChecked();
});

it("limits notes to two and produces editable source-backed results without losing preferences", async () => {
  const user = userEvent.setup();
  const onContinue = vi.fn();
  render(
    <FragranceGuideTemplate
      products={shopifyE2EProducts}
      onContinue={onContinue}
    />,
  );
  await user.click(screen.getByRole("button", { name: /begin the guide/i }));
  for (const [index, name] of choices.entries()) {
    await user.click(
      screen.getByRole(index === 2 ? "checkbox" : "radio", {
        name,
      }),
    );
    if (index === 2) {
      await user.click(screen.getByRole("checkbox", { name: "Soft florals" }));
      await user.click(screen.getByRole("checkbox", { name: "Spice & woods" }));
      expect(screen.getByRole("alert")).toHaveTextContent("Choose up to two");
      expect(
        screen.getByRole("checkbox", { name: "Spice & woods" }),
      ).not.toBeChecked();
      await user.click(screen.getByRole("checkbox", { name: "Soft florals" }));
    }
    await user.click(
      screen.getByRole("button", {
        name: index === 4 ? /see my suggestions/i : /continue/i,
      }),
    );
  }
  expect(onContinue).toHaveBeenCalledExactlyOnceWith(
    choices.map((value) => [value]),
  );
  const results = screen.getByRole("region", { name: "Suggested fragrances" });
  expect(within(results).getAllByRole("link")).toHaveLength(1);
  expect(within(results).getByRole("link")).toHaveTextContent(
    "Santuaire Serein",
  );
  expect(
    screen.getByRole("heading", { name: "Suggested fragrances" }),
  ).toHaveFocus();
  await user.click(screen.getByRole("button", { name: /edit room/i }));
  expect(
    screen.queryByRole("region", { name: "Suggested fragrances" }),
  ).not.toBeInTheDocument();
  expect(screen.getByRole("radio", { name: "Bedroom" })).toBeChecked();
  await user.click(screen.getByRole("radio", { name: "Living room" }));
  for (let i = 0; i < 4; i++)
    await user.click(screen.getByRole("button", { name: /continue/i }));
  await user.click(screen.getByRole("button", { name: /see my suggestions/i }));
  expect(
    within(
      screen.getByRole("region", { name: "Suggested fragrances" }),
    ).getByRole("link"),
  ).toHaveTextContent("Santuaire Serein");
});
