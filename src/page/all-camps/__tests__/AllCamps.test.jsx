import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import AllCamps from "../AllCamps";

vi.mock("@/page/all-camps/components/FilterCamps", () => ({
  default: () => <div data-testid="mock-filter-camps">Filter Camps Component</div>,
}));

describe("AllCamps Page Component", () => {
  it("renders page title, subtitle, and the FilterCamps component", () => {
    render(
      <MemoryRouter>
        <AllCamps />
      </MemoryRouter>,
    );

    expect(
      screen.getByText("Discover All Referee Training Camps"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Explore our comprehensive list of upcoming referee training camps/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-filter-camps")).toBeInTheDocument();
  });
});
