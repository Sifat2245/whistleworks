import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ScreenLoading from "../ScreenLoading";

describe("ScreenLoading Component", () => {
  it("renders full-screen backdrop container and loader", () => {
    const { container } = render(<ScreenLoading />);

    expect(container.firstChild).toHaveClass(
      "w-full",
      "h-screen",
      "fixed",
      "inset-0",
      "bg-black/60"
    );
    expect(container.querySelector("l-line-spinner")).toBeInTheDocument();
  });
});
