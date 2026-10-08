import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Swal from "sweetalert2";
import ScheduleActionButtons from "../ScheduleActionButtons";

const mockMutatePublish = vi.fn();
const mockMutateClear = vi.fn();
const mockMutateDelete = vi.fn();
const mockMutateAutoAssign = vi.fn();

vi.mock("@/hooks/useCampSchedule", () => ({
  default: () => ({
    scheduleData: { id: 77 },
  }),
}));

vi.mock("@/hooks/api/director-hooks/useBuildSchedule", () => ({
  usePublishSchedule: () => ({
    mutate: mockMutatePublish,
    isPending: false,
  }),
  useClearSchedule: () => ({
    mutate: mockMutateClear,
    isPending: false,
  }),
  useDeleteSchedule: () => ({
    mutate: mockMutateDelete,
    isPending: false,
  }),
}));

vi.mock("@/hooks/api/director-hooks/useGameAssingments", () => ({
  useAutoAssign: () => ({
    mutate: mockMutateAutoAssign,
    isPending: false,
  }),
}));

describe("ScheduleActionButtons Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all four action buttons", () => {
    render(
      <MemoryRouter>
        <ScheduleActionButtons campId={12} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", { name: /publish schedule/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /auto-assign referees/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /delete schedule/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /clear schedule/i })
    ).toBeInTheDocument();
  });

  it("shows and hides tooltip on auto-assign button hover", () => {
    render(
      <MemoryRouter>
        <ScheduleActionButtons campId={12} />
      </MemoryRouter>
    );

    const autoAssignContainer = screen
      .getByRole("button", { name: /auto-assign referees/i })
      .closest(".relative");

    expect(screen.queryByText("Auto Assign Rules")).not.toBeInTheDocument();

    fireEvent.mouseEnter(autoAssignContainer);
    expect(screen.getByText("Auto Assign Rules")).toBeInTheDocument();
    expect(screen.getByText(/MINIMUM of 1 game rest/i)).toBeInTheDocument();

    fireEvent.mouseLeave(autoAssignContainer);
    expect(screen.queryByText("Auto Assign Rules")).not.toBeInTheDocument();
  });

  it("opens confirmation dialog and triggers publish mutation on confirm", async () => {
    vi.spyOn(Swal, "fire").mockResolvedValueOnce({ isConfirmed: true });

    render(
      <MemoryRouter>
        <ScheduleActionButtons campId={12} />
      </MemoryRouter>
    );

    const publishBtn = screen.getByRole("button", {
      name: /publish schedule/i,
    });
    fireEvent.click(publishBtn);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Publish Schedule?",
      })
    );
    await waitFor(() => {
      expect(mockMutatePublish).toHaveBeenCalled();
    });
  });

  it("opens confirmation dialog and triggers auto-assign mutation on confirm", async () => {
    vi.spyOn(Swal, "fire").mockResolvedValueOnce({ isConfirmed: true });

    render(
      <MemoryRouter>
        <ScheduleActionButtons campId={12} />
      </MemoryRouter>
    );

    const autoAssignBtn = screen.getByRole("button", {
      name: /auto-assign referees/i,
    });
    fireEvent.click(autoAssignBtn);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Auto-Assign Referees?",
      })
    );
    await waitFor(() => {
      expect(mockMutateAutoAssign).toHaveBeenCalled();
    });
  });

  it("opens confirmation dialog and triggers delete mutation on confirm", async () => {
    vi.spyOn(Swal, "fire").mockResolvedValueOnce({ isConfirmed: true });

    render(
      <MemoryRouter>
        <ScheduleActionButtons campId={12} />
      </MemoryRouter>
    );

    const deleteBtn = screen.getByRole("button", {
      name: /delete schedule/i,
    });
    fireEvent.click(deleteBtn);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Delete Schedule?",
      })
    );
    await waitFor(() => {
      expect(mockMutateDelete).toHaveBeenCalled();
    });
  });

  it("opens confirmation dialog and triggers clear mutation on confirm", async () => {
    vi.spyOn(Swal, "fire").mockResolvedValueOnce({ isConfirmed: true });

    render(
      <MemoryRouter>
        <ScheduleActionButtons campId={12} />
      </MemoryRouter>
    );

    const clearBtn = screen.getByRole("button", {
      name: /clear schedule/i,
    });
    fireEvent.click(clearBtn);

    expect(Swal.fire).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Clear Schedule?",
      })
    );
    await waitFor(() => {
      expect(mockMutateClear).toHaveBeenCalledWith(77);
    });
  });
});
