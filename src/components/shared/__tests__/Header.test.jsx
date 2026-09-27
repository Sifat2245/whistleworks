import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Header from "../Header";
import * as useAuthModule from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("../NotificationBell", () => ({
  default: () => <div data-testid="notification-bell">NotificationBell</div>,
}));

vi.mock("../UserPopover", () => ({
  default: () => <div data-testid="user-popover">UserPopover</div>,
}));

describe("Header Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders desktop navigation links and login button when logged out", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: null,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getAllByText("WHISTLE WORKS").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /^home$/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /^all camps$/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /^about us$/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /^faq$/i }).length).toBeGreaterThanOrEqual(1);

    const loginLinks = screen.getAllByRole("link", { name: /login/i });
    expect(loginLinks.some((link) => link.getAttribute("href") === "/auth/signin")).toBe(true);
  });

  it("renders user avatar and notification bell when user is logged in", () => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: { first_name: "Marcus", email: "marcus@example.com" },
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getAllByText("Marcus").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByTestId("notification-bell").length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole("link", { name: /^login$/i })).not.toBeInTheDocument();
  });

  it("toggles mobile menu when toggle button is clicked", async () => {
    const user = userEvent.setup();

    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData: null,
    });

    render(
      <MemoryRouter initialEntries={["/"]}>
        <Header />
      </MemoryRouter>
    );

    const toggleBtn = screen.getByRole("button", { name: /toggle menu/i });
    await user.click(toggleBtn);

    const closeBtn = screen.getByRole("button", { name: /close menu/i });
    expect(closeBtn).toBeInTheDocument();

    await user.click(closeBtn);
  });
});
