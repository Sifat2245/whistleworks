import { parseWidgetPayload } from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiChat";

export const formatSessionTitle = (title) =>
  typeof title === "string" && title.trim()
    ? title.replace(/\s+/g, " ").trim()
    : "Conversation";

export const humanizeKey = (key) => {
  const text = String(key ?? "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .trim();
  return text.replace(/^./, (letter) => letter.toUpperCase());
};

export const safeAiUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return null;
  if (!/^(?:https?:\/\/|\/)/i.test(value.trim())) return null;
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
};

export const normalizedKey = (key) =>
  String(key)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

export function getAiTableData(payload) {
  const rows = Array.isArray(payload.rows)
    ? payload.rows
    : Array.isArray(payload.data)
      ? payload.data
      : [];
  const provided = Array.isArray(payload.headers)
    ? payload.headers
    : Array.isArray(payload.columns)
      ? payload.columns
      : [];
  let columns = provided.map((header) =>
    typeof header === "object" && header
      ? {
          key:
            header.key ??
            header.dataIndex ??
            header.field ??
            header.label ??
            header.title,
          label: header.label ?? header.title ?? header.key ?? header.field,
        }
      : { key: header, label: header },
  );
  if (!columns.length) {
    const keys = [
      ...new Set(
        rows.flatMap((row) =>
          row && !Array.isArray(row) && typeof row === "object"
            ? Object.keys(row)
            : [],
        ),
      ),
    ];
    columns = keys.length
      ? keys.map((key) => ({ key, label: humanizeKey(key) }))
      : Array.from(
          {
            length: Math.max(
              0,
              ...rows.map((row) => (Array.isArray(row) ? row.length : 1)),
            ),
          },
          (_, i) => ({ key: i, label: `Column ${i + 1}` }),
        );
  }
  return { rows, columns };
}

export function aiTableCell(row, column, index) {
  if (Array.isArray(row)) return row[index];
  if (row && typeof row === "object") {
    const key = Object.keys(row).find(
      (key) => normalizedKey(key) === normalizedKey(column.key),
    );
    return key !== undefined ? row[key] : null;
  }
  return index === 0 ? row : null;
}

// The export API's display headers differ from its row keys. Match this schema explicitly.
export function downloadPreview(payload) {
  const aliases = {
    rank: "rank",
    camp: "camp",
    referee: "name",
    avgscore: "score",
    evals: "evals",
  };
  return {
    title: "Spreadsheet preview",
    rows: payload.preview_rows,
    columns: Array.isArray(payload.preview_headers)
      ? payload.preview_headers.map((label) => {
          if (label && typeof label === "object") return label;
          const directKey = payload.preview_rows
            ?.flatMap((row) =>
              row && typeof row === "object" ? Object.keys(row) : [],
            )
            .find((key) => normalizedKey(key) === normalizedKey(label));
          return {
            label,
            key: directKey || aliases[normalizedKey(label)] || label,
          };
        })
      : [],
  };
}

export function readableAiValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map(readableAiValue).join("; ");
  if (typeof value === "object")
    return Object.entries(value)
      .map(([key, item]) => `${humanizeKey(key)}: ${readableAiValue(item)}`)
      .join("; ");
  return String(value);
}

const markdownCell = (value) =>
  readableAiValue(value).replace(/\|/g, "\\|").replace(/\r?\n/g, "<br>");
const tableMarkdown = (payload) => {
  const { rows, columns } = getAiTableData(payload);
  if (!columns.length) return "No data returned.";
  return [
    `| ${columns.map((column) => markdownCell(column.label)).join(" | ")} |`,
    `| ${columns.map(() => "---").join(" | ")} |`,
    ...rows.map(
      (row) =>
        `| ${columns.map((column, index) => markdownCell(aiTableCell(row, column, index))).join(" | ")} |`,
    ),
  ].join("\n");
};

export function widgetToMarkdown(payload, type) {
  const value = parseWidgetPayload(payload);
  if (value === null || value === undefined) return "";
  const widgets = Array.isArray(value.widgets) ? value.widgets : null;
  if (widgets)
    return widgets
      .map((widget) =>
        widgetToMarkdown(
          widget.widget_payload ?? widget.payload ?? widget,
          widget.widget_type || widget.type,
        ),
      )
      .join("\n\n");
  if (
    Array.isArray(value) &&
    value.every((item) => item?.type || item?.widget_type)
  )
    return value
      .map((widget) =>
        widgetToMarkdown(
          widget.widget_payload ?? widget.payload ?? widget,
          widget.widget_type || widget.type,
        ),
      )
      .join("\n\n");
  if (typeof value !== "object") return readableAiValue(value);
  const heading = value.title ? `### ${value.title}\n\n` : "";
  if (value.download_url) {
    const url = safeAiUrl(value.download_url);
    const label = value.filename || value.title || "Download file";
    const preview = Array.isArray(value.preview_rows)
      ? `\n\n${tableMarkdown(downloadPreview(value))}`
      : "";
    const metadata = Object.entries(value)
      .filter(
        ([key]) =>
          ![
            "type",
            "title",
            "download_url",
            "filename",
            "file_size",
            "preview_headers",
            "preview_rows",
          ].includes(key),
      )
      .map(
        ([key, item]) => `- **${humanizeKey(key)}:** ${readableAiValue(item)}`,
      )
      .join("\n");
    return `${heading}${url ? `[${label}](${url})` : label}${value.file_size ? ` (${value.file_size})` : ""}${metadata ? `\n\n${metadata}` : ""}${preview}`;
  }
  if (type === "table" || value.type === "table" || Array.isArray(value.rows))
    return heading + tableMarkdown(value);
  if (
    Array.isArray(value) &&
    value.every(
      (item) => item && typeof item === "object" && !Array.isArray(item),
    )
  )
    return tableMarkdown({ rows: value });
  return (
    heading +
    (Array.isArray(value)
      ? value.map((item) => `- ${readableAiValue(item)}`).join("\n")
      : Object.entries(value)
          .filter(([key]) => key !== "title")
          .map(
            ([key, item]) =>
              `- **${humanizeKey(key)}:** ${readableAiValue(item)}`,
          )
          .join("\n"))
  );
}

function readableAiContent(content) {
  const parsed = parseWidgetPayload(content);
  if (parsed && typeof parsed === "object") return widgetToMarkdown(parsed);
  return content.replace(/```(?:json)?\s*\n([\s\S]*?)```/g, (block, text) => {
    const value = parseWidgetPayload(text.trim());
    return value && typeof value === "object" ? widgetToMarkdown(value) : block;
  });
}

export const aiResponseText = (message, includeWidget = true) =>
  [
    readableAiContent(message.content || message.text || ""),
    includeWidget || !(message.content || message.text)
      ? widgetToMarkdown(message.widget_payload, message.widget_type)
      : "",
  ]
    .filter(Boolean)
    .join("\n\n");
