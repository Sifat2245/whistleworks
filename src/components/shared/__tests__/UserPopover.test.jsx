import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import UserPopover from "../UserPopover";
import * as useAuthModule from "@/hooks/useAuth";
import * as stripeHookModule from "@/hooks/api/director-hooks/useStripConnection";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/api/director-hooks/useStripConnection", () => ({
  useStripeConnectionStatus: vi.fn(),
  useConnectStripe: vi.fn(),
  useStripeDashboard: vi.fn(),
}));

describe("UserPopover Component", () => {
  const mockLogout = vi.fn();
  const mockConnectStripeMutate = vi.fn();
  const mockDashboardMutate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(stripeHookModule.useStripeConnectionStatus).mockReturnValue({
      data: { is_connected: false, can_receive_payouts: false },
      isLoading: false,
    });
    vi.mocked(stripeHookModule.useConnectStripe).mockReturnValue({
      mutate: mockConnectStripeMutate,
      isPending: false,
    });
    vi.mocked(stripeHookModule.useStripeDashboard).mockReturnValue({
      mutate: mockDashboardMutate,
      isPending: false,
    });
  });

  it("renders user information and role badge", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: {
        first_name: "Sarah",
        last_name: "Connor",
        email: "sarah@example.com",
        role: "director",
      },
      handleLogout: mockLogout,
    });

    render(
      <MemoryRouter>
        <UserPopover onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Sarah Connor")).toBeInTheDocument();
    expect(screen.getByText("sarah@example.com")).toBeInTheDocument();
    expect(screen.getByText("director")).toBeInTheDocument();
  });

  it("renders correct dashboard and profile links for director", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { first_name: "Sarah", role: "director" },
      handleLogout: mockLogout,
    });

    render(
      <MemoryRouter>
        <UserPopover onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/director-dashboard"
    );
    expect(screen.getByRole("link", { name: /profile/i })).toHaveAttribute(
      "href",
      "/director-dashboard/profile"
    );
  });

  it("renders correct dashboard and profile links for referee", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { first_name: "Mike", role: "referee" },
      handleLogout: mockLogout,
    });

    render(
      <MemoryRouter>
        <UserPopover onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/referee-dashboard"
    );
    expect(screen.getByRole("link", { name: /profile/i })).toHaveAttribute(
      "href",
      "/referee-dashboard/profile"
    );
  });

  it("triggers handleLogout and onNavigate when logout button is clicked", async () => {
    const handleNavigate = vi.fn();
    const user = userEvent.setup();

    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { first_name: "Sarah", role: "director" },
      handleLogout: mockLogout,
    });

    render(
      <MemoryRouter>
        <UserPopover onNavigate={handleNavigate} />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByRole("button", { name: /logout/i });
    await user.click(logoutBtn);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(handleNavigate).toHaveBeenCalledTimes(1);
  });

  it("renders Stripe connection actions for director when not connected", async () => {
    const user = userEvent.setup();

    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { first_name: "Sarah", role: "director" },
      handleLogout: mockLogout,
    });

    render(
      <MemoryRouter>
        <UserPopover onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    const connectBtn = screen.getByRole("button", { name: /connect stripe/i });
    expect(connectBtn).toBeInTheDocument();

    await user.click(connectBtn);
    expect(mockConnectStripeMutate).toHaveBeenCalledTimes(1);
  });

  it("renders Stripe dashboard button for director when connected and payouts active", async () => {
    const user = userEvent.setup();

    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { first_name: "Sarah", role: "director" },
      handleLogout: mockLogout,
    });

    vi.mocked(stripeHookModule.useStripeConnectionStatus).mockReturnValue({
      data: { is_connected: true, can_receive_payouts: true },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <UserPopover onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByText("Stripe connected")).toBeInTheDocument();
    const dashBtn = screen.getByRole("button", { name: /stripe dashboard/i });
    expect(dashBtn).toBeInTheDocument();

    await user.click(dashBtn);
    expect(mockDashboardMutate).toHaveBeenCalledTimes(1);
  });

  it("does not render Stripe connection section for referee or evaluator", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { first_name: "Referee User", role: "referee" },
      handleLogout: mockLogout,
    });

    render(
      <MemoryRouter>
        <UserPopover onNavigate={vi.fn()} />
      </MemoryRouter>
    );

    expect(screen.queryByText(/payments/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /connect stripe/i })).not.toBeInTheDocument();
  });
});
