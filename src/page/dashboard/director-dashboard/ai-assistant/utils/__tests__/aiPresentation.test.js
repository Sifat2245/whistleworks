import { describe, expect, it } from "vitest";
import {
  aiResponseText,
  downloadPreview,
  getAiTableData,
  safeAiUrl,
  widgetToMarkdown,
} from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiPresentation";

describe("Readable AI response data", () => {
  it("exports a spreadsheet link, metadata and preview without JSON", () => {
    const text = widgetToMarkdown({
      type: "excel_download",
      title: "Camp rankings",
      filename: "rankings.xlsx",
      download_url: "https://example.com/rankings.xlsx",
      file_size: "7.8 KB",
      total_ranked_referees: 1,
      camps_included: ["Actual Camp"],
      preview_headers: ["Referee", "Avg Score"],
      preview_rows: [{ name: "API Official", score: "9.83" }],
    });
    expect(text).toContain(
      "[rankings.xlsx](https://example.com/rankings.xlsx)",
    );
    expect(text).toContain("**Camps included:** Actual Camp");
    expect(text).toContain("**Total ranked referees:** 1");
    expect(text).toContain("| API Official | 9.83 |");
    expect(text).not.toContain('"preview_rows"');
  });
  it("preserves direct preview keys and derives headers if none were provided", () => {
    expect(
      downloadPreview({
        preview_headers: ["Referee"],
        preview_rows: [{ referee: "Actual name", name: "Different field" }],
      }).columns[0].key,
    ).toBe("referee");
    const preview = getAiTableData(
      downloadPreview({ preview_rows: [{ name: "Official", avg_score: 0 }] }),
    );
    expect(preview.columns).toEqual([
      { key: "name", label: "Name" },
      { key: "avg_score", label: "Avg score" },
    ]);
  });
  it("copies widget-only responses as readable labels and preserves zero/false values", () => {
    expect(
      aiResponseText(
        {
          widget_type: "custom",
          widget_payload: { games_played: 0, checked_in: false },
        },
        false,
      ),
    ).toBe("- **Games played:** 0\n- **Checked in:** No");
  });
  it("exports Markdown tables and nested values without losing the original response text", () => {
    const text = aiResponseText({
      content: "Actual response",
      widget_type: "table",
      widget_payload: { rows: [{ name: "Actual name", detail: { score: 0 } }] },
    });
    expect(text).toContain("Actual response");
    expect(text).toContain("| Actual name | Score: 0 |");
    expect(text).not.toContain('{"score"');
  });
  it("formats JSON embedded in response text for copy/export", () => {
    expect(
      aiResponseText({
        content: 'Summary\n\n```json\n{"total_games":12}\n```',
      }),
    ).toBe("Summary\n\n- **Total games:** 12");
  });
  it("does not create a download URL from an arbitrary string", () => {
    expect(safeAiUrl("not a URL")).toBeNull();
    expect(safeAiUrl("/storage/report.xlsx")).toBe(
      new URL("/storage/report.xlsx", window.location.origin).href,
    );
  });
});
