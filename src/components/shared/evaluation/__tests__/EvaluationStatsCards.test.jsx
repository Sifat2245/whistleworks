import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import EvaluationStatsCards from "../EvaluationStatsCards";

describe("EvaluationStatsCards", () => {
  it("renders statistics and level summary accurately", () => {
    const stats = {
      total_evaluations: 12,
      unique_referees_evaluated: 7,
    };
    const levels = [
      { level: "HS", count: 4 },
      { level: "NCAA D2", count: 3 },
    ];

    render(
      <EvaluationStatsCards
        statistics={stats}
        overallLevelSummary={levels}
      />
    );

    expect(screen.getByText("Total Evaluations")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("Referees Evaluated")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("HS")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("NCAA D2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("handles empty or missing statistics gracefully", () => {
    render(
      <EvaluationStatsCards
        statistics={null}
        overallLevelSummary={[]}
      />
    );

    expect(screen.getAllByText("0")).toHaveLength(2);
    expect(
      screen.getByText("No level recommendations yet")
    ).toBeInTheDocument();
  });
});
