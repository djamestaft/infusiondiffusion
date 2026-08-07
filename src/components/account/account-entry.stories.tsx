import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";

import { AccountEntry } from "@/components/account/account-entry";

const destination = "https://accounts.example.test/account?return_to=%2Forders";
const meta = {
  title: "Commerce/AccountEntry",
  component: AccountEntry,
  args: { state: "available", destination },
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AccountEntry>;
export default meta;
type Story = StoryObj<typeof meta>;

async function hostedContract(canvasElement: HTMLElement) {
  const canvas = within(canvasElement);
  const link = canvas.getByRole("link", { name: "Continue to your account" });
  await expect(link).toHaveAttribute("href", destination);
  await expect(link).not.toHaveAttribute("target");
  await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
}
async function recoveryContract(canvasElement: HTMLElement, text: string) {
  const canvas = within(canvasElement);
  await expect(
    canvas.queryByRole("link", { name: "Continue to your account" }),
  ).toBeNull();
  await expect(canvas.getByText(text)).toBeVisible();
  await expect(
    canvas.getByRole("link", { name: "Shop the collection" }),
  ).toHaveAttribute("href", "/shop");
}

export const HostedDesktop: Story = {
  play: ({ canvasElement }) => hostedContract(canvasElement),
};
export const HostedMobile390: Story = {
  globals: { viewport: { value: "contact390", isRotated: false } },
  play: ({ canvasElement }) => hostedContract(canvasElement),
};
export const Loading: Story = {
  args: { state: "loading" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("main")).toHaveAttribute("aria-busy", "true");
    await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  },
};
export const Disabled: Story = {
  args: { state: "disabled" },
  play: ({ canvasElement }) =>
    recoveryContract(
      canvasElement,
      "Account access is not currently available",
    ),
};
export const MissingConfiguration: Story = {
  args: { state: "configuration-missing" },
  play: ({ canvasElement }) =>
    recoveryContract(
      canvasElement,
      "Account access is not currently available",
    ),
};
export const NotProvisioned: Story = {
  args: { state: "not-provisioned" },
  play: ({ canvasElement }) =>
    recoveryContract(canvasElement, "Account destination is not available"),
};
export const ProviderError: Story = {
  args: { state: "error", onRetry: () => undefined },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toHaveTextContent(
      "Nothing was submitted",
    );
    await expect(
      canvas.getByRole("button", { name: "Try again" }),
    ).toBeVisible();
  },
};
export const LongContent: Story = {
  args: { longContent: true },
  globals: { viewport: { value: "contact320", isRotated: false } },
  play: ({ canvasElement }) => hostedContract(canvasElement),
};
export const CartCount: Story = {
  args: { cartCount: 3 },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("link", { name: "Cart, 3 items" }),
    ).toBeVisible();
  },
};
export const FocusVisible: Story = {
  play: async ({ canvasElement }) => {
    const link = within(canvasElement).getByRole("link", {
      name: "Continue to your account",
    });
    link.focus();
    await expect(link).toHaveFocus();
  },
};
