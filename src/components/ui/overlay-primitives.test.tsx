import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

describe("overlay primitives", () => {
  it("names a dialog, closes with Escape, and restores focus", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Delivery</DialogTitle>
          <DialogDescription>Choose a method.</DialogDescription>
        </DialogContent>
      </Dialog>,
    );
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Delivery" })).toBeVisible();
    expect(document.body.style.pointerEvents).toBe("none");
    await user.keyboard("{Escape}");
    expect(
      screen.queryByRole("dialog", { name: "Delivery" }),
    ).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it("renders a named drawer and restores focus after its close control", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger asChild>
          <Button>Open drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerTitle>Selection</DrawerTitle>
        </DrawerContent>
      </Drawer>,
    );
    const trigger = screen.getByRole("button", { name: "Open drawer" });
    await user.click(trigger);
    const drawer = screen.getByRole("dialog", { name: "Selection" });
    await user.click(
      within(drawer).getByRole("button", { name: "Close drawer" }),
    );
    expect(trigger).toHaveFocus();
  });
  it("focuses AlertDialog cancellation and treats Escape as cancel", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button>Remove item</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogTitle>Remove this item?</AlertDialogTitle>
          <AlertDialogDescription>This removes it.</AlertDialogDescription>
          <AlertDialogCancel asChild>
            <Button data-alert-cancel>Cancel</Button>
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>,
    );
    await user.click(screen.getByRole("button", { name: "Remove item" }));
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });
});
