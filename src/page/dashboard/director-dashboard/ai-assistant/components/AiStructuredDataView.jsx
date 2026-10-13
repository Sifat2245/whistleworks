import { humanizeKey } from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiPresentation";
import AiStructuredValue from "@/page/dashboard/director-dashboard/ai-assistant/components/AiStructuredValue";
import AiTableWidgetCard from "@/page/dashboard/director-dashboard/ai-assistant/components/cards/AiTableWidgetCard";

export default function AiStructuredDataView({ value, title }) {
  if (
    Array.isArray(value) &&
    value.length &&
    value.every(
      (item) => item && typeof item === "object" && !Array.isArray(item),
    )
  )
    return (
      <AiTableWidgetCard payload={{ title: title || "Results", rows: value }} />
    );
  if (typeof value === "string" && /^\s*[{[]/.test(value))
    return (
      <p className="text-sm text-slate-500">
        Additional data could not be formatted. Ask the assistant to summarize
        it.
      </p>
    );
  const object = value && typeof value === "object" && !Array.isArray(value);
  const heading =
    title || (typeof value?.title === "string" ? value.title : "Results");
  return (
    <section
      className="my-3 rounded-2xl border border-slate-200 bg-white overflow-hidden"
      aria-label={heading}
    >
      <h4 className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-800">
        {heading}
      </h4>
      {object ? (
        <dl className="divide-y divide-slate-100">
          {Object.entries(value)
            .filter(([key]) => key !== "title" && key !== "type")
            .map(([key, item]) => (
              <div key={key} className="px-4 py-3">
                <dt className="text-xs font-medium text-slate-500 mb-1.5">
                  {humanizeKey(key)}
                </dt>
                <dd className="text-sm text-slate-800 break-words">
                  {Array.isArray(item) &&
                  item.length &&
                  item.every(
                    (entry) =>
                      entry &&
                      typeof entry === "object" &&
                      !Array.isArray(entry),
                  ) ? (
                    <AiTableWidgetCard
                      payload={{ title: humanizeKey(key), rows: item }}
                    />
                  ) : (
                    <AiStructuredValue value={item} />
                  )}
                </dd>
              </div>
            ))}
          {Object.keys(value).every((key) =>
            ["title", "type"].includes(key),
          ) && (
            <div className="p-4 text-sm text-slate-500">
              No additional data returned.
            </div>
          )}
        </dl>
      ) : (
        <div className="p-4 text-sm">
          <AiStructuredValue value={value} />
        </div>
      )}
    </section>
  );
}
