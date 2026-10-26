import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RefereeDetailsModal from "../RefereeDetailsModal";
import Swal from "sweetalert2";

const mockUseRefereeEvaluationHistory = vi.fn();
const mockDeleteMutate = vi.fn();
const mockUseDeleteRefereeEvaluation = vi.fn(() => ({
  mutate: mockDeleteMutate,
  isPending: false,
}));

vi.mock("@/hooks/api/useRankings", () => ({
  useRefereeEvaluationHistory: (...args) =>
    mockUseRefereeEvaluationHistory(...args),
  useDeleteRefereeEvaluation: (...args) =>
    mockUseDeleteRefereeEvaluation(...args),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

describe("RefereeDetailsModal", () => {
  const defaultReferee = {
    referee_id: 76,
    name: "Referee1 User",
    avatar: "https://example.com/avatar.jpg",
    rank: 1,
    overall_percentage: 9.833,
    count: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    mockUseRefereeEvaluationHistory.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    });

    const { container } = render(
      <RefereeDetailsModal
        isOpen={false}
        onClose={vi.fn()}
        referee={defaultReferee}
        campId={16}
      />,
    );

    expect(screen.queryByText("Referee Performance Details")).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it("renders referee summary and evaluation history correctly", () => {
    mockUseRefereeEvaluationHistory.mockReturnValue({
      data: {
        pages: [
          {
            evaluations: [
              {
                id: 101,
                submitted_at: "2026-10-13 14:00",
                performance_criteria: {
                  call_accuracy: 10,
                  communication_skills: 10,
                  consistency_of_calls: 10,
                  court_position_mechanics: 10,
                  fitness_mobility: 9,
                  game_awareness: 10,
                },
                average_score: 9.833,
                evaluators: ["Director1 User"],
                comments: ["Great court positioning and mechanics."],
                referee_feedback: "Keep up good communication.",
                recommended_levels: [
                  {
                    sports_type_level_id: 9,
                    name: "Small School Varsity",
                    level: "Small School Varsity",
                    count: 1,
                  },
                ],
              },
            ],
          },
        ],
      },
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    });

    render(
      <RefereeDetailsModal
        isOpen={true}
        onClose={vi.fn()}
        referee={defaultReferee}
        campId={16}
      />,
    );

    // Modal title & referee name
    expect(
      screen.getByRole("heading", { name: "Referee Performance Details" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Referee1 User").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Rank #1").length).toBeGreaterThan(0);

    // Evaluation history items
    expect(screen.getAllByText("Director1 User").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Small School Varsity").length).toBeGreaterThan(0);
    expect(
      screen.getAllByText("Great court positioning and mechanics.").length,
    ).toBeGreaterThan(0);
  });

  it("calls onClose when the close button is clicked", () => {
    const handleClose = vi.fn();
    mockUseRefereeEvaluationHistory.mockReturnValue({
      data: { pages: [] },
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    });

    render(
      <RefereeDetailsModal
        isOpen={true}
        onClose={handleClose}
        referee={defaultReferee}
        campId={16}
      />,
    );

    const closeBtn = screen.getByRole("button", { name: /close modal/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("triggers deletion confirmation with Swal and executes mutation when confirmed", async () => {
    mockUseRefereeEvaluationHistory.mockReturnValue({
      data: {
        pages: [
          {
            evaluations: [
              {
                id: 101,
                submitted_at: "2026-10-13 14:00",
                evaluators: ["Director1 User"],
                average_score: 9.8,
              },
            ],
          },
        ],
      },
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    });

    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    render(
      <RefereeDetailsModal
        isOpen={true}
        onClose={vi.fn()}
        referee={defaultReferee}
        campId={16}
      />,
    );

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete evaluation/i,
    });
    expect(deleteButtons.length).toBeGreaterThan(0);

    fireEvent.click(deleteButtons[0]);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Delete Evaluation?",
        icon: "warning",
        showCancelButton: true,
      }),
    );

    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalledWith(
        101,
        expect.any(Object),
      );
    });
  });

  it("does not execute delete mutation when cancellation is chosen", async () => {
    mockUseRefereeEvaluationHistory.mockReturnValue({
      data: {
        pages: [
          {
            evaluations: [
              {
                id: 101,
                submitted_at: "2026-10-13 14:00",
                evaluators: ["Director1 User"],
                average_score: 9.8,
              },
            ],
          },
        ],
      },
      isLoading: false,
      hasNextPage: false,
      fetchNextPage: vi.fn(),
      isFetchingNextPage: false,
    });

    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });

    render(
      <RefereeDetailsModal
        isOpen={true}
        onClose={vi.fn()}
        referee={defaultReferee}
        campId={16}
      />,
    );

    const deleteButtons = screen.getAllByRole("button", {
      name: /delete evaluation/i,
    });
    fireEvent.click(deleteButtons[0]);

    expect(Swal.fire).toHaveBeenCalled();
    expect(mockDeleteMutate).not.toHaveBeenCalled();
  });
});
