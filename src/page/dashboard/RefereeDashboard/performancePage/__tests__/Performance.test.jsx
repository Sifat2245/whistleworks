import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Performance from "../Performance";

const mockUseMyEvaluations = vi.fn();
const mockUseRecommendedLevels = vi.fn();

vi.mock("@/hooks/api/referee-hooks/useRefereePerformance", () => ({
  useMyEvaluations: (...args) => mockUseMyEvaluations(...args),
}));

vi.mock("@/hooks/api/useEvaluation", () => ({
  useRecommendedLevels: (...args) => mockUseRecommendedLevels(...args),
}));

vi.mock("../components/OverallPerformance", () => ({
  default: () => <div data-testid="overall-performance" />,
}));

vi.mock("../components/PerformanceBreakdown", () => ({
  default: () => <div data-testid="performance-breakdown" />,
}));

vi.mock("../components/RecentFeedback", () => ({
  default: ({ canViewEvaluations, hideEvaluatorName }) => (
    <div
      data-testid="recent-feedback"
      data-can-view={String(canViewEvaluations)}
      data-hide-evaluator={String(hideEvaluatorName)}
    />
  ),
}));

describe("Performance component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRecommendedLevels.mockReturnValue({ data: [] });
  });

  it("passes canViewEvaluations=true to RecentFeedback when settings.can_view_evaluations is true", () => {
    mockUseMyEvaluations.mockReturnValue({
      data: {
        recent_feedback: [{ id: 1 }],
        settings: {
          can_view_evaluations: true,
          hide_evaluator_name: false,
        },
      },
      isLoading: false,
    });

    render(<Performance camp_id={1} />);

    const feedbackEl = screen.getByTestId("recent-feedback");
    expect(feedbackEl.getAttribute("data-can-view")).toBe("true");
    expect(feedbackEl.getAttribute("data-hide-evaluator")).toBe("false");
  });

  it("passes canViewEvaluations=false to RecentFeedback when settings.can_view_evaluations is false", () => {
    mockUseMyEvaluations.mockReturnValue({
      data: {
        recent_feedback: [{ id: 1 }],
        settings: {
          can_view_evaluations: false,
          hide_evaluator_name: true,
        },
      },
      isLoading: false,
    });

    render(<Performance camp_id={1} />);

    const feedbackEl = screen.getByTestId("recent-feedback");
    expect(feedbackEl.getAttribute("data-can-view")).toBe("false");
    expect(feedbackEl.getAttribute("data-hide-evaluator")).toBe("true");
  });
});

