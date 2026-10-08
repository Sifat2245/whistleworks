import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ScheduleAddModal from "../ScheduleAddModal";

vi.mock("../RefereeAssignModal", () => ({
  default: () => <div data-testid="referee-assign-modal">Referee Assign Modal</div>,
}));

vi.mock("../CrewAssignModal", () => ({
  default: () => <div data-testid="crew-assign-modal">Crew Assign Modal</div>,
}));

describe("ScheduleAddModal Component", () => {
  it("renders RefereeAssignModal when assignmentType is individual", () => {
    render(
      <ScheduleAddModal
        isModalOpen={true}
        assignmentType="individual"
        handleCloseModal={vi.fn()}
      />
    );

    expect(screen.getByTestId("referee-assign-modal")).toBeInTheDocument();
    expect(screen.queryByTestId("crew-assign-modal")).not.toBeInTheDocument();
  });

  it("renders CrewAssignModal when assignmentType is crew", () => {
    render(
      <ScheduleAddModal
        isModalOpen={true}
        assignmentType="crew"
        handleCloseModal={vi.fn()}
      />
    );

    expect(screen.getByTestId("crew-assign-modal")).toBeInTheDocument();
    expect(screen.queryByTestId("referee-assign-modal")).not.toBeInTheDocument();
  });

  it("renders CrewAssignModal when assignmentType is crews", () => {
    render(
      <ScheduleAddModal
        isModalOpen={true}
        assignmentType="crews"
        handleCloseModal={vi.fn()}
      />
    );

    expect(screen.getByTestId("crew-assign-modal")).toBeInTheDocument();
  });
});
