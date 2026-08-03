import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

afterEach(cleanup);

describe("Field", () => {
  it("associates its visible label and description with the control", () => {
    render(
      <Field label="Email address" description="We only use this for updates.">
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Email address" });
    expect(input).toHaveAccessibleDescription("We only use this for updates.");
  });

  it("marks required controls semantically", () => {
    render(
      <Field label="Full name" required>
        <Input />
      </Field>,
    );
    expect(screen.getByRole("textbox", { name: "Full name" })).toBeRequired();
  });

  it("supersedes supporting text with an associated, non-color-only error", () => {
    render(
      <Field
        label="Email address"
        description="We only use this for updates."
        error="Enter a valid email address."
      >
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByRole("textbox", { name: "Email address" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Enter a valid email address.");
    expect(
      screen.queryByText("We only use this for updates."),
    ).not.toBeInTheDocument();
  });

  it("preserves caller-provided descriptions", () => {
    render(
      <>
        <p id="privacy-note">Privacy details</p>
        <Field label="Email address" description="Used for updates.">
          <Input type="email" aria-describedby="privacy-note" />
        </Field>
      </>,
    );
    expect(
      screen.getByRole("textbox", { name: "Email address" }),
    ).toHaveAccessibleDescription("Privacy details Used for updates.");
  });
});
