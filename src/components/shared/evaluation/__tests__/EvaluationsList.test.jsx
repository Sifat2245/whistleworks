import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import EvaluationsList from "../EvaluationsList";

const mockDeleteMutate = vi.fn();
const mockRefetch = vi.fn();

vi.mock("@/hooks/api/useEvaluation", () => ({
  useMyEvaluations: () => ({
    camp: { name: "Orlando Elite 2026" },
    evaluations: [
      {
        id: 55,
        referee: {
          id: 101,
          name: "Stephen Curry",
          email: "steph@warriors.com",
          avatar: "https://example.com/steph.jpg",
        },
        evaluator: { id: 3, name: "Director Bob", role: "director" },
        performance_criteria: { call_accuracy: 10 },
        total_score: 58,
        max_score: 60,
        average_score: 9.67,
        percentage: 96.67,
        current_recommended_level: "NCAA D1",
        submitted_at: "2026-09-12 10:00:00",
      },
    ],
    overall_level_summary: [{ level: "NCAA D1", count: 1 }],
    statistics: { total_evaluations: 1, unique_referees_evaluated: 1 },
    pagination: { total: 1, per_page: 15, current_page: 1, last_page: 1 },
    isLoading: false,
    isFetching: false,
    refetch: mockRefetch,
  }),
  useDeleteEvaluation: () => ({
    mutate: mockDeleteMutate,
    isPending: false,
  }),
  useRecommendedLevels: () => ({
    data: ["HS", "NCAA D1"],
    isLoading: false,
  }),
  useUpdateEvaluation: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useEvaluationDetails: () => ({
    data: null,
    isLoading: false,
  }),
  buildEvaluationFormData: vi.fn(() => new FormData()),
}));

vi.mock("../EditEvaluationModal", () => ({
  default: ({ isOpen, onClose, onSuccess, evaluation }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="edit-modal">
        <span>Editing {evaluation?.referee?.name}</span>
        <button data-testid="save-edit-btn" onClick={() => onSuccess?.()}>
          Save
        </button>
        <button data-testid="close-edit-btn" onClick={onClose}>
          Close
        </button>
      </div>
    );
  },
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(() => Promise.resolve({ isConfirmed: true })),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  );
  Wrapper.displayName = "TestWrapper";
  return Wrapper;
};

describe("EvaluationsList Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders evaluations table with referee info, scores and actions", () => {
    render(
      <EvaluationsList
        campId={13}
        campName="Orlando Elite 2026"
        evaluatePath="/director-dashboard/evaluate/13"
      />,
      { wrapper: createWrapper() }
    );

    expect(screen.getAllByText("Stephen Curry").length).toBeGreaterThan(0);
    expect(screen.getAllByText("steph@warriors.com").length).toBeGreaterThan(0);
    expect(screen.getAllByText("58").length).toBeGreaterThan(0);
    expect(screen.getByText("9.667 / 10")).toBeInTheDocument();
    expect(screen.getAllByText("NCAA D1").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Director Bob").length).toBeGreaterThan(0);

    const evaluateBtn = screen.getByText("Evaluate Referee");
    expect(evaluateBtn).toBeInTheDocument();
    expect(evaluateBtn.closest("a")).toHaveAttribute(
      "href",
      "/director-dashboard/evaluate/13"
    );
  });

  it("filters evaluations by search keyword", () => {
    render(
      <EvaluationsList
        campId={13}
        campName="Orlando Elite 2026"
        evaluatePath="/director-dashboard/evaluate/13"
      />,
      { wrapper: createWrapper() }
    );

    const searchInput = screen.getByPlaceholderText(
      "Search by referee name or level..."
    );
    fireEvent.change(searchInput, { target: { value: "NonExistent" } });

    expect(
      screen.getByText("No matching evaluations found")
    ).toBeInTheDocument();
  });

  it("triggers delete confirmation on clicking delete button", async () => {
    render(
      <EvaluationsList
        campId={13}
        campName="Orlando Elite 2026"
        evaluatePath="/director-dashboard/evaluate/13"
      />,
      { wrapper: createWrapper() }
    );

    const deleteBtns = screen.getAllByTitle("Delete evaluation");
    expect(deleteBtns.length).toBeGreaterThan(0);
    fireEvent.click(deleteBtns[0]);

    await waitFor(() => {
      expect(mockDeleteMutate).toHaveBeenCalledWith(55);
    });
  });

  it("refetches and invalidates queries when evaluation is updated", () => {
    render(
      <EvaluationsList
        campId={13}
        campName="Orlando Elite 2026"
        evaluatePath="/director-dashboard/evaluate/13"
      />,
      { wrapper: createWrapper() }
    );

    const editBtns = screen.getAllByTitle("Edit evaluation");
    expect(editBtns.length).toBeGreaterThan(0);
    fireEvent.click(editBtns[0]);

    // Mock edit modal should be displayed
    expect(screen.getByTestId("edit-modal")).toBeInTheDocument();
    expect(screen.getByText("Editing Stephen Curry")).toBeInTheDocument();

    // Click save in the modal which triggers onSuccess
    const saveBtn = screen.getByTestId("save-edit-btn");
    fireEvent.click(saveBtn);

    expect(mockRefetch).toHaveBeenCalled();
  });
});
