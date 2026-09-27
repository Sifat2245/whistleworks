import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Loader from "../Loader";
import LoaderV2 from "../LoaderV2";

describe("Loader and LoaderV2 Components", () => {
  it("renders Loader with default props", () => {
    const { container } = render(<Loader />);
    const spinner = container.querySelector("l-line-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("size", "25");
    expect(spinner).toHaveAttribute("color", "#ffffff");
  });

  it("renders Loader with custom props", () => {
    const { container } = render(
      <Loader size={40} stroke={6} color="#00AEEF" speed={2} />
    );
    const spinner = container.querySelector("l-line-spinner");
    expect(spinner).toHaveAttribute("size", "40");
    expect(spinner).toHaveAttribute("stroke", "6");
    expect(spinner).toHaveAttribute("color", "#00AEEF");
    expect(spinner).toHaveAttribute("speed", "2");
  });

  it("renders LoaderV2 with custom props", () => {
    const { container } = render(
      <LoaderV2 size={32} color="#dc2626" />
    );
    const spinner = container.querySelector("l-line-spinner");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute("size", "32");
    expect(spinner).toHaveAttribute("color", "#dc2626");
  });
});
