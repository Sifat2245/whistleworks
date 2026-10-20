import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RankingReport from "../RankingReport";

vi.mock("../components/RankingReportTable", () => ({
  default: ({ camp_id, sports_type_name }) => (
    <div data-testid="mock-ranking-table">
      Ranking Table for Camp {camp_id} ({sports_type_name})
    </div>
  ),
}));

describe("RankingReport Page Component", () => {
  it("renders camp name, performance description, and RankingReportTable", () => {
    render(
      <RankingReport
        camp_id={99}
        campName="Summer Hoops Showcase"
        sports_type_name="Basketball"
      />,
    );

    expect(screen.getByRole("heading", { level: 2, name: /Ranking - Summer Hoops Showcase/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Performance rankings based on evaluation scores/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("mock-ranking-table")).toBeInTheDocument();
  });
});
