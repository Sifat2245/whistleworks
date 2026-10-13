import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { parseWidgetPayload } from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiChat";
import AiStructuredDataView from "@/page/dashboard/director-dashboard/ai-assistant/components/AiStructuredDataView";

function FormattedCodeBlock({ children, node }) {
  const code = node?.children?.find((child) => child.tagName === "code");
  const text = code?.children?.map((child) => child.value || "").join("") || "";
  const json =
    code?.properties?.className?.includes("language-json") ||
    /^\s*[{[]/.test(text);
  if (json) return <AiStructuredDataView value={parseWidgetPayload(text)} />;
  return (
    <pre className="overflow-x-auto rounded-xl bg-slate-100 p-4 my-3">
      {children}
    </pre>
  );
}

const components = {
  h1: ({ children }) => (
    <h3 className="text-lg font-semibold text-slate-900 mt-5 mb-2">
      {children}
    </h3>
  ),
  h2: ({ children }) => (
    <h3 className="text-base font-semibold text-slate-900 mt-5 mb-2">
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="font-semibold text-slate-900 mt-4 mb-2">{children}</h4>
  ),
  p: ({ children }) => (
    <p className="whitespace-pre-wrap my-2 leading-relaxed">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-5 my-3 space-y-1.5">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-5 my-3 space-y-1.5">{children}</ol>
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto my-4 border border-slate-200 rounded-xl">
      <table className="w-full text-left text-xs">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th
      scope="col"
      className="p-3 border-b border-slate-200 bg-slate-50 font-semibold whitespace-nowrap"
    >
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="p-3 border-b border-slate-100">{children}</td>
  ),
  code: ({ children }) => (
    <code className="rounded bg-slate-100 px-1 text-xs break-words">
      {children}
    </code>
  ),
  pre: FormattedCodeBlock,
  blockquote: ({ children }) => (
    <blockquote className="border-l-2 border-primary pl-4 text-slate-600 my-3">
      {children}
    </blockquote>
  ),
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sky-700 underline underline-offset-2"
    >
      {children}
    </a>
  ),
  img: () => null,
};
export default function AiMarkdownContent({ content }) {
  // Some models put structured data in the text field rather than widget_payload.
  if (/^\s*[{[]/.test(content || "")) {
    const value = parseWidgetPayload(content);
    if (typeof value === "object" && value !== null)
      return <AiStructuredDataView value={value} />;
    // Avoid displaying a half-written JSON object during the typing animation.
    if (/^\s*\{/.test(content))
      return <p className="text-sm text-slate-500">Formatting response…</p>;
  }
  return (
    <div className="text-sm text-slate-800 leading-relaxed break-words">
      <Markdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
        {content}
      </Markdown>
    </div>
  );
}
