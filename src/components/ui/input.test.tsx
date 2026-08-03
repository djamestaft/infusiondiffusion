import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Input } from "@/components/ui/input";

afterEach(cleanup);

describe("Input", () => {
  it("preserves the requested native input type", () => {
    render(<Input aria-label="Email" type="email" />);
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "type",
      "email",
    );
  });

  it("allows read-only controls to receive focus", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Reference" readOnly value="ID-104" />);
    await user.tab();
    expect(screen.getByRole("textbox", { name: "Reference" })).toHaveFocus();
  });

  it("keeps disabled controls out of the tab order", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Unavailable" disabled />);
    await user.tab();
    expect(
      screen.getByRole("textbox", { name: "Unavailable" }),
    ).not.toHaveFocus();
  });
});
