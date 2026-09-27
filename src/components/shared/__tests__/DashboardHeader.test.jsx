import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DashboardHeader from "../DashboardHeader";
import * as useAuthModule from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../NotificationBell", () => ({
  default: () => <div data-testid="notification-bell">NotificationBell</div>,
}));

vi.mock("../UserPopover", () => ({
  default: ({ onNavigate }) => (
    <div data-testid="user-popover">
      <button onClick={onNavigate}>Close Popover</button>
    </div>
  ),
}));

describe("DashboardHeader Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders branding logo and notification bell", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { first_name: "Alex", role: "director" },
    });

    render(
      <MemoryRouter>
        <DashboardHeader />
      </MemoryRouter>
    );

    expect(screen.getByText("WHISTLE WORKS")).toBeInTheDocument();
    expect(screen.getByTestId("notification-bell")).toBeInTheDocument();
  });

  it("displays welcome back greeting and role badge for director", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { first_name: "Alex", role: "director" },
    });

    render(
      <MemoryRouter>
        <DashboardHeader />
      </MemoryRouter>
    );

    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getAllByText("Alex").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Director")).toBeInTheDocument();
  });

  it("calls onOpenSidebar when mobile menu button is clicked", async () => {
    const handleOpenSidebar = vi.fn();
    const user = userEvent.setup();

    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { first_name: "Alex", role: "referee" },
    });

    render(
      <MemoryRouter>
        <DashboardHeader onOpenSidebar={handleOpenSidebar} />
      </MemoryRouter>
    );

    const menuBtn = screen.getByRole("button", { name: /open menu/i });
    expect(menuBtn).toBeInTheDocument();

    await user.click(menuBtn);
    expect(handleOpenSidebar).toHaveBeenCalledTimes(1);
  });
});
