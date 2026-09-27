import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import CampCard from "../CampCard";
import * as useAuthModule from "@/hooks/useAuth";

// Mock useAuth
vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("CampCard Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCamp = {
    id: 101,
    camp_name: "Midwest Elite Referee Camp",
    camp_logo: "https://example.com/logo.png",
    image: "https://example.com/banner.png",
    location: "Chicago, IL",
    start_date: "2026-07-10",
    end_date: "2026-07-12",
    price: "150.00",
    sports_type: "HS Basketball",
    director: { name: "John Doe" },
  };

  it("renders camp details with title, location, dates, duration, price, and sport type", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoggedIn: false,
      userData: null,
    });

    render(
      <MemoryRouter>
        <CampCard camp={mockCamp} />
      </MemoryRouter>
    );

    expect(screen.getByText("Midwest Elite Referee Camp")).toBeInTheDocument();
    expect(screen.getByText("Chicago, IL")).toBeInTheDocument();
    expect(screen.getByText("2026-07-10 – 2026-07-12")).toBeInTheDocument();
    expect(screen.getByText("$150")).toBeInTheDocument();
    expect(screen.getByText("HS Basketball")).toBeInTheDocument();
    expect(screen.getByText("3 Days")).toBeInTheDocument();
  });

  it("renders 'Free' when camp price is 0 or not provided", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoggedIn: false,
      userData: null,
    });

    render(
      <MemoryRouter>
        <CampCard camp={{ ...mockCamp, price: "0" }} />
      </MemoryRouter>
    );

    expect(screen.getByText("Free")).toBeInTheDocument();
  });

  it("renders monogram initials when camp_logo is absent", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoggedIn: false,
      userData: null,
    });

    render(
      <MemoryRouter>
        <CampCard camp={{ ...mockCamp, camp_logo: null }} />
      </MemoryRouter>
    );

    // Initials for "Midwest Elite Referee Camp" should be "ME"
    expect(screen.getByText("ME")).toBeInTheDocument();
  });

  it("links to /all-camps/:id for unauthenticated users", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoggedIn: false,
      userData: null,
    });

    render(
      <MemoryRouter>
        <CampCard camp={mockCamp} />
      </MemoryRouter>
    );

    const viewDetailsLink = screen.getByRole("link", { name: /view details/i });
    expect(viewDetailsLink).toHaveAttribute("href", "/all-camps/101");
  });

  it("links to director dashboard camp-overview for director role", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoggedIn: true,
      userData: { role: "director" },
    });

    render(
      <MemoryRouter>
        <CampCard camp={mockCamp} />
      </MemoryRouter>
    );

    const viewDetailsLink = screen.getByRole("link", { name: /view details/i });
    expect(viewDetailsLink).toHaveAttribute("href", "/director-dashboard/camp-overview/101");
  });

  it("links to evaluator dashboard camp details for evaluator role", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoggedIn: true,
      userData: { role: "evaluator" },
    });

    render(
      <MemoryRouter>
        <CampCard camp={mockCamp} />
      </MemoryRouter>
    );

    const viewDetailsLink = screen.getByRole("link", { name: /view details/i });
    expect(viewDetailsLink).toHaveAttribute(
      "href",
      "/evaluator-dashboard/camp/101?tab=camp-details"
    );
  });

  it("links to referee dashboard camp details for referee role", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoggedIn: true,
      userData: { role: "referee" },
    });

    render(
      <MemoryRouter>
        <CampCard camp={mockCamp} />
      </MemoryRouter>
    );

    const viewDetailsLink = screen.getByRole("link", { name: /view details/i });
    expect(viewDetailsLink).toHaveAttribute(
      "href",
      "/referee-dashboard/camp/101?tab=camp-details"
    );
  });

  it("handles empty or default camp properties gracefully", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      isLoggedIn: false,
      userData: null,
    });

    render(
      <MemoryRouter>
        <CampCard camp={{}} />
      </MemoryRouter>
    );

    expect(screen.getByText("Great Lakes Basketball Summit")).toBeInTheDocument();
    expect(screen.getByText("Location Not Specified")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();
  });
});
