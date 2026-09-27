import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CommonSectionTitle from "../CommonSectionTitle";

describe("CommonSectionTitle Component", () => {
  it("renders main title text and subtitle text", () => {
    render(
      <CommonSectionTitle
        text="Camp Overview"
        subText="Manage camp settings and schedules"
      />
    );

    expect(screen.getByRole("heading", { level: 3, name: /camp overview/i })).toBeInTheDocument();
    expect(screen.getByText("Manage camp settings and schedules")).toBeInTheDocument();
  });

  it("applies custom CSS classes properly", () => {
    const { container } = render(
      <CommonSectionTitle
        text="Roster"
        subText="Referees"
        wrapperClass="custom-wrapper"
        titleClass="custom-title"
        subClass="custom-sub"
      />
    );

    expect(container.firstChild).toHaveClass("custom-wrapper");
    expect(screen.getByRole("heading", { level: 3 })).toHaveClass("custom-title");
    expect(screen.getByText("Referees")).toHaveClass("custom-sub");
  });
});
