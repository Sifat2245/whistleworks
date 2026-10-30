import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import SettingsModal from "../SettingsModal";

const mockUseRankingSettings = vi.fn();
const mockMutate = vi.fn();

vi.mock("@/hooks/api/useRankings", () => ({
  useRankingSettings: (...args) => mockUseRankingSettings(...args),
  useUpdateRankingSettings: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe("SettingsModal component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when isOpen is false", () => {
    mockUseRankingSettings.mockReturnValue({ data: null });

    render(<SettingsModal isOpen={false} onClose={vi.fn()} campId={1} />);

    expect(screen.queryByText("Ranking Settings")).not.toBeInTheDocument();
  });

  it("renders all toggles including Publish Evaluations for Referees", () => {
    mockUseRankingSettings.mockReturnValue({
      data: {
        camp_id: 1,
        publish_for_evaluators: true,
        hide_evaluator_name: false,
        hide_ranking_numbers: false,
        publish_for_referees: true,
        publish_evaluations_for_referees: true,
      },
    });

    render(<SettingsModal isOpen={true} onClose={vi.fn()} campId={1} />);

    expect(screen.getByText("Ranking Settings")).toBeInTheDocument();
    expect(screen.getByText("Publish for Evaluators")).toBeInTheDocument();
    expect(screen.getByText("Hide Evaluator Name")).toBeInTheDocument();
    expect(screen.getByText("Hide Ranking Numbers")).toBeInTheDocument();
    expect(screen.getByText("Publish for Referees")).toBeInTheDocument();
    expect(screen.getByText("Publish Evaluations for Referees")).toBeInTheDocument();
    expect(screen.getByText("Show evaluations to referees")).toBeInTheDocument();

    const evalCheckbox = screen.getByRole("checkbox", {
      name: "Publish Evaluations for Referees",
    });
    expect(evalCheckbox.checked).toBe(true);
  });

  it("toggles publish_evaluations_for_referees and triggers saveSettings with boolean payload", () => {
    mockUseRankingSettings.mockReturnValue({
      data: {
        camp_id: 1,
        publish_for_evaluators: true,
        hide_evaluator_name: false,
        hide_ranking_numbers: false,
        publish_for_referees: true,
        publish_evaluations_for_referees: false,
      },
    });

    render(<SettingsModal isOpen={true} onClose={vi.fn()} campId={1} />);

    const evalCheckbox = screen.getByRole("checkbox", {
      name: "Publish Evaluations for Referees",
    });
    expect(evalCheckbox.checked).toBe(false);

    fireEvent.click(evalCheckbox);

    expect(mockMutate).toHaveBeenCalledTimes(1);
    expect(mockMutate).toHaveBeenCalledWith({
      publish_for_evaluators: 1,
      hide_evaluator_name: 0,
      hide_ranking_numbers: 0,
      publish_for_referees: 1,
      publish_evaluations_for_referees: true,
    });
  });

  it("supports legacy 1/0 values in settings data", () => {
    mockUseRankingSettings.mockReturnValue({
      data: {
        camp_id: 1,
        publish_for_evaluators: 1,
        hide_evaluator_name: 1,
        hide_ranking_numbers: 0,
        publish_for_referees: 0,
        publish_evaluations_for_referees: 1,
      },
    });

    render(<SettingsModal isOpen={true} onClose={vi.fn()} campId={1} />);

    const evalCheckbox = screen.getByRole("checkbox", {
      name: "Publish Evaluations for Referees",
    });
    expect(evalCheckbox.checked).toBe(true);

    const hideEvalNameCheckbox = screen.getByRole("checkbox", {
      name: "Hide Evaluator Name",
    });
    expect(hideEvalNameCheckbox.checked).toBe(true);
  });

  it("calls onClose when Close button or close icon is clicked", () => {
    mockUseRankingSettings.mockReturnValue({ data: null });
    const onCloseMock = vi.fn();

    render(<SettingsModal isOpen={true} onClose={onCloseMock} campId={1} />);

    const closeButton = screen.getByRole("button", { name: "Close" });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });
});

