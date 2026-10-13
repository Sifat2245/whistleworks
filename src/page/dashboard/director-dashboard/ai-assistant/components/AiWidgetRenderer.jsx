import { parseWidgetPayload } from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiChat";
import AiTableWidgetCard from "@/page/dashboard/director-dashboard/ai-assistant/components/cards/AiTableWidgetCard";
import AiChartWidgetCard from "@/page/dashboard/director-dashboard/ai-assistant/components/cards/AiChartWidgetCard";
import AiDownloadWidgetCard from "@/page/dashboard/director-dashboard/ai-assistant/components/cards/AiDownloadWidgetCard";
import AiStructuredDataView from "@/page/dashboard/director-dashboard/ai-assistant/components/AiStructuredDataView";

export default function AiWidgetRenderer({ type, payload }) {
  const value = parseWidgetPayload(payload);
  if (value === null || value === undefined) return null;
  const widgets = Array.isArray(value?.widgets)
    ? value.widgets
    : Array.isArray(value) &&
        value.every((item) => item?.widget_type || item?.type)
      ? value
      : null;
  if (widgets)
    return widgets.map((widget, index) => (
      <AiWidgetRenderer
        key={index}
        type={widget.widget_type || widget.type}
        payload={widget.widget_payload ?? widget.payload ?? widget}
      />
    ));
  if (
    value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (type === "excel_download" ||
      value.type === "excel_download" ||
      value.download_url)
  )
    return <AiDownloadWidgetCard payload={value} />;
  if (
    (type === "table" && typeof value === "object" && !Array.isArray(value)) ||
    value?.type === "table" ||
    Array.isArray(value?.rows)
  )
    return <AiTableWidgetCard payload={value} />;
  if (
    ((type === "chart" || type === "graph") &&
      typeof value === "object" &&
      !Array.isArray(value)) ||
    value?.chart_type ||
    Array.isArray(value?.datasets) ||
    Array.isArray(value?.data?.datasets)
  )
    return <AiChartWidgetCard payload={value} />;
  return <AiStructuredDataView value={value} />;
}
