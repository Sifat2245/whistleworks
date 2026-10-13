import { act, render, renderHook, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AiWidgetRenderer from "@/page/dashboard/director-dashboard/ai-assistant/components/AiWidgetRenderer";
import AiMarkdownContent from "@/page/dashboard/director-dashboard/ai-assistant/components/AiMarkdownContent";
import useTypedResponse from "@/page/dashboard/director-dashboard/ai-assistant/hooks/useTypedResponse";
const reduced = vi.hoisted(() => vi.fn(() => false));
vi.mock("framer-motion", async (original) => ({
  ...(await original()),
  useReducedMotion: reduced,
}));
beforeEach(() => reduced.mockReturnValue(false));
afterEach(() => vi.useRealTimers());
describe("AI response presentation", () => {
  it("keeps malformed widget payloads readable instead of hiding them", () => {
    render(
      <AiWidgetRenderer type="table" payload="Not JSON: a backend payload" />,
    );
    expect(screen.getByText("Not JSON: a backend payload")).toBeInTheDocument();
  });
  it("animates a fresh reply, supports skipping, and does not retype history", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useTypedResponse("A response with emoji 🏀 and results.", true),
    );
    expect(result.current.text).toBe("");
    act(() => vi.advanceTimersByTime(240));
    expect(result.current.text.length).toBeGreaterThan(0);
    expect(result.current.typing).toBe(true);
    act(() => result.current.finish());
    expect(result.current.text).toBe("A response with emoji 🏀 and results.");
    const loaded = renderHook(() => useTypedResponse("Saved reply", false));
    expect(loaded.result.current.text).toBe("Saved reply");
    expect(loaded.result.current.typing).toBe(false);
  });
  it("finishes typing and respects reduced motion", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      useTypedResponse("A long response.", true),
    );
    act(() => vi.advanceTimersByTime(5000));
    expect(result.current.text).toBe("A long response.");
    reduced.mockReturnValue(true);
    const quiet = renderHook(() =>
      useTypedResponse("Visible immediately", true),
    );
    expect(quiet.result.current.typing).toBe(false);
    expect(quiet.result.current.text).toBe("Visible immediately");
  });
  it("renders Markdown tables/lists/code, and ignores HTML or media", () => {
    render(
      <AiMarkdownContent
        content={
          "### Scores\n\n| Name | Score |\n| --- | --- |\n| Official | **7.58** |\n\n- Feedback\n\n`code`\n\n<script>alert(1)</script>\n\n![image](https://example.com/image.png)"
        }
      />,
    );
    expect(screen.getByRole("heading", { name: "Scores" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "7.58" })).toBeInTheDocument();
    expect(screen.getByRole("listitem")).toHaveTextContent("Feedback");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(document.querySelector("script")).toBeNull();
  });
  it("renders object and array rows, nested values, and preserves inactive status", () => {
    render(
      <AiWidgetRenderer
        type="table"
        payload={{
          title: "Users",
          columns: [
            { key: "name", label: "Name" },
            { key: "status", label: "Status" },
            { key: "details", label: "Details" },
          ],
          rows: [
            { name: "API Official", status: "inactive", details: { games: 0 } },
            ["Other", "active", null],
            null,
          ],
        }}
      />,
    );
    expect(screen.getByRole("table", { name: "Users" })).toBeInTheDocument();
    expect(screen.getByText("Inactive", { exact: false })).toHaveClass(
      "bg-slate-100",
    );
    expect(screen.getByText("Games")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(document.querySelector("pre")).toBeNull();
  });
  it("handles JSON widget strings, multiple widgets, and unknown structured payloads", () => {
    render(
      <AiWidgetRenderer
        payload={JSON.stringify({
          widgets: [
            {
              type: "table",
              payload: { title: "Counts", rows: [{ count: 0 }] },
            },
            { type: "custom", payload: { actual_result: 12 } },
          ],
        })}
      />,
    );
    expect(screen.getByRole("cell", { name: "0" })).toBeInTheDocument();
    expect(screen.getByText("Actual result")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(document.querySelector("pre")).toBeNull();
  });
  it("renders the API Excel download with mapped preview headers and genuine values", () => {
    render(
      <AiWidgetRenderer
        type="excel_download"
        payload={{
          type: "excel_download",
          title: "Camp Rankings Spreadsheet (.xlsx)",
          download_url:
            "https://super-admin.whistleworks.org/storage/ai_exports/camp_rankings.xlsx",
          filename: "camp_rankings.xlsx",
          file_size: "7.8 KB",
          camps_included: ["TEST- DO NOT REGISTER"],
          total_ranked_referees: 1,
          preview_headers: ["Rank", "Camp", "Referee", "Avg Score", "Evals"],
          preview_rows: [
            {
              rank: "#1",
              camp: "TEST- DO NOT REGISTER",
              name: "Referee1 User",
              score: "9.83",
              evals: 1,
            },
          ],
        }}
      />,
    );
    const link = screen.getByRole("link", { name: "Download spreadsheet" });
    expect(link).toHaveAttribute(
      "href",
      "https://super-admin.whistleworks.org/storage/ai_exports/camp_rankings.xlsx",
    );
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByText("1 ranked referee")).toBeInTheDocument();
    expect(
      screen.getByRole("table", { name: "Spreadsheet preview" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("cell", { name: "Referee1 User" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "9.83" })).toBeInTheDocument();
    expect(document.querySelector("pre")).toBeNull();
    expect(screen.queryByText(/download_url/)).not.toBeInTheDocument();
  });
  it.each([
    "javascript:alert(1)",
    "data:text/html,unsafe",
    "file:///tmp/report.xlsx",
  ])("rejects unsafe download URL %s", (download_url) => {
    render(
      <AiWidgetRenderer
        type="excel_download"
        payload={{ title: "Report", download_url }}
      />,
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(
      "valid download link was not returned",
    );
  });
  it("formats an unfamiliar structured response as labeled values and record tables", () => {
    render(
      <AiWidgetRenderer
        type="unknown"
        payload={{
          title: "Camp insights",
          active_count: 0,
          eligible: false,
          notes: ["Needs review"],
          referees: [{ name: "Actual Official", score: 8.4 }],
        }}
      />,
    );
    expect(screen.getByText("Active count")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(screen.getByRole("table", { name: "Referees" })).toBeInTheDocument();
    expect(screen.getByText("Actual Official")).toBeInTheDocument();
    expect(document.querySelector("pre")).toBeNull();
  });
  it("formats unsupported chart types without exposing JSON", () => {
    render(
      <AiWidgetRenderer
        type="chart"
        payload={{
          title: "Heatmap",
          chart_type: "heatmap",
          values: [{ official: "Actual Official", score: 7 }],
        }}
      />,
    );
    expect(screen.getByRole("table", { name: "Values" })).toBeInTheDocument();
    expect(screen.getByText("Actual Official")).toBeInTheDocument();
    expect(document.querySelector("pre")).toBeNull();
  });
  it.each([
    '{"total_games": 12, "active": false}',
    '```json\n{"total_games": 12, "active": false}\n```',
  ])("formats JSON text and fenced JSON as readable values", (content) => {
    render(<AiMarkdownContent content={content} />);
    expect(screen.getByText("Total games")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("No")).toBeInTheDocument();
    expect(document.querySelector("pre")).toBeNull();
  });
});
