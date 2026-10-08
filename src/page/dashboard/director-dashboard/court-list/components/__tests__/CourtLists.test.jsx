import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CourtLists from "../CourtLists";

const mockCampData = {
  id: 10,
  camp_name: "Summer Championship",
  sport: { sports_name: "Basketball" },
};

const mockAvailableDates = [
  { date: "2026-05-08T00:00:00Z", formatted: "May 08", day: "Friday" },
  { date: "2026-05-09T00:00:00Z", formatted: "May 09", day: "Saturday" },
];

const mockAvailableLocations = [
  { location_id: 101, address: "Court Center A", court_count: 2 },
  { location_id: 102, address: "Court Center B", court_count: 2 },
];

const mockCourtInfoData = {
  mode: "individual",
  schedule: {
    schedule_id: 50,
    max_referees_per_slot: 2,
    status: "published",
  },
  court_headers: [
    {
      location_id: 101,
      court_number: 1,
      court_name: "Court 1",
      address: "Court Center A",
    },
    {
      location_id: 101,
      court_number: 2,
      court_name: "Court 2",
      address: "Court Center A",
    },
  ],
  time_slots: [
    {
      time: "09:00 AM",
      time_24h: "09:00:00",
      courts: [
        {
          slot_id: 9001,
          court_number: 1,
          location_id: 101,
          is_blocked: 0,
          assignments: [],
          positions: [
            { id: 1, position: "Main Referee", is_assigned: false },
            { id: 2, position: "Assistant", is_assigned: false },
          ],
        },
      ],
    },
  ],
};

const mockBulkModeChange = vi.fn();

vi.mock("@/hooks/api/director-hooks/useGameAssingments", () => ({
  useAvailableDates: () => ({
    data: {
      available_dates: mockAvailableDates,
      available_locations: mockAvailableLocations,
    },
    isLoading: false,
  }),
  useCourtInfo: () => ({
    data: mockCourtInfoData,
    isLoading: false,
  }),
  useBulkUpdateCourtNames: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useToggleBlockSlot: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useBulkToggleBlock: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useCourtModeChange: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useBulkModeChange: () => ({
    mutate: mockBulkModeChange,
    isPending: false,
  }),
  useRemoveAssignment: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useAvailableReferees: () => ({
    data: [],
    isLoading: false,
  }),
  useAvailableCrews: () => ({
    data: [],
    isLoading: false,
  }),
  useAssignReferees: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useAssignCrew: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useAutoAssign: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/hooks/useCampSchedule", () => ({
  default: () => ({
    scheduleData: { id: 50 },
  }),
}));

vi.mock("@/hooks/api/director-hooks/useBuildSchedule", () => ({
  usePublishSchedule: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useClearSchedule: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
  useDeleteSchedule: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

const renderCourtLists = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CourtLists campData={mockCampData} />
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe("CourtLists Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders overview stats, schedule coverage, date filters, and mode toggles", () => {
    renderCourtLists();

    expect(screen.getByText("Courts")).toBeInTheDocument();
    expect(screen.getByText("Time Slots")).toBeInTheDocument();
    expect(screen.getByText("Assigned Slots")).toBeInTheDocument();
    expect(screen.getByText("Blocked Slots")).toBeInTheDocument();
    expect(screen.getByText("Schedule coverage")).toBeInTheDocument();

    expect(screen.getByText("May 08")).toBeInTheDocument();
    expect(screen.getByText("May 09")).toBeInTheDocument();

    expect(screen.getByText("Individual Refs")).toBeInTheDocument();
    expect(screen.getByText("Crews Mode")).toBeInTheDocument();
  });

  it("switches assignment mode to crew mode when clicking Crews Mode button", () => {
    renderCourtLists();

    const crewModeBtn = screen.getByRole("button", { name: /crews mode/i });
    fireEvent.click(crewModeBtn);

    expect(mockBulkModeChange).toHaveBeenCalledWith({
      scheduleId: 50,
      mode: "crew",
    });
  });

  it("filters search input when typing referee name", () => {
    renderCourtLists();

    const searchInput = screen.getByPlaceholderText(
      /search referee by name, email/i
    );
    fireEvent.change(searchInput, { target: { value: "Marcus" } });

    expect(searchInput.value).toBe("Marcus");
  });

  it("opens RefereeAssignModal when clicking an unassigned court position in individual mode", () => {
    renderCourtLists();

    const assignBtns = screen.getAllByText("Assign");
    expect(assignBtns.length).toBeGreaterThan(0);

    fireEvent.click(assignBtns[0]);

    expect(screen.getByText(/Assign to Court 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Court Positions/i)).toBeInTheDocument();
  });
});
