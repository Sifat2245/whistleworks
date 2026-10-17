import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EvaluationForm from "../EvaluationForm";

const mockStoreEvaluationMutate = vi.fn();

vi.mock("@/hooks/api/useEvaluation", () => ({
  useRecommendedLevels: () => ({
    data: [
      { id: 7, name: "Large School Varsity", level: "Large School Varsity" },
      { id: 8, name: "Mid Size School Varsity", level: "Mid Size School Varsity" },
      { id: 10, name: "Junior Varsity", level: "Junior Varsity" },
    ],
    isLoading: false,
  }),
  useStoreEvaluation: vi.fn((campId, options) => ({
    mutate: (...args) => {
      mockStoreEvaluationMutate(...args);
      options?.onSuccess?.({ data: { message: "Evaluation saved" } });
    },
    isPending: false,
  })),
  buildEvaluationFormData: vi.fn((data, campId) => {
    const fd = new FormData();
    fd.append("referee_id", data.referee_id);
    fd.append("camp_id", campId);
    return fd;
  }),
}));

vi.mock("@/hooks/api/useRegisteredReferees", () => ({
  useRegisteredReferees: () => ({
    getRegisterReferess: [
      { referee_id: 101, name: "John Doe", jersey_number: "42", email: "john@example.com" },
      { referee_id: 102, name: "Jane Smith", jersey_number: "15", email: "jane@example.com" },
    ],
    isLoading: false,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

describe("Unified EvaluationForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all 6 evaluation criteria and referee dropdown when referee is not preselected", () => {
    render(<EvaluationForm campId={13} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getAllByText("Select Referee").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Evaluation Criteria")).toBeInTheDocument();
    expect(screen.getByText("Call / No Call Accuracy")).toBeInTheDocument();
    expect(screen.getByText("Communication Skills")).toBeInTheDocument();
    expect(screen.getByText("Consistency of Calls")).toBeInTheDocument();
    expect(screen.getByText("Court Position & Mechanics")).toBeInTheDocument();
    expect(screen.getByText("Fitness & Mobility")).toBeInTheDocument();
    expect(screen.getByText("Game Awareness")).toBeInTheDocument();
    expect(
      screen.getByText("Officiating Level Recommendation")
    ).toBeInTheDocument();
    expect(screen.getByText("Submit Evaluation Report")).toBeInTheDocument();
  });

  it("renders locked referee banner when refereeId and refereeData are provided", () => {
    const referee = {
      referee_id: 88,
      name: "Marcus Aurelius",
      email: "marcus@rome.org",
      jersey_number: "77",
    };

    render(
      <EvaluationForm
        campId={13}
        refereeId={88}
        refereeData={referee}
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getByText("Evaluating Official")).toBeInTheDocument();
    expect(screen.getByText("Marcus Aurelius")).toBeInTheDocument();
    expect(screen.getByText("#77")).toBeInTheDocument();
    expect(screen.getByText("marcus@rome.org")).toBeInTheDocument();
    expect(screen.queryByText("Select Referee")).not.toBeInTheDocument();
  });

  it("calls onCancel when cancel button is clicked", () => {
    const handleCancel = vi.fn();

    render(
      <EvaluationForm
        campId={13}
        refereeId={88}
        refereeData={{ referee_id: 88, name: "Marcus" }}
        onCancel={handleCancel}
      />,
      { wrapper: createWrapper() }
    );

    const cancelBtn = screen.getByRole("button", { name: /cancel/i });
    expect(cancelBtn).toBeInTheDocument();
    fireEvent.click(cancelBtn);
    expect(handleCancel).toHaveBeenCalledTimes(1);
  });
});
