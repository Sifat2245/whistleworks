import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CampSchedules from "../CampSchedules";
import * as scheduleApi from "@/hooks/api/evaluator-hooks/useEvaluatorSchedule";
import * as exportApi from "@/hooks/api/director-hooks/useExport";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    userData: { role: "director" },
    logout: vi.fn(),
  }),
}));

vi.mock("@/hooks/api/evaluator-hooks/useEvaluatorSchedule", () => ({
  useCampRosterDetails: vi.fn(),
}));

vi.mock("@/hooks/api/director-hooks/useExport", () => ({
  useExportSchedule: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "101" }),
  };
});

describe("CampSchedules Page Component", () => {
  const mockExport = vi.fn();

  const sampleCampData = {
    schedule: {
      game_courts: [
        {
          id: 1,
          game_date: "2026-09-01",
          start_time: "09:00:00",
          end_time: "10:30:00",
          address: "123 Stadium Way",
          court_name: "Court 1",
          status: "scheduled",
          assignments: [
            {
              type: "individual",
              referee_id: 10,
              name: "Tony Brothers",
              jourcy_number: "25",
            },
          ],
        },
      ],
    },
    sports_type: { name: "Basketball" },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(exportApi.useExportSchedule).mockReturnValue({
      mutate: mockExport,
      isPending: false,
    });
  });

  const renderComponent = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <CampSchedules />
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  it("renders loading skeleton when schedule is loading", () => {
    vi.mocked(scheduleApi.useCampRosterDetails).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    renderComponent();
    expect(document.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("renders error state with retry button when query fails", () => {
    vi.mocked(scheduleApi.useCampRosterDetails).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "Network error loading schedule" },
    });

    renderComponent();
    expect(screen.getByText("Failed to Load Schedule")).toBeInTheDocument();
    expect(
      screen.getByText("Network error loading schedule"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
  });

  it("renders empty state when no games are scheduled", () => {
    vi.mocked(scheduleApi.useCampRosterDetails).mockReturnValue({
      data: { schedule: { game_courts: [] } },
      isLoading: false,
      isError: false,
    });

    renderComponent();
    expect(screen.getByText("No Games Scheduled")).toBeInTheDocument();
  });

  it("renders stats, responsive search, export CSV, and game schedule in desktop & mobile views", async () => {
    const user = userEvent.setup();
    vi.mocked(scheduleApi.useCampRosterDetails).mockReturnValue({
      data: sampleCampData,
      isLoading: false,
      isError: false,
    });

    renderComponent();

    expect(screen.getByText("Games Overview")).toBeInTheDocument();
    expect(screen.getByText("Games Scheduled")).toBeInTheDocument();
    expect(screen.getByText("Courts")).toBeInTheDocument();
    expect(screen.getByText("Referees Assigned")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(
      "Search by court, referee, date...",
    );
    expect(searchInput).toBeInTheDocument();

    const exportBtn = screen.getByRole("button", { name: /Export CSV/i });
    expect(exportBtn).toBeInTheDocument();

    await user.click(exportBtn);
    expect(mockExport).toHaveBeenCalledTimes(1);

    // Tony Brothers should be visible in schedule
    expect(screen.getAllByText(/Tony Brothers/i).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(screen.getAllByText("Court 1").length).toBeGreaterThanOrEqual(1);
  });
});
