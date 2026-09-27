import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import DashboardSidebar from "../DashboardSidebar";
import * as useAuthModule from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("DashboardSidebar Component", () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: {
        first_name: "Marcus",
        last_name: "Smart",
        role: "director",
      },
      handleLogout: mockLogout,
    });
  });

  it("renders navigation items for director role", () => {
    render(
      <MemoryRouter initialEntries={["/director-dashboard"]}>
        <DashboardSidebar role="director" isOpen={true} />
      </MemoryRouter>
    );

    expect(screen.getAllByText("All Camps").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Create Camp").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Previous Camps").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Stripe Connection").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Marcus Smart").length).toBeGreaterThanOrEqual(1);
  });

  it("renders navigation items for referee role", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: {
        first_name: "Dave",
        last_name: "Ref",
        role: "referee",
      },
      handleLogout: mockLogout,
    });

    render(
      <MemoryRouter initialEntries={["/referee-dashboard"]}>
        <DashboardSidebar role="referee" isOpen={true} />
      </MemoryRouter>
    );

    expect(screen.getAllByText("My Camps").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Find Camps").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Previous Camps").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Dave Ref").length).toBeGreaterThanOrEqual(1);
  });

  it("renders navigation items for evaluator role", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: {
        first_name: "Elena",
        last_name: "Eval",
        role: "evaluator",
      },
      handleLogout: mockLogout,
    });

    render(
      <MemoryRouter initialEntries={["/evaluator-dashboard"]}>
        <DashboardSidebar role="evaluator" isOpen={true} />
      </MemoryRouter>
    );

    expect(screen.getAllByText("My Camps").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Find Camps").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Elena Eval").length).toBeGreaterThanOrEqual(1);
  });

  it("calls handleLogout when logout button in user card is clicked", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/director-dashboard"]}>
        <DashboardSidebar role="director" isOpen={true} />
      </MemoryRouter>
    );

    const logoutBtns = screen.getAllByRole("button", { name: /log out/i });
    expect(logoutBtns.length).toBeGreaterThanOrEqual(1);

    await user.click(logoutBtns[0]);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when mobile close button is clicked", async () => {
    const handleClose = vi.fn();
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/director-dashboard"]}>
        <DashboardSidebar role="director" isOpen={true} onClose={handleClose} />
      </MemoryRouter>
    );

    handleClose.mockClear();

    const closeBtn = screen.getByRole("button", { name: /close menu/i });
    await user.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});
