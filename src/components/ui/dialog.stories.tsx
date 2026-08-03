import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

function DialogExample({ long = false, loading = false }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Choose delivery</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {long
              ? "Choose a delivery option for this considered fragrance order"
              : "Choose a delivery option"}
          </DialogTitle>
          <DialogDescription>
            {long
              ? "Select the delivery method that best suits your order and location. Final timing and cost will be confirmed before checkout, and unusually long destination instructions remain readable without hiding the available exit or action controls."
              : "Select the delivery method that suits your order. Final timing and cost will be confirmed before checkout."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button loading={loading}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const meta = {
  title: "Components/Dialog",
  component: DialogExample,
  parameters: { layout: "centered" },
} satisfies Meta<typeof DialogExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const LongContent: Story = { args: { long: true } };
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
      canvas.getByRole("button", { name: "Choose delivery" }),
    );
    const dialog = within(document.body).getByRole("dialog", {
      name: "Choose a delivery option",
    });
    await expect(dialog).toBeVisible();
    await expect(
      within(dialog).getByRole("button", { name: "Cancel" }),
    ).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(
      canvas.getByRole("button", { name: "Choose delivery" }),
    ).toHaveFocus();
  },
};
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
