import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Textarea } from "@/components/ui/textarea";

afterEach(cleanup);

describe("Textarea", () => {
  it("uses native multiline textbox semantics", () => {
    render(<Textarea aria-label="Message" rows={6} />);
    const textarea = screen.getByRole("textbox", { name: "Message" });
    expect(textarea.tagName).toBe("TEXTAREA");
    expect(textarea).toHaveAttribute("rows", "6");
  });

  it("forwards invalid state to the native control", () => {
    render(<Textarea aria-label="Message" aria-invalid />);
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });
});
