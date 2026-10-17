import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import DirectorLayout from "../DirectorLayout";

vi.mock("@/components/common/DynamicTitleManager", () => ({
  default: () => <div data-testid="mock-dynamic-title">Dynamic Title Manager</div>,
}));

vi.mock("@/components/shared/NoticeTopbar", () => ({
  default: ({ onViewUpdate }) => (
    <div data-testid="mock-notice-topbar">
      <button onClick={onViewUpdate}>View Update Notice</button>
    </div>
  ),
}));

vi.mock("@/components/shared/DashboardSidebar", () => ({
  default: ({ role, isOpen, onClose, containedDesktop }) => (
    <aside
      data-testid="mock-dashboard-sidebar"
      data-role={role}
      data-is-open={String(isOpen)}
      data-contained-desktop={String(containedDesktop)}
    >
      <button onClick={onClose}>Close Sidebar</button>
    </aside>
  ),
}));

vi.mock("@/components/shared/DashboardHeader", () => ({
  default: ({ onOpenSidebar }) => (
    <header data-testid="mock-dashboard-header">
      <button onClick={onOpenSidebar}>Open Sidebar</button>
    </header>
  ),
}));

vi.mock("@/components/shared/NoticePopup", () => ({
  default: ({ isOpen, onClose }) => (
    <div data-testid="mock-notice-popup" data-is-open={String(isOpen)}>
      <button onClick={onClose}>Close Notice Popup</button>
    </div>
  ),
}));

describe("DirectorLayout Component", () => {
  it("renders layout parts including sidebar, header, topbar, popup, and outlet content", () => {
    render(
      <MemoryRouter initialEntries={["/director-dashboard"]}>
        <Routes>
          <Route path="/director-dashboard" element={<DirectorLayout />}>
            <Route
              index
              element={<div data-testid="director-overview">Director Dashboard Body</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("mock-dynamic-title")).toBeInTheDocument();
    expect(screen.getByTestId("mock-notice-topbar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dashboard-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dashboard-sidebar")).toHaveAttribute(
      "data-role",
      "director"
    );
    expect(screen.getByTestId("mock-dashboard-sidebar")).toHaveAttribute(
      "data-contained-desktop",
      "true"
    );
    expect(screen.getByTestId("mock-dashboard-header")).toBeInTheDocument();
    expect(screen.getByTestId("director-overview")).toBeInTheDocument();
    expect(screen.getByTestId("mock-notice-popup")).toBeInTheDocument();
  });

  it("handles opening and closing sidebar via header and sidebar callbacks", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/director-dashboard"]}>
        <Routes>
          <Route path="/director-dashboard" element={<DirectorLayout />}>
            <Route index element={<div>Director Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const sidebar = screen.getByTestId("mock-dashboard-sidebar");
    expect(sidebar).toHaveAttribute("data-is-open", "false");

    await user.click(screen.getByRole("button", { name: "Open Sidebar" }));
    expect(sidebar).toHaveAttribute("data-is-open", "true");

    await user.click(screen.getByRole("button", { name: "Close Sidebar" }));
    expect(sidebar).toHaveAttribute("data-is-open", "false");
  });

  it("handles opening and closing notice popup via topbar and popup callbacks", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/director-dashboard"]}>
        <Routes>
          <Route path="/director-dashboard" element={<DirectorLayout />}>
            <Route index element={<div>Director Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    const popup = screen.getByTestId("mock-notice-popup");
    expect(popup).toHaveAttribute("data-is-open", "false");

    await user.click(screen.getByRole("button", { name: "View Update Notice" }));
    expect(popup).toHaveAttribute("data-is-open", "true");

    await user.click(screen.getByRole("button", { name: "Close Notice Popup" }));
    expect(popup).toHaveAttribute("data-is-open", "false");
  });
});
