import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import CampDetailsPageForNoAuth from "../CampDetailsPageForNoAuth";
import * as noAuthApiModule from "@/hooks/api/useNoAuthCamps";
import Swal from "sweetalert2";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/hooks/api/useNoAuthCamps", () => ({
  usePublicCampDetails: vi.fn(),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
    DismissReason: {
      cancel: "cancel",
      backdrop: "backdrop",
    },
  },
}));

describe("CampDetailsPageForNoAuth Page Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCamp = {
    id: 42,
    camp_name: "Elite Referee Summer Showcase",
    camp_logo: "https://example.com/camp-logo.png",
    sports_type_name: "Basketball",
    location: "Indianapolis, IN",
    start_date: "2026-08-15",
    end_date: "2026-08-18",
    price: "250.00",
    status: "upcoming",
    camp_details: "<p>Comprehensive 3-day officiating clinic.</p>",
    director: {
      name: "Marcus Vance",
      avatar: "https://example.com/marcus.png",
      email: "marcus@example.com",
      phone: "+1 555-0199",
      address: "100 Sports Way",
    },
  };

  const renderComponent = () =>
    render(
      <MemoryRouter initialEntries={["/camp/details/42"]}>
        <Routes>
          <Route
            path="/camp/details/:id"
            element={<CampDetailsPageForNoAuth />}
          />
        </Routes>
      </MemoryRouter>,
    );

  it("renders loading skeleton while fetching data", () => {
    vi.mocked(noAuthApiModule.usePublicCampDetails).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      refetch: vi.fn(),
    });

    renderComponent();

    // Skeleton contains pulse placeholders
    const skeletonElements = document.querySelectorAll(".animate-pulse");
    expect(skeletonElements.length).toBeGreaterThan(0);
  });

  it("renders error state when request fails and allows retry", async () => {
    const mockRefetch = vi.fn();
    vi.mocked(noAuthApiModule.usePublicCampDetails).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      refetch: mockRefetch,
    });

    renderComponent();

    expect(
      screen.getByText("We couldn't load this camp"),
    ).toBeInTheDocument();

    const retryBtn = screen.getByRole("button", { name: /try again/i });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(mockRefetch).toHaveBeenCalledTimes(1);
  });

  it("renders camp details successfully with hero, director, and sidebar info", () => {
    vi.mocked(noAuthApiModule.usePublicCampDetails).mockReturnValue({
      data: mockCamp,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    renderComponent();

    expect(
      screen.getByRole("heading", { name: "Elite Referee Summer Showcase" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Marcus Vance").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Indianapolis, IN").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Basketball").length).toBeGreaterThanOrEqual(1);
  });

  it("prompts user to log in or sign up when clicking Register Now, navigating to sign in when confirmed", async () => {
    const user = userEvent.setup();
    vi.mocked(noAuthApiModule.usePublicCampDetails).mockReturnValue({
      data: mockCamp,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    vi.mocked(Swal.fire).mockResolvedValue({
      isConfirmed: true,
      isDenied: false,
      isDismissed: false,
    });

    renderComponent();

    const registerBtns = screen.getAllByRole("button", { name: /register now/i });
    expect(registerBtns.length).toBeGreaterThanOrEqual(1);

    await user.click(registerBtns[0]);

    expect(Swal.fire).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/auth/signin", {
      state: { from: "/camp/details/42" },
    });
  });

  it("navigates to signup when user dismisses modal with cancel", async () => {
    const user = userEvent.setup();
    vi.mocked(noAuthApiModule.usePublicCampDetails).mockReturnValue({
      data: mockCamp,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    });

    vi.mocked(Swal.fire).mockResolvedValue({
      isConfirmed: false,
      isDismissed: true,
      dismiss: Swal.DismissReason.cancel,
    });

    renderComponent();

    const registerBtns = screen.getAllByRole("button", { name: /register now/i });
    await user.click(registerBtns[0]);

    expect(mockNavigate).toHaveBeenCalledWith("/auth/signup", {
      state: { from: "/camp/details/42" },
    });
  });
});
