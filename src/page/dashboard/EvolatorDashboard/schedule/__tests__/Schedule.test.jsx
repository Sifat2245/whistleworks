import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Schedule from "../Schedule";
import * as scheduleApi from "@/hooks/api/evaluator-hooks/useEvaluatorSchedule";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    userData: { role: "evaluator" },
    logout: vi.fn(),
  }),
}));

vi.mock("@/hooks/api/evaluator-hooks/useEvaluatorSchedule", () => ({
  useCampRosterDetails: vi.fn(),
}));

describe("Evaluator Schedule Page Component", () => {
  const sampleCampData = {
    schedule: {
      game_courts: [
        {
          id: 501,
          game_date: "2026-09-02",
          start_time: "11:00:00",
          end_time: "12:30:00",
          address: "777 Hoops Arena",
          court_name: "Court 2",
          status: "in_progress",
          assignments: [
            {
              type: "individual",
              referee_id: 88,
              name: "Scott Foster",
              jourcy_number: "48",
            },
          ],
        },
      ],
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Schedule camp_id="101" />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it("renders loading spin state when schedule is loading", () => {
    vi.mocked(scheduleApi.useCampRosterDetails).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    renderComponent();
    expect(document.querySelector(".ant-spin")).toBeInTheDocument();
  });

  it("renders error alert with retry button when fetching fails", () => {
    vi.mocked(scheduleApi.useCampRosterDetails).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "Server connection timeout" },
    });

    renderComponent();
    expect(screen.getByText("Failed to Load Schedule")).toBeInTheDocument();
    expect(screen.getByText("Server connection timeout")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
  });

  it("renders empty state when no games exist for camp", () => {
    vi.mocked(scheduleApi.useCampRosterDetails).mockReturnValue({
      data: { schedule: { game_courts: [] } },
      isLoading: false,
      isError: false,
    });

    renderComponent();
    expect(screen.getByText("No Games Scheduled")).toBeInTheDocument();
  });

  it("renders schedule overview, responsive search, and game items in desktop & mobile views", async () => {
    const user = userEvent.setup();
    vi.mocked(scheduleApi.useCampRosterDetails).mockReturnValue({
      data: sampleCampData,
      isLoading: false,
      isError: false,
    });

    renderComponent();

    expect(screen.getByText("Games Overview")).toBeInTheDocument();
    expect(screen.getByText(/1 of 1 game scheduled/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(
      "Search by court, referee, date...",
    );
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, "Scott");

    expect(screen.getAllByText(/Scott Foster/i).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByText("Court 2").length).toBeGreaterThanOrEqual(1);
  });
});
