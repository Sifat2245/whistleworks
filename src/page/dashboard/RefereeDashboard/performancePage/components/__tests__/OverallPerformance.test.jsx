import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import OverallPerformance from "../OverallPerformance";

describe("OverallPerformance Component", () => {
  it("renders overall score formatted to 3 decimal digits", () => {
    const overallPerformance = {
      score: 8.5,
      total_evaluations: 4,
    };
    const ranking = { position: 1 };

    render(
      <OverallPerformance
        overallPerformance={overallPerformance}
        ranking={ranking}
        hasEvaluations={true}
      />
    );

    expect(screen.getByText("8.500")).toBeInTheDocument();
    expect(screen.getByText("/10")).toBeInTheDocument();
    expect(screen.getByText("Top 1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("formats decimal score with 3 digits after the dot (e.g., 9.833)", () => {
    const overallPerformance = {
      score: 9.833333,
      total_evaluations: 12,
    };

    render(
      <OverallPerformance
        overallPerformance={overallPerformance}
        ranking={{ position: 2 }}
        hasEvaluations={true}
      />
    );

    expect(screen.getByText("9.833")).toBeInTheDocument();
  });

  it("renders 0.000 when score is 0 or undefined", () => {
    render(
      <OverallPerformance
        overallPerformance={{}}
        ranking={{}}
        hasEvaluations={false}
      />
    );

    expect(screen.getByText("0.000")).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });
});
