import { describe, expect, it } from "vitest";
import {
  buildAiPrompt,
  normalizeAiMessage,
} from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiChat";
import { buildAiChartConfig } from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiChart";

describe("AI prompt and response normalization", () => {
  it("does not replace a long selected name with a shorter selected name", () => {
    const text =
      "Compare @Alex Smith (ID: 14) and @Alex (ID: 28) across all my camps.";
    expect(
      buildAiPrompt(text, [
        { name: "Alex", id: 28 },
        { name: "Alex Smith", id: 14 },
      ]),
    ).toBe(text);
  });
  it("formats the supplied comparison example without duplicate context", () => {
    const text =
      "Compare @Referee Name (ID: 9) and @Referee Name (ID: 41) across all my camps. Show a detailed score breakdown.";
    expect(
      buildAiPrompt(text, [
        { name: "Referee Name", id: 9 },
        { name: "Referee Name", id: 41 },
      ]),
    ).toBe(text);
  });
  it("adds IDs to literal names containing regex symbols or Unicode", () => {
    expect(
      buildAiPrompt(
        "Compare @José (Senior)+ and @Alex.",
        [
          { name: "José (Senior)+", id: 14 },
          { name: "Alex", id: 28 },
        ],
        { name: "Elite Summer Camp", id: 3 },
      ),
    ).toBe(
      "Compare @José (Senior)+ (ID: 14) and @Alex (ID: 28).\n\nUse @Elite Summer Camp (ID: 3) as the camp scope.",
    );
  });
  it("uses the selected camp instead of conflicting all-camp context", () => {
    expect(
      buildAiPrompt(
        "Compare @Greg (Evaluator ID: 7) across all my camps.",
        [{ name: "Greg", id: 7, role: "evaluator" }],
        { name: "Camp", id: 0 },
      ),
    ).toBe("Compare @Greg (ID: 7) for @Camp (ID: 0).");
  });
  it("preserves widget payloads and marks loaded history as non-animated", () => {
    const message = normalizeAiMessage({
      id: 14,
      role: "assistant",
      content: "API result",
      widget_payload: '{"rows":[[0,null]]}',
    });
    expect(message.widget_payload).toEqual({ rows: [[0, null]] });
    expect(message.animate).toBe(false);
  });
});
describe("API chart configurations", () => {
  it.each([
    "line",
    "bar",
    "pie",
    "doughnut",
    "radar",
    "scatter",
    "bubble",
    "polarArea",
    "area",
    "horizontal_bar",
    "stacked_bar",
  ])("supports %s charts using API data", (type) => {
    const config = buildAiChartConfig(
      {
        chart_type: type,
        labels: ["Accuracy"],
        datasets: [{ label: "Official", data: [0] }],
        y_axis: { min: 0, max: 10, title: "Score" },
      },
      true,
    );
    expect(config.data.datasets[0].data).toEqual([0]);
    expect(config.options.animation).toBe(false);
  });
  it("preserves numeric zeros and missing values without inventing a score", () => {
    const config = buildAiChartConfig({
      chart_type: "line",
      datasets: [{ data: [0, null, "", "6.83"] }],
      y_axis: { min: 0, max: 10 },
    });
    expect(config.data.datasets[0].data).toEqual([0, null, null, 6.83]);
    expect(config.options.scales.y).toMatchObject({ min: 0, max: 10 });
  });
  it("leaves unsupported charts for the raw-data renderer", () =>
    expect(
      buildAiChartConfig({ chart_type: "heatmap", datasets: [{ data: [7] }] }),
    ).toBeNull());
});
