import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RankingReportTable from "../RankingReportTable";
import * as rankingsApi from "@/hooks/api/useRankings";
import * as evalApi from "@/hooks/api/useEvaluation";

vi.mock("@/hooks/api/useRankings", () => ({
  useRefereeEvaluations: vi.fn(),
}));

vi.mock("@/hooks/api/useEvaluation", () => ({
  useRecommendedLevels: vi.fn(),
}));

describe("RankingReportTable Component", () => {
  const sampleEvaluations = [
    {
      referee_id: 1,
      referee_name: "Luka Doncic",
      referee_avatar: "https://example.com/luka.jpg",
      referee_address: "Dallas, TX",
      averages: {
        overall: 9.25,
        call_accuracy: 9.5,
        court_position_mechanics: 9.0,
        fitness_mobility: 8.8,
        communication_skills: 9.4,
        consistency_of_calls: 9.3,
        game_awareness: 9.6,
      },
      total_evaluations: 5,
      recommended_levels: [{ name: "Large School Varsity", count: 4 }],
    },
    {
      referee_id: 2,
      referee_name: "Kyrie Irving",
      referee_avatar: "https://example.com/kyrie.jpg",
      referee_address: "Cleveland, OH",
      averages: {
        overall: 8.1,
        call_accuracy: 8.4,
        court_position_mechanics: 8.2,
        fitness_mobility: 8.0,
        communication_skills: 8.3,
        consistency_of_calls: 8.1,
        game_awareness: 8.5,
      },
      total_evaluations: 3,
      recommended_levels: [{ name: "Small School Varsity", count: 2 }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading spinner when evaluations are loading", () => {
    vi.mocked(rankingsApi.useRefereeEvaluations).mockReturnValue({
      evaluations: [],
      isLoading: true,
      error: null,
    });
    vi.mocked(evalApi.useRecommendedLevels).mockReturnValue({
      data: ["Large School Varsity", "Small School Varsity"],
      isLoading: false,
    });

    render(<RankingReportTable camp_id={10} />);
    expect(document.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("renders permission denied alert when error status is 403", () => {
    vi.mocked(rankingsApi.useRefereeEvaluations).mockReturnValue({
      evaluations: [],
      isLoading: false,
      error: { response: { status: 403 } },
    });
    vi.mocked(evalApi.useRecommendedLevels).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<RankingReportTable camp_id={10} />);
    expect(screen.getByText("Ranking Report Not Available")).toBeInTheDocument();
    expect(
      screen.getByText(/You do not have permission to view evaluations for this camp/i),
    ).toBeInTheDocument();
  });

  it("renders empty alert when evaluations list is empty", () => {
    vi.mocked(rankingsApi.useRefereeEvaluations).mockReturnValue({
      evaluations: [],
      isLoading: false,
      error: null,
    });
    vi.mocked(evalApi.useRecommendedLevels).mockReturnValue({
      data: [],
      isLoading: false,
    });

    render(<RankingReportTable camp_id={10} />);
    expect(screen.getByText("No Rankings Available")).toBeInTheDocument();
  });

  it("renders rankings, responsive filters, desktop table, and mobile card view", () => {
    vi.mocked(rankingsApi.useRefereeEvaluations).mockReturnValue({
      evaluations: sampleEvaluations,
      isLoading: false,
      error: null,
    });
    vi.mocked(evalApi.useRecommendedLevels).mockReturnValue({
      data: ["Large School Varsity", "Small School Varsity"],
      isLoading: false,
    });

    render(<RankingReportTable camp_id={10} />);

    expect(screen.getByText("Complete Rankings")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search referee name...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset Filters/i })).toBeInTheDocument();

    // Luka and Kyrie should be present in DOM (in both desktop table and mobile cards)
    const lukaElements = screen.getAllByText("Luka Doncic");
    expect(lukaElements.length).toBeGreaterThanOrEqual(1);

    const kyrieElements = screen.getAllByText("Kyrie Irving");
    expect(kyrieElements.length).toBeGreaterThanOrEqual(1);
  });

  it("filters referee by search query and allows reset", async () => {
    const user = userEvent.setup();
    vi.mocked(rankingsApi.useRefereeEvaluations).mockReturnValue({
      evaluations: sampleEvaluations,
      isLoading: false,
      error: null,
    });
    vi.mocked(evalApi.useRecommendedLevels).mockReturnValue({
      data: ["Large School Varsity", "Small School Varsity"],
      isLoading: false,
    });

    render(<RankingReportTable camp_id={10} />);

    const searchInput = screen.getByPlaceholderText("Search referee name...");
    await user.type(searchInput, "Luka");

    expect(screen.getAllByText("Luka Doncic").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("Kyrie Irving")).not.toBeInTheDocument();

    // Click Reset Filters
    const resetBtn = screen.getByRole("button", { name: /Reset Filters/i });
    await user.click(resetBtn);

    expect(screen.getAllByText("Kyrie Irving").length).toBeGreaterThanOrEqual(1);
  });
});
