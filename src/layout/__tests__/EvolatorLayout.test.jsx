import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import EvolatorLayout from "../EvolatorLayout";

vi.mock("@/components/common/DynamicTitleManager", () => ({
  default: () => <div data-testid="mock-dynamic-title">Dynamic Title Manager</div>,
}));

vi.mock("@/components/shared/DashboardSidebar", () => ({
  default: ({ role, isOpen, onClose }) => (
    <aside
      data-testid="mock-dashboard-sidebar"
      data-role={role}
      data-is-open={String(isOpen)}
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

describe("EvolatorLayout Component", () => {
  it("renders evaluator sidebar, header, dynamic title, and outlet content", () => {
    render(
      <MemoryRouter initialEntries={["/evaluator-dashboard"]}>
        <Routes>
          <Route path="/evaluator-dashboard" element={<EvolatorLayout />}>
            <Route
              index
              element={<div data-testid="evaluator-content">Evaluator Home</div>}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId("mock-dynamic-title")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dashboard-sidebar")).toBeInTheDocument();
    expect(screen.getByTestId("mock-dashboard-sidebar")).toHaveAttribute(
      "data-role",
      "evaluator"
    );
    expect(screen.getByTestId("mock-dashboard-header")).toBeInTheDocument();
    expect(screen.getByTestId("evaluator-content")).toBeInTheDocument();
  });

  it("toggles sidebar open state on open and close triggers", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={["/evaluator-dashboard"]}>
        <Routes>
          <Route path="/evaluator-dashboard" element={<EvolatorLayout />}>
            <Route index element={<div>Evaluator Content</div>} />
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
});
