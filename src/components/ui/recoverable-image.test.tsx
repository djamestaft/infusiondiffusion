import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { RecoverableImage } from "./recoverable-image";

afterEach(cleanup);

it("replaces a broken image and retries when the source changes", () => {
  const image = (src: string) => (
    <RecoverableImage
      src={src}
      alt="Fragrance vessel"
      width={200}
      height={200}
    />
  );
  const { rerender } = render(image("/first.png"));
  fireEvent.error(screen.getByRole("img"));
  expect(screen.queryByRole("img")).not.toBeInTheDocument();
  expect(screen.getByText("Image unavailable")).toBeVisible();
  rerender(image("/second.png"));
  expect(screen.getByRole("img")).toBeVisible();
  expect(screen.queryByText("Image unavailable")).not.toBeInTheDocument();
  rerender(image("/first.png"));
  expect(screen.getByRole("img")).toBeVisible();
});
