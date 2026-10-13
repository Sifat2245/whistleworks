import { FiArrowUpRight, FiDownload, FiFileText } from "react-icons/fi";
import {
  downloadPreview,
  safeAiUrl,
} from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiPresentation";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import AiTableWidgetCard from "@/page/dashboard/director-dashboard/ai-assistant/components/cards/AiTableWidgetCard";

export default function AiDownloadWidgetCard({ payload }) {
  const url = safeAiUrl(payload.download_url);
  const isExcel =
    payload.type === "excel_download" ||
    /\.xlsx?$/i.test(payload.filename || "");
  const title = payload.title || payload.filename || "Download report";
  return (
    <section
      className="my-4 rounded-2xl border border-slate-200 bg-white overflow-hidden"
      aria-label={title}
    >
      <div className="p-4 sm:p-5 flex flex-wrap items-start gap-3">
        <span className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <FiFileText className="size-5" aria-hidden="true" />
        </span>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-slate-900 break-words">
            {title}
          </h4>
          <p className="text-xs text-slate-500 mt-1 break-all">
            {[payload.filename, payload.file_size].filter(Boolean).join(" · ")}
          </p>
        </div>
        {url && (
          <CommonSubmitBtn
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="gap-2 text-xs"
          >
            <FiDownload aria-hidden="true" />{" "}
            {isExcel ? "Download spreadsheet" : "Download file"}{" "}
            <FiArrowUpRight aria-hidden="true" />
          </CommonSubmitBtn>
        )}
      </div>
      {(payload.total_ranked_referees !== undefined ||
        Array.isArray(payload.camps_included)) && (
        <div className="px-4 sm:px-5 pb-4 flex flex-wrap gap-2 text-xs text-slate-600">
          {payload.total_ranked_referees !== undefined &&
            payload.total_ranked_referees !== null && (
              <span className="rounded-lg bg-slate-50 border border-slate-200 px-2.5 py-1.5">
                {payload.total_ranked_referees} ranked{" "}
                {Number(payload.total_ranked_referees) === 1
                  ? "referee"
                  : "referees"}
              </span>
            )}
          {Array.isArray(payload.camps_included) &&
            payload.camps_included.map((camp, index) => (
              <span
                key={index}
                className="rounded-lg bg-sky-50 border border-sky-100 text-sky-800 px-2.5 py-1.5"
              >
                {camp}
              </span>
            ))}
        </div>
      )}
      {!url && (
        <p role="status" className="px-4 pb-4 text-xs text-slate-500">
          A valid download link was not returned. Ask the assistant to generate
          the report again.
        </p>
      )}
      {Array.isArray(payload.preview_rows) && (
        <div className="px-4 sm:px-5 pb-2">
          <AiTableWidgetCard payload={downloadPreview(payload)} />
        </div>
      )}
    </section>
  );
}
