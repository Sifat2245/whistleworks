import { useState } from "react";
import { FiDownload, FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import { exportAiResponseToFile } from "../data/aiAssistantData";
import RefereeHistoryCard from "./cards/RefereeHistoryCard";
import RefereeComparisonCard from "./cards/RefereeComparisonCard";
import TopPerformersTable from "./cards/TopPerformersTable";
import EvaluatorReportCard from "./cards/EvaluatorReportCard";
import CampMetricsCard from "./cards/CampMetricsCard";

const AiChatMessageItem = ({ message }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.sender === "user";

  const handleCopy = async () => {
    try {
      let copyText = message.text || "";
      if (message.verdict) copyText += `\n\nRecommendation: ${message.verdict}`;

      await navigator.clipboard.writeText(copyText);
      setIsCopied(true);
      toast.success("Response copied to clipboard!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy response");
    }
  };

  const handleExport = () => {
    try {
      const filename = exportAiResponseToFile(message);
      toast.success(`Report downloaded: ${filename}`);
    } catch {
      toast.error("Failed to export report");
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end w-full">
        <div className="bg-white border border-slate-200/90 shadow-2xs text-slate-900 rounded-3xl px-4.5 py-2.5 text-sm max-w-[85%] sm:max-w-[75%] leading-relaxed">
          <p className="whitespace-pre-line">{message.text}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 w-full max-w-full text-slate-800 text-sm leading-relaxed">
      {/* Response Text */}
      <p className="whitespace-pre-line text-slate-900 font-normal leading-relaxed">
        {message.text}
      </p>

      {/* Embedded Structured Cards */}
      {message.type === "referee-history" && (
        <RefereeHistoryCard referee={message.referee} />
      )}

      {message.type === "comparison" && (
        <RefereeComparisonCard
          title={message.title}
          refA={message.refA}
          refB={message.refB}
          verdict={message.verdict}
        />
      )}

      {message.type === "top-performers" && (
        <TopPerformersTable list={message.list} />
      )}

      {message.type === "evaluator-report" && (
        <EvaluatorReportCard evaluators={message.evaluators} />
      )}

      {message.type === "camp-metrics" && (
        <CampMetricsCard metrics={message.metrics} />
      )}

      {/* Minimal Action Bar */}
      <div className="flex items-center gap-3 pt-1 text-slate-400">
        <button
          type="button"
          onClick={handleCopy}
          title="Copy response"
          aria-label="Copy response"
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs"
        >
          {isCopied ? (
            <>
              <FiCheck className="size-3.5 text-emerald-600" />
              <span className="text-emerald-700 text-[11px] font-medium">Copied</span>
            </>
          ) : (
            <FiCopy className="size-3.5" />
          )}
        </button>

        <button
          type="button"
          onClick={handleExport}
          title="Export report"
          aria-label="Export report"
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs"
        >
          <FiDownload className="size-3.5" />
          <span className="text-[11px] font-medium hidden sm:inline">Export Report</span>
        </button>

        {message.scope && (
          <span className="text-[11px] text-slate-400 ml-auto">
            {message.scope}
          </span>
        )}
      </div>
    </div>
  );
};

export default AiChatMessageItem;
