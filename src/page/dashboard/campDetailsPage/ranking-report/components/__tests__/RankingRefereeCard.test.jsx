import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import RankingRefereeCard from "../RankingRefereeCard";

describe("RankingRefereeCard Component", () => {
  const sampleRecord = {
    rank: 1,
    name: "Alex Caruso",
    avatarUrl: "https://example.com/avatar.jpg",
    address: "Chicago, IL",
    overall: 8.75,
    callAccur: 9.1,
    mech: 8.8,
    fitMob: 9.3,
    comm: 8.6,
    consistency: 8.9,
    gA: 9.0,
    totalEvaluations: 4,
    levelCounts: {
      "Large School Varsity": 3,
      "Small School Varsity": 1,
    },
  };

  const sampleLevels = ["Large School Varsity", "Small School Varsity", "Sub-Varsity"];

  it("renders Rank #1 badge with gold theme styling and overall score", () => {
    render(<RankingRefereeCard record={sampleRecord} levels={sampleLevels} />);

    expect(screen.getByText("Rank #1")).toBeInTheDocument();
    expect(screen.getByText("Score: 8.750")).toBeInTheDocument();
  });

  it("renders referee name, address, and evaluation counts", () => {
    render(<RankingRefereeCard record={sampleRecord} levels={sampleLevels} />);

    expect(screen.getByText("Alex Caruso")).toBeInTheDocument();
    expect(screen.getByText("Chicago, IL")).toBeInTheDocument();
    expect(screen.getByText("4 evals")).toBeInTheDocument();
  });

  it("renders all 6 metric scores in scoring grid", () => {
    render(<RankingRefereeCard record={sampleRecord} levels={sampleLevels} />);

    expect(screen.getByText("Call Accur.")).toBeInTheDocument();
    expect(screen.getByText("9.1")).toBeInTheDocument();

    expect(screen.getByText("Mechanics")).toBeInTheDocument();
    expect(screen.getByText("8.8")).toBeInTheDocument();

    expect(screen.getByText("Fit / Mob")).toBeInTheDocument();
    expect(screen.getByText("9.3")).toBeInTheDocument();

    expect(screen.getByText("Comm.")).toBeInTheDocument();
    expect(screen.getByText("8.6")).toBeInTheDocument();

    expect(screen.getByText("Consistency")).toBeInTheDocument();
    expect(screen.getByText("8.9")).toBeInTheDocument();

    expect(screen.getByText("Game Aware")).toBeInTheDocument();
    expect(screen.getByText("9.0")).toBeInTheDocument();
  });

  it("renders active recommended levels with counts", () => {
    render(<RankingRefereeCard record={sampleRecord} levels={sampleLevels} />);

    expect(screen.getByText("Recommended Levels")).toBeInTheDocument();
    expect(screen.getByText("LS Var")).toBeInTheDocument();
    expect(screen.getByText("×3")).toBeInTheDocument();
    expect(screen.getByText("SS Var")).toBeInTheDocument();
    expect(screen.getByText("×1")).toBeInTheDocument();
  });

  it("renders rank 2, 3, and 4 badges properly", () => {
    const { rerender } = render(
      <RankingRefereeCard record={{ ...sampleRecord, rank: 2 }} levels={sampleLevels} />,
    );
    expect(screen.getByText("Rank #2")).toBeInTheDocument();

    rerender(
      <RankingRefereeCard record={{ ...sampleRecord, rank: 3 }} levels={sampleLevels} />,
    );
    expect(screen.getByText("Rank #3")).toBeInTheDocument();

    rerender(
      <RankingRefereeCard record={{ ...sampleRecord, rank: 7 }} levels={sampleLevels} />,
    );
    expect(screen.getByText("Rank #7")).toBeInTheDocument();
  });
});
