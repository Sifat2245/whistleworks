import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SectionCard from "../SectionCard";

describe("SectionCard Component", () => {
  it("renders card with icon, title, description, and children", () => {
    render(
      <SectionCard
        icon={<span data-testid="card-icon">Icon</span>}
        title="Camp Location & Details"
        description="Configure your court addresses and gym access."
      >
        <div data-testid="card-body">Form Fields Content</div>
      </SectionCard>
    );

    expect(screen.getByText("Camp Location & Details")).toBeInTheDocument();
    expect(
      screen.getByText("Configure your court addresses and gym access.")
    ).toBeInTheDocument();
    expect(screen.getByTestId("card-icon")).toBeInTheDocument();
    expect(screen.getByTestId("card-body")).toBeInTheDocument();
  });

  it("renders without description when omitted", () => {
    render(
      <SectionCard
        icon={<span>Icon</span>}
        title="Quick Info"
      >
        <p>Child without description</p>
      </SectionCard>
    );

    expect(screen.getByText("Quick Info")).toBeInTheDocument();
    expect(screen.getByText("Child without description")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SectionCard
        icon={<span>Icon</span>}
        title="Title"
        className="my-custom-card"
      >
        Body
      </SectionCard>
    );

    expect(container.firstChild).toHaveClass("my-custom-card");
  });
});
