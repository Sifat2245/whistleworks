import { useState, useRef, useEffect } from "react";
import {
  FiZap,
  FiX,
  FiAlertCircle,
  FiRefreshCw,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useGetAiQuota } from "@/hooks/api/director-hooks/useAiChat";

const formatResetDate = (isoString) => {
  if (!isoString) return "End of month";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return isoString;
  }
};

const getDaysUntilReset = (isoString) => {
  if (!isoString) return null;
  try {
    const target = new Date(isoString);
    const now = new Date();
    const diffMs = target - now;
    if (diffMs <= 0) return "Today";
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${diffDays} days left`;
  } catch {
    return null;
  }
};

const AiQuotaCircle = ({ quota: propQuota }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const {
    quota: queryQuota,
    refetch,
  } = useGetAiQuota();

  const quota = propQuota || queryQuota;

  const planTier = quota?.plan_tier || "free";
  const monthlyLimit = Number(quota?.monthly_query_limit ?? 50);
  const queriesUsed = Number(quota?.queries_used_this_month ?? 0);
  const remainingQueries = Number(
    quota?.remaining_queries ?? Math.max(monthlyLimit - queriesUsed, 0)
  );
  const tokensUsed = Number(quota?.tokens_used_this_month ?? 0);
  const resetsAt = quota?.quota_resets_at;
  const isBlocked = Boolean(quota?.is_blocked || remainingQueries <= 0);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Percentage calculations
  const remainingPercent =
    monthlyLimit > 0
      ? Math.min(Math.max((remainingQueries / monthlyLimit) * 100, 0), 100)
      : 0;

  const usedPercent =
    monthlyLimit > 0
      ? Math.min(Math.max((queriesUsed / monthlyLimit) * 100, 0), 100)
      : 0;

  // SVG circular ring geometry (viewBox 0 0 36 36, r = 14)
  const radius = 14;
  const circumference = 2 * Math.PI * radius; // ~87.964
  const strokeDashoffset =
    circumference - (remainingPercent / 100) * circumference;

  // Visual status color styling
  const isWarning = !isBlocked && remainingPercent <= 20;

  const strokeColorClass = isBlocked
    ? "stroke-rose-500"
    : isWarning
    ? "stroke-amber-500"
    : "stroke-primary";

  const textColorClass = isBlocked
    ? "text-rose-600"
    : isWarning
    ? "text-amber-600"
    : "text-slate-700";

  const progressBarColor = isBlocked
    ? "bg-rose-500"
    : isWarning
    ? "bg-amber-500"
    : "bg-primary";

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      {/* ── Circular Progress Trigger Button ────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "relative size-7 sm:size-8 md:size-9 rounded-full flex items-center justify-center shrink-0 cursor-pointer transition-all",
          "bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:shadow-xs",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
          isOpen && "ring-2 ring-primary/30 border-primary"
        )}
        title={`AI Quota: ${remainingQueries} of ${monthlyLimit} queries remaining (${planTier} tier). Click to view details.`}
        aria-label="AI Quota Details"
        aria-expanded={isOpen}
      >
        <svg
          className="absolute inset-0 size-full -rotate-90 pointer-events-none"
          viewBox="0 0 36 36"
        >
          {/* Background track */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            className="stroke-slate-100"
            strokeWidth="3"
          />
          {/* Foreground progress ring */}
          <circle
            cx="18"
            cy="18"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn(
              "transition-all duration-500 ease-out",
              strokeColorClass
            )}
          />
        </svg>

        {/* Center icon */}
        <FiZap
          className={cn(
            "size-2.5 sm:size-3 transition-colors z-10",
            textColorClass
          )}
        />
      </button>

      {/* ── Quota Details Dropdown Popover ──────────────────────── */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="AI Quota Details"
          className="absolute bottom-full right-0 mb-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-3.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="size-6 sm:size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <FiZap className="size-3.5 sm:size-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                  AI Prompt Quota
                </h4>
                <p className="text-[10px] text-slate-400">Monthly Usage</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200/60">
                {planTier} Tier
              </span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="size-6 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close quota popup"
              >
                <FiX className="size-3.5" />
              </button>
            </div>
          </div>

          {/* Blocked / Limit Exceeded Alert */}
          {isBlocked && (
            <div className="mt-2.5 p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] flex items-center gap-2">
              <FiAlertCircle className="size-4 shrink-0 text-rose-600" />
              <span>
                Monthly quota limit reached. Resets on{" "}
                {formatResetDate(resetsAt)}.
              </span>
            </div>
          )}

          {/* Usage Progress Bar */}
          <div className="mt-3 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 text-[11px] font-medium">
                Monthly Usage
              </span>
              <span className="font-bold text-slate-900 text-[11px]">
                {queriesUsed}{" "}
                <span className="text-slate-400 font-normal">
                  / {monthlyLimit} prompts
                </span>
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  progressBarColor
                )}
                style={{ width: `${Math.min(usedPercent, 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
              <span>{Math.round(usedPercent)}% used</span>
              <span>{remainingQueries} remaining</span>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mt-3 grid grid-cols-2 gap-2">
            {/* Remaining Queries */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Remaining
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900 leading-none">
                  {remainingQueries}
                </span>
                <span className="text-[10px] text-slate-500">prompts</span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Available now
              </span>
            </div>

            {/* Queries Used */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Used This Month
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-lg font-bold text-slate-900 leading-none">
                  {queriesUsed}
                </span>
                <span className="text-[10px] text-slate-500">
                  / {monthlyLimit}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Current month
              </span>
            </div>

            {/* Tokens Used */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Tokens Used
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-900 leading-none">
                  {tokensUsed.toLocaleString()}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">
                Total tokens
              </span>
            </div>

            {/* Quota Resets At */}
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Resets On
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-xs font-bold text-slate-900 leading-tight">
                  {formatResetDate(resetsAt)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5">
                {getDaysUntilReset(resetsAt) || "Next reset"}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span className="truncate pr-2">1 query deducted per prompt</span>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-1 text-slate-500 hover:text-primary transition-colors cursor-pointer shrink-0 font-medium"
              title="Refresh Quota"
              aria-label="Refresh quota"
            >
              <FiRefreshCw className="size-2.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AiQuotaCircle;
