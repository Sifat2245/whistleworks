import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  buildAiChartConfig,
  chartDataTable,
} from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiChart";
import AiTableWidgetCard from "@/page/dashboard/director-dashboard/ai-assistant/components/cards/AiTableWidgetCard";
import AiStructuredDataView from "@/page/dashboard/director-dashboard/ai-assistant/components/AiStructuredDataView";

export default function AiChartWidgetCard({ payload }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();
  const config = useMemo(
    () => buildAiChartConfig(payload, reduced),
    [payload, reduced],
  );
  const [error, setError] = useState("");
  useEffect(() => {
    if (!config) return;
    let cancelled = false;
    let chart;
    setError("");
    import("chart.js/auto")
      .then(({ default: Chart }) => {
        if (cancelled || !canvasRef.current) return;
        try {
          chart = new Chart(canvasRef.current, config);
        } catch {
          setError(
            "The chart could not be displayed. Its data is available below.",
          );
        }
      })
      .catch(() => {
        if (!cancelled)
          setError(
            "The chart could not be loaded. Its data is available below.",
          );
      });
    return () => {
      cancelled = true;
      chart?.destroy();
    };
  }, [config]);
  if (!config)
    return (
      <AiStructuredDataView
        value={payload}
        title={payload.title || "Chart data"}
      />
    );
  const title = payload.title || "Chart";
  return (
    <figure className="border border-slate-200 rounded-2xl bg-white p-3 sm:p-5 my-3">
      <figcaption className="font-semibold text-sm text-slate-800 mb-4">
        {title}
      </figcaption>
      {error && (
        <p role="status" className="text-xs text-slate-500 mb-3">
          {error}
        </p>
      )}
      <div className="relative h-72 sm:h-80">
        <canvas ref={canvasRef} role="img" aria-label={title} />
      </div>
      <details className="mt-3 text-xs text-slate-500" open={Boolean(error)}>
        <summary className="cursor-pointer py-2">View chart data</summary>
        <AiTableWidgetCard payload={chartDataTable(config)} />
      </details>
    </figure>
  );
}
