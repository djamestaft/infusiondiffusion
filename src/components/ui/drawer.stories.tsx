import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

function DrawerExample({ loading = false }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button>Open selection</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Your selection</DrawerTitle>
          <DrawerDescription>
            Review the items held for this visit. Prices and availability will
            be confirmed before checkout.
          </DrawerDescription>
        </DrawerHeader>
        <div className="text-overlay-muted mt-12 text-base leading-6">
          Task content composes here without changing the drawer contract.
        </div>
        <DrawerFooter>
          <Button loading={loading}>Continue</Button>
          <DrawerClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
const meta = {
  title: "Components/Drawer",
  component: DrawerExample,
  parameters: { layout: "centered" },
} satisfies Meta<typeof DrawerExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LoadingAction: Story = { args: { loading: true } };
export const Midnight: Story = {
  decorators: [
    (Story) => (
      <div className="dark bg-background p-12">
        <Story />
      </div>
    ),
  ],
};
export const KeyboardFlow: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Open selection" }),
    );
    const dialog = within(document.body).getByRole("dialog", {
      name: "Your selection",
    });
    await expect(dialog).toBeVisible();
    await userEvent.keyboard("{Escape}");
    await expect(
      canvas.getByRole("button", { name: "Open selection" }),
    ).toHaveFocus();
  },
};
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
