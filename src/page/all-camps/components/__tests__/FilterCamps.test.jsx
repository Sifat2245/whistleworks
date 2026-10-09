import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import FilterCamps from "../FilterCamps";
import * as noAuthCampsModule from "@/hooks/api/useNoAuthCamps";
import * as useAuthModule from "@/hooks/useAuth";

// Mock the API hooks
vi.mock("@/hooks/api/useNoAuthCamps", () => ({
  usePublicCamps: vi.fn(),
  useSportsTypes: vi.fn(),
  useLocations: vi.fn(),
}));

// Mock useAuth for child CampCard components
vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("FilterCamps Component", () => {
  const mockSportsTypes = [
    { id: 1, sports_name: "Basketball" },
    { id: 2, sports_name: "Football" },
    { id: 3, sports_name: "Soccer" },
  ];

  const mockLocations = ["Chicago, IL", "Dallas, TX", "Orlando, FL"];

  const mockCamps = [
    {
      id: 101,
      camp_name: "Midwest Elite Referee Camp",
      camp_logo: "https://example.com/logo1.png",
      sports_type: "Basketball",
      location: "Chicago, IL",
      start_date: "2026-07-10",
      end_date: "2026-07-12",
      price: "150.00",
      director: { name: "John Doe" },
    },
    {
      id: 102,
      camp_name: "Southern Football Clinic",
      camp_logo: null,
      sports_type: "Football",
      location: "Dallas, TX",
      start_date: "2026-08-01",
      end_date: "2026-08-03",
      price: "0.00",
      director: { name: "Sarah Smith" },
    },
    {
      id: 103,
      camp_name: "Sunshine Soccer Summit",
      camp_logo: null,
      sports_type: "Soccer",
      location: "Orlando, FL",
      start_date: "2026-09-05",
      end_date: "2026-09-07",
      price: "75.00",
      director: { name: "Mike Johnson" },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();

    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoggedIn: false,
      userData: null,
    });

    vi.mocked(noAuthCampsModule.useSportsTypes).mockReturnValue({
      data: mockSportsTypes,
      isLoading: false,
    });

    vi.mocked(noAuthCampsModule.useLocations).mockReturnValue({
      data: mockLocations,
      isLoading: false,
    });

    vi.mocked(noAuthCampsModule.usePublicCamps).mockReturnValue({
      camps: mockCamps,
      isLoading: false,
      pagination: { total: 3, per_page: 32, current_page: 1, last_page: 1 },
    });
  });

  describe("Limited Mode (e.g., Homepage View)", () => {
    it("renders only limited number of camp cards when limit prop is provided", () => {
      render(
        <MemoryRouter>
          <FilterCamps limit={2} />
        </MemoryRouter>
      );

      // Should render the first 2 camp cards
      expect(screen.getByText("Midwest Elite Referee Camp")).toBeInTheDocument();
      expect(screen.getByText("Southern Football Clinic")).toBeInTheDocument();
      expect(screen.queryByText("Sunshine Soccer Summit")).not.toBeInTheDocument();

      // Should not render filter bar or search input in limited mode
      expect(screen.queryByPlaceholderText(/Search camp by name/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Filter & Find Camps/i)).not.toBeInTheDocument();
    });
  });

  describe("Full View Rendering & Filter Panel", () => {
    it("renders the filter panel header, search bar, selectors, and camp list", () => {
      render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      expect(screen.getByText("Filter & Find Camps")).toBeInTheDocument();
      expect(
        screen.getByText(/Refine by sports type, location, date range, or keyword/i)
      ).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText("Search camp by name, location, or director...")
      ).toBeInTheDocument();

      expect(screen.getByText("Sport Type")).toBeInTheDocument();
      expect(screen.getByText("Location")).toBeInTheDocument();
      expect(screen.getByText("Date Range")).toBeInTheDocument();
      expect(screen.getByText("Sort Order")).toBeInTheDocument();

      // Check results counter
      const resultsBar = screen.getByText("Showing").closest("div");
      expect(resultsBar).toHaveTextContent(/Showing\s*3\s*of\s*3\s*camps/i);

      // Check that all 3 camps are rendered
      expect(screen.getByText("Midwest Elite Referee Camp")).toBeInTheDocument();
      expect(screen.getByText("Southern Football Clinic")).toBeInTheDocument();
      expect(screen.getByText("Sunshine Soccer Summit")).toBeInTheDocument();
    });

    it("displays loading placeholders when sports and locations are loading", () => {
      vi.mocked(noAuthCampsModule.useSportsTypes).mockReturnValue({
        data: [],
        isLoading: true,
      });
      vi.mocked(noAuthCampsModule.useLocations).mockReturnValue({
        data: [],
        isLoading: true,
      });

      render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      expect(screen.getAllByText("Loading...").length).toBeGreaterThan(0);
    });

    it("displays skeleton cards when camps are loading", () => {
      vi.mocked(noAuthCampsModule.usePublicCamps).mockReturnValue({
        camps: [],
        isLoading: true,
        pagination: {},
      });

      const { container } = render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      const pulseSkeletons = container.querySelectorAll(".animate-pulse");
      expect(pulseSkeletons.length).toBe(8);
      expect(screen.queryByText("Midwest Elite Referee Camp")).not.toBeInTheDocument();
    });
  });

  describe("Client-side Search Filtering", () => {
    it("filters camps by camp name when user types in search input", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(
        "Search camp by name, location, or director..."
      );
      await user.type(searchInput, "Midwest");

      expect(screen.getByText("Midwest Elite Referee Camp")).toBeInTheDocument();
      expect(screen.queryByText("Southern Football Clinic")).not.toBeInTheDocument();
      expect(screen.queryByText("Sunshine Soccer Summit")).not.toBeInTheDocument();

      // Showing count should update to 1
      expect(screen.getByText("1 Active")).toBeInTheDocument();
      expect(screen.getByText('Keyword: "Midwest"')).toBeInTheDocument();
    });

    it("filters camps by location", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(
        "Search camp by name, location, or director..."
      );
      await user.type(searchInput, "Dallas");

      expect(screen.getByText("Southern Football Clinic")).toBeInTheDocument();
      expect(screen.queryByText("Midwest Elite Referee Camp")).not.toBeInTheDocument();
    });

    it("filters camps by director name", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(
        "Search camp by name, location, or director..."
      );
      await user.type(searchInput, "Sarah");

      expect(screen.getByText("Southern Football Clinic")).toBeInTheDocument();
      expect(screen.queryByText("Midwest Elite Referee Camp")).not.toBeInTheDocument();
    });

    it("filters camps by sports type keyword", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(
        "Search camp by name, location, or director..."
      );
      await user.type(searchInput, "Soccer");

      expect(screen.getByText("Sunshine Soccer Summit")).toBeInTheDocument();
      expect(screen.queryByText("Midwest Elite Referee Camp")).not.toBeInTheDocument();
      expect(screen.queryByText("Southern Football Clinic")).not.toBeInTheDocument();
    });

    it("handles camps with missing or null properties during client-side search", async () => {
      vi.mocked(noAuthCampsModule.usePublicCamps).mockReturnValue({
        camps: [
          {
            id: 201,
            camp_name: null,
            location: null,
            sports_type: null,
            director: null,
          },
        ],
        isLoading: false,
        pagination: { total: 1, per_page: 32, current_page: 1, last_page: 1 },
      });

      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(
        "Search camp by name, location, or director..."
      );
      // Typing something that doesn't match should safely not match without throwing errors
      await user.type(searchInput, "Unknown");
      expect(screen.getByText("No Camps Match Your Filter")).toBeInTheDocument();
    });

    it("clears search input when clicking the search bar clear (X) button", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(
        "Search camp by name, location, or director..."
      );
      await user.type(searchInput, "Midwest");
      expect(searchInput).toHaveValue("Midwest");

      // The clear button inside search input
      const clearBtn = searchInput.parentElement.querySelector("button");
      expect(clearBtn).toBeInTheDocument();
      await user.click(clearBtn);

      expect(searchInput).toHaveValue("");
      expect(screen.getByText("Midwest Elite Referee Camp")).toBeInTheDocument();
      expect(screen.getByText("Southern Football Clinic")).toBeInTheDocument();
    });
  });

  describe("Active Filter Chips and Resetting", () => {
    it("renders active filter chips and allows removing individual sport, location, and date chips", async () => {
      render(
        <MemoryRouter
          initialEntries={[
            "/all-camps?q=Soccer&sports_type_id=1&location=Chicago,%20IL&start_date=2026-07-10&end_date=2026-07-12&sort=newest",
          ]}
        >
          <FilterCamps />
        </MemoryRouter>
      );

      // Active count badge should show 5 active filters
      expect(screen.getByText("5 Active")).toBeInTheDocument();
      expect(screen.getByText("Active Filters:")).toBeInTheDocument();

      // Check all filter chips
      const keywordChip = screen.getByText('Keyword: "Soccer"');
      const sportChip = screen.getByText("Sport: Basketball");
      const locationChip = screen.getByText("Location: Chicago, IL");
      const dateChip = screen.getByText(/Dates: Jul 10 – Jul 12/i);

      expect(keywordChip).toBeInTheDocument();
      expect(sportChip).toBeInTheDocument();
      expect(locationChip).toBeInTheDocument();
      expect(dateChip).toBeInTheDocument();

      // Remove the Sport filter chip
      const sportCloseBtn = within(sportChip).getByRole("button");
      fireEvent.click(sportCloseBtn);
      expect(screen.queryByText("Sport: Basketball")).not.toBeInTheDocument();

      // Remove the Location filter chip
      const locationCloseBtn = within(locationChip).getByRole("button");
      fireEvent.click(locationCloseBtn);
      expect(screen.queryByText("Location: Chicago, IL")).not.toBeInTheDocument();

      // Remove the Date filter chip
      const dateCloseBtn = within(dateChip).getByRole("button");
      fireEvent.click(dateCloseBtn);
      expect(screen.queryByText(/Dates: Jul 10 – Jul 12/i)).not.toBeInTheDocument();
    });

    it("clears all filters when clicking the header 'Clear Filters' button", async () => {
      const user = userEvent.setup();
      render(
        <MemoryRouter
          initialEntries={["/all-camps?q=Midwest&sports_type_id=1&location=Chicago,%20IL"]}
        >
          <FilterCamps />
        </MemoryRouter>
      );

      const clearFiltersBtn = screen.getByRole("button", { name: /Clear Filters/i });
      expect(clearFiltersBtn).toBeInTheDocument();

      await user.click(clearFiltersBtn);

      // All active chips should be gone
      expect(screen.queryByText("Active Filters:")).not.toBeInTheDocument();
      expect(screen.queryByText(/Keyword:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Sport:/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/Location:/i)).not.toBeInTheDocument();
    });
  });

  describe("Empty State Handling", () => {
    it("renders the empty state when no camps match the filter", () => {
      vi.mocked(noAuthCampsModule.usePublicCamps).mockReturnValue({
        camps: [],
        isLoading: false,
        pagination: { total: 0, per_page: 32, current_page: 1, last_page: 1 },
      });

      render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      expect(screen.getByText("No Camps Match Your Filter")).toBeInTheDocument();
      expect(
        screen.getByText(
          /We couldn't find any camps matching your selected parameters./i
        )
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Reset All Filters/i })).toBeInTheDocument();
    });

    it("resets all filters when clicking 'Reset All Filters' in empty state", async () => {
      const user = userEvent.setup();
      vi.mocked(noAuthCampsModule.usePublicCamps).mockReturnValue({
        camps: [],
        isLoading: false,
        pagination: { total: 0, per_page: 32, current_page: 1, last_page: 1 },
      });

      render(
        <MemoryRouter initialEntries={["/all-camps?q=NonExistentCamp"]}>
          <FilterCamps />
        </MemoryRouter>
      );

      const resetBtn = screen.getByRole("button", { name: /Reset All Filters/i });
      await user.click(resetBtn);

      expect(screen.queryByText("Active Filters:")).not.toBeInTheDocument();
    });
  });

  describe("Pagination", () => {
    it("renders pagination when totalPages > 1 and handles page changes", async () => {
      const user = userEvent.setup();
      vi.mocked(noAuthCampsModule.usePublicCamps).mockReturnValue({
        camps: mockCamps,
        isLoading: false,
        pagination: { total: 64, per_page: 32, current_page: 1, last_page: 2 },
      });

      render(
        <MemoryRouter>
          <FilterCamps />
        </MemoryRouter>
      );

      // Antd pagination component should render page item 2
      const page2Btn = screen.getByText("2");
      expect(page2Btn).toBeInTheDocument();

      await user.click(page2Btn);
      expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    });
  });

  describe("Initial URL Search Parameters Initialization", () => {
    it("initializes search params from URL with valid values", () => {
      vi.mocked(noAuthCampsModule.usePublicCamps).mockImplementation((filters) => {
        return {
          camps: mockCamps,
          isLoading: false,
          pagination: { total: 3, per_page: 32, current_page: filters.page, last_page: 1 },
        };
      });

      render(
        <MemoryRouter
          initialEntries={[
            "/all-camps?q=Clinic&sports_type_id=2&location=Dallas,%20TX&sort=oldest&page=2",
          ]}
        >
          <FilterCamps />
        </MemoryRouter>
      );

      const searchInput = screen.getByPlaceholderText(
        "Search camp by name, location, or director..."
      );
      expect(searchInput).toHaveValue("Clinic");
      expect(screen.getByText('Keyword: "Clinic"')).toBeInTheDocument();
      expect(screen.getByText("Sport: Football")).toBeInTheDocument();
      expect(screen.getByText("Location: Dallas, TX")).toBeInTheDocument();
    });

    it("falls back to 'upcoming' sort if sort parameter from URL is invalid", () => {
      render(
        <MemoryRouter initialEntries={["/all-camps?sort=invalid_sort_value"]}>
          <FilterCamps />
        </MemoryRouter>
      );

      expect(screen.getByText("Upcoming First")).toBeInTheDocument();
      expect(screen.queryByText("Active Filters:")).not.toBeInTheDocument();
    });
  });
});
