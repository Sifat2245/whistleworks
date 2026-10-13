import { FiTable } from "react-icons/fi";
import { cn } from "@/lib/utils";
import {
  aiTableCell,
  getAiTableData,
  readableAiValue,
} from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiPresentation";
import AiStructuredValue from "@/page/dashboard/director-dashboard/ai-assistant/components/AiStructuredValue";

function Cell({ value, column }) {
  if (value && typeof value === "object")
    return <AiStructuredValue value={value} />;
  const text = readableAiValue(value);
  if (!String(column).toLowerCase().includes("status") || text === "—")
    return text;
  const state = text.toLowerCase().replace(/[\s-]/g, "_");
  const success = [
    "checked_in",
    "active",
    "confirmed",
    "paid",
    "approved",
  ].includes(state);
  const pending = ["pending", "registered", "processing"].includes(state);
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 rounded-full text-[11px] border capitalize",
        success
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : pending
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-slate-100 text-slate-700 border-slate-200",
      )}
    >
      {text.replace(/_/g, " ")}
    </span>
  );
}
export default function AiTableWidgetCard({ payload }) {
  if (!payload || typeof payload !== "object") return null;
  const { rows, columns } = getAiTableData(payload);
  if (!columns.length && !rows.length)
    return (
      <p className="text-xs text-slate-500">
        {payload.title || "Table"}: no data returned.
      </p>
    );
  return (
    <div className="my-3 bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
        <FiTable className="text-primary" aria-hidden="true" />
        <span className="text-xs font-semibold">
          {payload.title || "Data table"}
        </span>
        <span className="ml-auto text-[11px] text-slate-500">
          {rows.length} {rows.length === 1 ? "entry" : "entries"}
        </span>
      </div>
      <div className="overflow-auto max-h-[480px]">
        <table className="w-full text-left text-xs">
          <caption className="sr-only">{payload.title || "Data table"}</caption>
          <thead className="bg-slate-100 text-slate-600 sticky top-0">
            <tr>
              {columns.map((column, index) => (
                <th scope="col" key={index} className="p-3 whitespace-nowrap">
                  {readableAiValue(column.label)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                {columns.map((column, columnIndex) => {
                  const value = aiTableCell(row, column, columnIndex);
                  return (
                    <td
                      key={columnIndex}
                      className="p-3 text-slate-700 align-top"
                    >
                      <Cell value={value} column={column.label} />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
