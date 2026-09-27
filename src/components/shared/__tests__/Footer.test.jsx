import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Footer from "../Footer";
import * as useAuthModule from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("Footer Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders branding, copyright, and static navigation links", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: null,
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    expect(screen.getByText("WHISTLE WORKS")).toBeInTheDocument();
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} Whistle Works`, "i"))
    ).toBeInTheDocument();

    expect(screen.getByRole("link", { name: /^home$/i })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: /^all camps$/i })).toHaveAttribute("href", "/all-camps");
    expect(screen.getByRole("link", { name: /^about us$/i })).toHaveAttribute("href", "/about-us");
    expect(screen.getByRole("link", { name: /drewbontrager@gmail\.com/i })).toHaveAttribute(
      "href",
      "mailto:drewbontrager@gmail.com"
    );
  });

  it("shows login and signup links when user is unauthenticated", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: null,
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const loginLink = screen.getByRole("link", { name: /login to account/i });
    const signupLink = screen.getByRole("link", { name: /create new account/i });

    expect(loginLink).toHaveAttribute("href", "/auth/signin");
    expect(signupLink).toHaveAttribute("href", "/auth/signup");
    expect(screen.queryByRole("link", { name: /go to dashboard/i })).not.toBeInTheDocument();
  });

  it("shows 'Go to Dashboard' linking to director dashboard when director is logged in", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { id: 1, role: "director", first_name: "Director" },
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const dashboardLink = screen.getByRole("link", { name: /go to dashboard/i });
    expect(dashboardLink).toBeInTheDocument();
    expect(dashboardLink).toHaveAttribute("href", "/director-dashboard");
  });

  it("shows 'Go to Dashboard' linking to referee dashboard when referee is logged in", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { id: 2, role: "referee", first_name: "Referee" },
    });

    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>
    );

    const dashboardLink = screen.getByRole("link", { name: /go to dashboard/i });
    expect(dashboardLink).toHaveAttribute("href", "/referee-dashboard");
  });
});
