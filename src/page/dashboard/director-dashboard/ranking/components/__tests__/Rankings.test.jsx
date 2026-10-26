import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Rankings from "../Rankings";

const mockUseRefereeEvaluations = vi.fn();
const mockUseRecommendedLevels = vi.fn();

vi.mock("@/hooks/api/useRankings", () => ({
  useRefereeEvaluations: (...args) => mockUseRefereeEvaluations(...args),
  useRefereeEvaluationHistory: () => ({
    data: { pages: [] },
    isLoading: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    isFetchingNextPage: false,
  }),
  useDeleteRefereeEvaluation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/hooks/api/useEvaluation", () => ({
  useRecommendedLevels: (...args) => mockUseRecommendedLevels(...args),
}));

describe("Rankings component", () => {
  const sampleRecommendedLevels = [
    { id: 1, name: "NCAA D1", level: "NCAA D1" },
    { id: 2, name: "NCAA D2", level: "NCAA D2" },
    { id: 3, name: "HS", level: "HS" },
  ];

  const sampleEvaluations = [
    {
      referee_id: 101,
      referee_name: "Referee1 User",
      referee_avatar: "https://example.com/ref1.jpg",
      referee_address: "USA",
      total_evaluations: 6,
      averages: {
        overall: 7.367,
        call_accuracy: 6.8,
        communication_skills: 7.4,
        consistency_of_calls: 7.0,
        court_position_mechanics: 8.0,
        fitness_mobility: 7.5,
        game_awareness: 7.5,
      },
      recommended_levels: [{ level: "HS", count: 4 }],
    },
    {
      referee_id: 102,
      referee_name: "Referee2 User",
      referee_avatar: null,
      referee_address: "Canada",
      total_evaluations: 2,
      averages: {
        overall: 7.333,
        call_accuracy: 7.0,
        communication_skills: 8.0,
        consistency_of_calls: 6.0,
        court_position_mechanics: 7.0,
        fitness_mobility: 8.0,
        game_awareness: 8.0,
      },
      recommended_levels: [{ level: "NCAA D1", count: 2 }],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton when data is loading", () => {
    mockUseRefereeEvaluations.mockReturnValue({
      evaluations: [],
      isLoading: true,
      isError: false,
      error: null,
    });
    mockUseRecommendedLevels.mockReturnValue({
      data: [],
      isLoading: true,
    });

    render(<Rankings campId={13} />);

    // Skeleton has pulsing animated blocks
    expect(screen.queryByText("Referee Rankings")).not.toBeInTheDocument();
  });

  it("renders error alert when evaluations fetch fails", () => {
    mockUseRefereeEvaluations.mockReturnValue({
      evaluations: [],
      isLoading: false,
      isError: true,
      error: { message: "Network connection lost" },
    });
    mockUseRecommendedLevels.mockReturnValue({
      data: [],
    });

    render(<Rankings campId={13} />);

    expect(screen.getByText("Failed to Load Rankings")).toBeInTheDocument();
    expect(screen.getByText("Network connection lost")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /retry/i })).toBeInTheDocument();
  });

  it("renders empty state when there are no evaluations", () => {
    mockUseRefereeEvaluations.mockReturnValue({
      evaluations: [],
      isLoading: false,
      isError: false,
      error: null,
    });
    mockUseRecommendedLevels.mockReturnValue({
      data: sampleRecommendedLevels,
    });

    render(<Rankings campId={13} />);

    expect(screen.getByText("Referee Rankings")).toBeInTheDocument();
    expect(screen.getAllByText("No Rankings Yet").length).toBeGreaterThan(0);
  });

  it("renders rankings table, stats cards, and handles referee selection without crashing", () => {
    mockUseRefereeEvaluations.mockReturnValue({
      evaluations: sampleEvaluations,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockUseRecommendedLevels.mockReturnValue({
      data: sampleRecommendedLevels,
    });

    render(<Rankings campId={13} />);

    // Check stats cards
    expect(screen.getByText("Referee Rankings")).toBeInTheDocument();
    expect(screen.getByText("Total Evaluations")).toBeInTheDocument();
    expect(screen.getByText("Referees Evaluated")).toBeInTheDocument();

    // Check referee names appear in the document
    expect(screen.getAllByText("Referee1 User").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Referee2 User").length).toBeGreaterThan(0);

    // Clicking referee name opens details modal
    const refButtons = screen.getAllByRole("button", { name: "Referee1 User" });
    fireEvent.click(refButtons[0]);

    expect(
      screen.getByText("Referee Performance Details"),
    ).toBeInTheDocument();
  });

  it("handles column sorting click without infinite re-render loops", () => {
    mockUseRefereeEvaluations.mockReturnValue({
      evaluations: sampleEvaluations,
      isLoading: false,
      isError: false,
      error: null,
    });
    mockUseRecommendedLevels.mockReturnValue({
      data: sampleRecommendedLevels,
    });

    render(<Rankings campId={13} />);

    // Click overall sorting header
    const overallSortBtn = screen.getByRole("button", { name: /overall/i });
    expect(overallSortBtn).toBeInTheDocument();

    fireEvent.click(overallSortBtn);

    // Ensure table still renders cleanly
    expect(screen.getAllByText("Referee1 User").length).toBeGreaterThan(0);
  });
});
