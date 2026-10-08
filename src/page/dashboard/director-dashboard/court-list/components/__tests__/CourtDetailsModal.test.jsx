import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { CourtDetailsModal } from "../CourtDetailsModal";

const mockScheduleData = {
  status: "published",
  game_duration: 60,
  total_game_slots: 20,
  max_referees_per_slot: 3,
  assigned_slots: 12,
  available_slots: 6,
  blocked_slots: 2,
  created_at: "2026-05-01T10:00:00Z",
  time_ranges: [
    {
      formatted_date: "May 08, 2026",
      start_time: "08:00 AM",
      end_time: "06:00 PM",
    },
    {
      formatted_date: "May 09, 2026",
      start_time: "09:00 AM",
      end_time: "05:00 PM",
    },
  ],
};

describe("CourtDetailsModal Component", () => {
  it("renders nothing when open is false", () => {
    render(
      <CourtDetailsModal
        open={false}
        onClose={vi.fn()}
        scheduleData={mockScheduleData}
      />
    );
    expect(screen.queryByText("Court Schedule Details")).not.toBeInTheDocument();
  });

  it("renders schedule stats and time ranges when open is true", () => {
    render(
      <CourtDetailsModal
        open={true}
        onClose={vi.fn()}
        scheduleData={mockScheduleData}
      />
    );

    expect(screen.getByText("Court Schedule Details")).toBeInTheDocument();
    expect(screen.getAllByText(/published/i).length).toBeGreaterThan(0);
    expect(screen.getByText("60 min")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("6")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();

    expect(screen.getByText("Available Time Ranges")).toBeInTheDocument();
    expect(screen.getByText("May 08, 2026")).toBeInTheDocument();
    expect(screen.getByText("08:00 AM")).toBeInTheDocument();
    expect(screen.getByText("06:00 PM")).toBeInTheDocument();
  });

  it("renders loading skeleton when isLoading is true", () => {
    render(
      <CourtDetailsModal open={true} onClose={vi.fn()} isLoading={true} />
    );

    expect(screen.getByText("Court Schedule Details")).toBeInTheDocument();
    expect(document.querySelector(".ant-skeleton")).toBeInTheDocument();
  });

  it("renders empty message when no scheduleData is provided", () => {
    render(
      <CourtDetailsModal
        open={true}
        onClose={vi.fn()}
        scheduleData={null}
        isLoading={false}
      />
    );

    expect(screen.getByText("No schedule data available.")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = vi.fn();
    render(
      <CourtDetailsModal
        open={true}
        onClose={handleClose}
        scheduleData={mockScheduleData}
      />
    );

    const closeBtn = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});
