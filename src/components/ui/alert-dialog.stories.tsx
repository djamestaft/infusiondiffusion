import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

function AlertDialogExample({ loading = false }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="secondary">Remove item</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove this item?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the item from your current selection. You can add it
            again later.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button data-alert-cancel variant="secondary">
              Cancel
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button loading={loading} variant="destructive">
              Remove
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
const meta = {
  title: "Components/AlertDialog",
  component: AlertDialogExample,
  parameters: { layout: "centered" },
} satisfies Meta<typeof AlertDialogExample>;
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
export const CancelFocus: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Remove item" }));
    const dialog = within(document.body).getByRole("alertdialog", {
      name: "Remove this item?",
    });
    await expect(
      within(dialog).getByRole("button", { name: "Cancel" }),
    ).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(
      canvas.getByRole("button", { name: "Remove item" }),
    ).toHaveFocus();
  },
};
export const Mobile: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
