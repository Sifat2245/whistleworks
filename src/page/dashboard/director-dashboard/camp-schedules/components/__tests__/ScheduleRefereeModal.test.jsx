import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScheduleRefereeModal from "../ScheduleRefereeModal";

vi.mock("@/hooks/api/useRefereeDetails", () => ({
  useGetRefereeDetails: vi.fn(() => ({
    refereeDetails: {
      camp: { name: "Orlando Elite 2026" },
      referee: {
        id: 42,
        first_name: "Michael",
        last_name: "Jordan",
        email: "mj@bulls.org",
        phone: "555-2323",
        jersey_number: "23",
        registration_status: "checked_in",
        biography: "Legendary referee official",
      },
    },
    isLoading: false,
  })),
}));

vi.mock("@/components/shared/evaluation/EvaluationForm", () => ({
  default: ({ campId, refereeId, onCancel }) => (
    <div data-testid="mock-evaluation-form">
      <span>Mock Evaluation Form for camp {campId} and referee {refereeId}</span>
      <button onClick={onCancel}>Cancel Evaluation</button>
    </div>
  ),
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

describe("ScheduleRefereeModal Component", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    campId: 13,
    refereeData: { referee_id: 42, name: "Michael Jordan" },
    userRole: "director",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders referee profile details in default details view", () => {
    render(<ScheduleRefereeModal {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText("Referee Details")).toBeInTheDocument();
    expect(screen.getByText("Michael Jordan")).toBeInTheDocument();
    expect(screen.getByText("#23")).toBeInTheDocument();
    expect(screen.getByText("mj@bulls.org")).toBeInTheDocument();
    expect(screen.getByText("Checked In")).toBeInTheDocument();
    expect(screen.getByText("Orlando Elite 2026")).toBeInTheDocument();
    expect(screen.getByText("Evaluate This Referee")).toBeInTheDocument();
  });

  it("switches to evaluation view rendering unified EvaluationForm when Evaluate button is clicked", () => {
    render(<ScheduleRefereeModal {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const evaluateBtn = screen.getByText("Evaluate This Referee");
    fireEvent.click(evaluateBtn);

    expect(screen.getByText("Evaluate Referee")).toBeInTheDocument();
    expect(screen.getByTestId("mock-evaluation-form")).toBeInTheDocument();
    expect(
      screen.getByText("Mock Evaluation Form for camp 13 and referee 42")
    ).toBeInTheDocument();

    // Clicking cancel returns to details view
    fireEvent.click(screen.getByText("Cancel Evaluation"));
    expect(screen.getByText("Referee Details")).toBeInTheDocument();
  });
});
