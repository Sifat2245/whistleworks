import {
  humanizeKey,
  safeAiUrl,
} from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiPresentation";
import { parseWidgetPayload } from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiChat";

export default function AiStructuredValue({ value }) {
  if (typeof value === "string" && /^\s*[{[]/.test(value)) {
    const parsed = parseWidgetPayload(value);
    if (parsed && typeof parsed === "object")
      return <AiStructuredValue value={parsed} />;
    if (/^\s*\{/.test(value))
      return (
        <span className="text-slate-500">Details could not be formatted.</span>
      );
  }
  if (value === null || value === undefined)
    return <span className="text-slate-400">—</span>;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value))
    return value.length ? (
      <ul className="space-y-2 list-disc pl-4">
        {value.map((item, index) => (
          <li key={index}>
            <AiStructuredValue value={item} />
          </li>
        ))}
      </ul>
    ) : (
      <span className="text-slate-500">No entries</span>
    );
  if (typeof value === "object")
    return Object.keys(value).length ? (
      <dl className="space-y-2 min-w-36">
        {Object.entries(value).map(([key, item]) => (
          <div key={key} className="flex flex-wrap items-start gap-x-3 gap-y-1">
            <dt className="font-medium text-slate-500">{humanizeKey(key)}</dt>
            <dd className="min-w-0 break-words">
              <AiStructuredValue value={item} />
            </dd>
          </div>
        ))}
      </dl>
    ) : (
      <span className="text-slate-500">No details returned</span>
    );
  if (typeof value === "string" && /^https?:\/\//i.test(value)) {
    const url = safeAiUrl(value);
    if (url)
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-700 underline break-all"
        >
          {value}
        </a>
      );
  }
  return String(value);
}
