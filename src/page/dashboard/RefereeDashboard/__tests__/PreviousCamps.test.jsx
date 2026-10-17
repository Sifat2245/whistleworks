import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PreviousCamps from "../PreviousCamps";
import { useAuth } from "@/hooks/useAuth";
import { useEvaluatorPreviousCamps } from "@/hooks/api/evaluator-hooks/useEvaluatorCamps";
import { useRefereePreviousCamps } from "@/hooks/api/referee-hooks/useRefereeCamps";

vi.mock("@/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/hooks/api/evaluator-hooks/useEvaluatorCamps", () => ({
  useEvaluatorPreviousCamps: vi.fn(),
}));

vi.mock("@/hooks/api/referee-hooks/useRefereeCamps", () => ({
  useRefereePreviousCamps: vi.fn(),
}));

vi.mock("@/components/shared/CampCard", () => ({
  default: ({ camp }) => (
    <div data-testid="camp-card">
      <span>{camp?.camp_name}</span>
    </div>
  ),
}));

describe("PreviousCamps Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("enables referee query and disables evaluator query when user is a referee", () => {
    useAuth.mockReturnValue({
      userData: { id: 1, role: "referee", name: "John Referee" },
    });

    useRefereePreviousCamps.mockReturnValue({
      previousCamps: [
        {
          camp: { id: 101, name: "Referee Summer Camp", location: "Dallas, TX" },
          registration_status: "completed",
        },
      ],
      pagination: { total: 1, last_page: 1, current_page: 1, per_page: 12 },
      isLoading: false,
      isError: false,
    });

    useEvaluatorPreviousCamps.mockReturnValue({
      registrations: [],
      pagination: { total: 0 },
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter>
        <PreviousCamps />
      </MemoryRouter>
    );

    // Verify hooks received correct enabled options
    expect(useRefereePreviousCamps).toHaveBeenCalledWith(1, { enabled: true });
    expect(useEvaluatorPreviousCamps).toHaveBeenCalledWith(1, { enabled: false });

    expect(screen.getByText("Referee Summer Camp")).toBeInTheDocument();
  });

  it("enables evaluator query and disables referee query when user is an evaluator", () => {
    useAuth.mockReturnValue({
      userData: { id: 2, role: "evaluator", name: "Jane Evaluator" },
    });

    useEvaluatorPreviousCamps.mockReturnValue({
      registrations: [
        {
          camp: { id: 202, camp_name: "Evaluator Pro Camp", location: "Chicago, IL" },
          status: "completed",
        },
      ],
      pagination: { total: 1, last_page: 1, current_page: 1, per_page: 12 },
      isLoading: false,
      isError: false,
    });

    useRefereePreviousCamps.mockReturnValue({
      previousCamps: [],
      pagination: { total: 0 },
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter>
        <PreviousCamps />
      </MemoryRouter>
    );

    // Verify hooks received correct enabled options
    expect(useEvaluatorPreviousCamps).toHaveBeenCalledWith(1, { enabled: true });
    expect(useRefereePreviousCamps).toHaveBeenCalledWith(1, { enabled: false });

    expect(screen.getByText("Evaluator Pro Camp")).toBeInTheDocument();
  });

  it("shows empty state when no camps are returned", () => {
    useAuth.mockReturnValue({
      userData: { id: 1, role: "referee" },
    });

    useRefereePreviousCamps.mockReturnValue({
      previousCamps: [],
      pagination: { total: 0, last_page: 1 },
      isLoading: false,
      isError: false,
    });

    useEvaluatorPreviousCamps.mockReturnValue({
      registrations: [],
      pagination: { total: 0 },
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter>
        <PreviousCamps />
      </MemoryRouter>
    );

    expect(screen.getByText("No previous camps found.")).toBeInTheDocument();
  });
});
