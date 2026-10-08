import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import ScheduleSkeleton from "../ScheduleSkeleton";

describe("ScheduleSkeleton Component", () => {
  it("renders animated skeleton elements for stats, table, and actions", () => {
    const { container } = render(<ScheduleSkeleton />);

    expect(container.firstChild).toHaveClass("animate-pulse");
    expect(container.querySelectorAll(".bg-white").length).toBeGreaterThan(0);
    expect(container.querySelectorAll(".bg-gray-100").length).toBeGreaterThan(0);
  });
});
