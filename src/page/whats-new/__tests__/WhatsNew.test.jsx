import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import WhatsNew from "../WhatsNew";
import * as useAuthModule from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

describe("WhatsNew Page Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollTo = vi.fn();
  });

  const renderWhatsNew = (userData = null) => {
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      userData,
    });

    return render(
      <MemoryRouter>
        <WhatsNew />
      </MemoryRouter>,
    );
  };

  it("renders breadcrumbs, latest release header, and default v1.2.0 sections", () => {
    renderWhatsNew();

    expect(screen.getByText("Docs")).toBeInTheDocument();
    expect(screen.getByText("What's New")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "Delegated Camp Control & Granular Permissions",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("New Feature")).toBeInTheDocument();
    expect(screen.getByText("Published August 15, 2026")).toBeInTheDocument();
    expect(
      screen.getByText(/Directors can now delegate management by assigning other directors/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Understanding Permission Scopes" })).toBeInTheDocument();
  });

  it("switches releases when clicking a version in the sidebar history", async () => {
    const user = userEvent.setup();
    renderWhatsNew();

    // Click on "Slot-Based Scheduling" in the sidebar
    const slotSchedulingBtns = screen.getAllByRole("button", {
      name: /Slot-Based Scheduling/i,
    });
    expect(slotSchedulingBtns.length).toBeGreaterThanOrEqual(1);

    await user.click(slotSchedulingBtns[0]);

    // Heading for v1.1.0 should now be rendered as H1
    expect(
      screen.getByRole("heading", {
        name: "Slot-Based Scheduling & Crew Assignments",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("UX Improvement")).toBeInTheDocument();
    expect(screen.getByText("Published July 28, 2026")).toBeInTheDocument();
  });

  it("switches to v1.0.0 when clicking Stripe Connect release", async () => {
    const user = userEvent.setup();
    renderWhatsNew();

    const stripeBtns = screen.getAllByRole("button", {
      name: /Stripe Connect Registration Integration/i,
    });
    expect(stripeBtns.length).toBeGreaterThanOrEqual(1);

    await user.click(stripeBtns[0]);

    expect(
      screen.getByRole("heading", {
        name: "Stripe Connect Registration Integration",
        level: 1,
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("Core Setup")).toBeInTheDocument();
    expect(screen.getByText("Published June 12, 2026")).toBeInTheDocument();
  });

  it("scrolls to section when clicking a table-of-contents button", async () => {
    const user = userEvent.setup();
    const mockElement = {
      getBoundingClientRect: () => ({ top: 300 }),
    };
    vi.spyOn(document, "getElementById").mockReturnValue(mockElement);

    renderWhatsNew();

    const tocBtns = screen.getAllByRole("button", {
      name: /Understanding Permission Scopes/i,
    });
    expect(tocBtns.length).toBeGreaterThanOrEqual(1);

    await user.click(tocBtns[0]);
    expect(window.scrollTo).toHaveBeenCalled();
  });

  it("toggles the mobile sidebar navigation menu open and close", async () => {
    const user = userEvent.setup();
    renderWhatsNew();

    const mobileMenuBtn = screen.getByRole("button", {
      name: /Navigate Docs/i,
    });
    expect(mobileMenuBtn).toBeInTheDocument();

    await user.click(mobileMenuBtn);

    // Sidebar drawer should display documentation menu
    expect(screen.getByText("Documentation Menu")).toBeInTheDocument();

    // Find and click the close button inside mobile drawer
    const drawerTitle = screen.getByText("Documentation Menu");
    const closeBtn = drawerTitle.parentElement.querySelector("button");
    expect(closeBtn).toBeInTheDocument();

    await user.click(closeBtn);
  });

  it("renders correct dashboard link for director role", () => {
    renderWhatsNew({ role: "director" });

    const dashboardLinks = screen.getAllByRole("link", { name: /Go to Dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);
    expect(dashboardLinks[0]).toHaveAttribute("href", "/director-dashboard");
  });

  it("renders correct dashboard link for referee role", () => {
    renderWhatsNew({ role: "referee" });

    const dashboardLinks = screen.getAllByRole("link", { name: /Go to Dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);
    expect(dashboardLinks[0]).toHaveAttribute("href", "/referee-dashboard");
  });

  it("renders correct dashboard link for evaluator role", () => {
    renderWhatsNew({ role: "evaluator" });

    const dashboardLinks = screen.getAllByRole("link", { name: /Go to Dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);
    expect(dashboardLinks[0]).toHaveAttribute("href", "/evaluator-dashboard");
  });

  it("renders link to root when user is a guest", () => {
    renderWhatsNew(null);

    const dashboardLinks = screen.getAllByRole("link", { name: /Go to Dashboard/i });
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);
    expect(dashboardLinks[0]).toHaveAttribute("href", "/");
  });
});
