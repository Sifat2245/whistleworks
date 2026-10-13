# Director AI conversations

Updated October 13, 2026.

The director assistant uses authenticated APIs through `useAxiosSecure`, services in `src/services/director-services/ai-chat.service.js`, and TanStack Query hooks in `src/hooks/api/director-hooks/useAiChat.js`. Page components, response renderers, hooks, and utilities remain inside the AI assistant page folder.

## Session APIs

| Action             | Request                                               | Response used                                                                |
| ------------------ | ----------------------------------------------------- | ---------------------------------------------------------------------------- |
| List conversations | GET `/v1/director/ai/sessions?page=1`                 | `data.sessions`, `data.pagination.current_page`, `data.pagination.last_page` |
| Load history       | GET `/v1/director/ai/session/{session_uuid}/history`  | `data.title`, `data.messages`, and each message's content/widget payload     |
| Rename             | PATCH `/v1/director/ai/session/rename/{session_uuid}` | JSON body: `{ "title": "Conversation title" }`                               |
| Start or continue  | POST `/v1/director/ai/chat`                           | FormData: `message`; add `session_uuid` only for a continuing session        |

Conversation identity is stored in `/director-dashboard/ai-assistant?session={session_uuid}` using React Router search parameters. Opening or refreshing that URL loads the matching history from the authenticated endpoint. History selection and New Chat create browser history entries; the first successful reply replaces the empty-chat URL with its returned UUID while preserving the user message, new response, and typing animation. Back/Forward changes the transcript, clears the draft and mention selection, and ignores responses from abandoned conversations. Other URL parameters are preserved.

The History drawer lists saved API sessions, supports loading additional pages, opens a conversation, and provides renaming. New Chat clears the active UUID, draft, mention state, and camp selection. Opening history replaces the transcript and allows follow-up questions using that session's UUID. Responses from abandoned views cannot overwrite the newly selected conversation.

Titles are trimmed and blank titles rejected. Mutation success synchronizes session/history caches. Quota and the session list refresh after successful or failed chat requests, since a server-side failure may still have created a session or used quota. Failed requests show an error with retry/edit controls; no simulated camp, referee, evaluation, or assistant data is substituted.

## Prompt context

Referee and evaluator selections insert the exact API identity syntax:

```text
@Referee Name (ID: 14)
@Evaluator Name (ID: 28)
```

The selected camp is included as `@Camp Name (ID: 3)`. Existing `across all my camps` phrasing is converted to the selected camp when necessary; otherwise a short camp-scope instruction is appended. All Camps uses `Across all my camps.` when the prompt does not already include all-camp context. Camp and participant IDs stay inside the message string; no undocumented request fields are added.

Names are escaped during mention normalization. Existing IDs distinguish people sharing a name, and replacements run in one pass to preserve overlapping names. The empty state contains guidance only. The demo response generator, fabricated records, suggested prompt templates, and `data/aiAssistantData.js` are removed.

## Responses and widgets

Assistant text uses React Markdown and GitHub-flavored Markdown for headings, lists, tables, links, and code. Raw HTML and images are not rendered. Newly returned messages reveal text over a short bounded animation with a Show full response action; historical replies appear immediately. Reduced-motion preferences disable typing and chart animation. Auto-follow stops when the director scrolls upward to read earlier messages.

Chart.js is loaded separately when a chart is returned. Supported chart types are line, bar, pie, doughnut/donut, radar, scatter, bubble, polarArea/polar_area, area, horizontal_bar, and stacked_bar, including supported per-dataset mixed types. The supplied shape is supported directly:

```json
{
  "widget_type": "chart",
  "widget_payload": {
    "chart_type": "line",
    "title": "Performance comparison",
    "labels": ["Accuracy", "Mechanics"],
    "y_axis": { "min": 0, "max": 10, "title": "Score" },
    "datasets": [{ "label": "Official", "data": [6.83, 7.67] }]
  }
}
```

Zero and missing scores remain distinct. Each chart includes a data-table view. Widget tables accept headers or column descriptors and array/object rows; headers can be derived from object keys when omitted. JSON-encoded payloads and collections of widgets are supported. Unknown/custom widget formats use labeled values, nested lists, and record tables. Nested table cells, JSON text responses, and fenced JSON blocks are also formatted. No raw JSON viewer is shown. Malformed structured payloads display a formatting message while the original assistant explanation remains available. Specialized charts such as heatmaps or Sankey diagrams require a matching renderer/plugin and payload contract; the generic fallback preserves their data.

The `excel_download` payload renders a report card with the backend title, filename, size, included camps, ranked-referee count, and a spreadsheet preview. Display headers `Referee` and `Avg Score` map explicitly to the supplied `name` and `score` fields; direct matching keys take precedence, and absent headers are derived from actual row keys. Zero values remain visible. Other file payloads with a `download_url` use the same download card. Only HTTP(S) or root-relative links are accepted; invalid links produce a message instead of a download action. Links open the returned backend file URL in a new tab. The backend is responsible for file access permissions and download headers.

Copy uses the full assistant text, including while text is revealing, or human-readable widget data for widget-only replies. Export creates a Markdown report with readable widget data, tables, and download links. Implementation metadata such as tool function names is not displayed in the message. No image, video, or audio responses are generated by these components.

Implementation references: [React Router search parameters](https://reactrouter.com/api/hooks/useSearchParams), [Chart.js integration](https://www.chartjs.org/docs/latest/getting-started/integration.html), [Chart.js line dataset format](https://www.chartjs.org/docs/latest/charts/line.html), and [React Markdown with GFM](https://github.com/remarkjs/react-markdown).

## Verification

Tests cover direct session URLs, new-session URL promotion, browser Back/Forward, both new and historical Excel responses, safe download URLs, generic structured rendering, readable copy/export, the supplied service routes and request bodies, pagination envelopes, session continuation/reset, rename validation/failure, history and send races, retry/edit behavior, quota access, mention IDs, overlapping names, typing/reduced motion, chart configuration values, Markdown tables, and structured-data fallbacks. API calls are mocked in automated tests; live authenticated endpoints and browser visual rendering have not been exercised by the agent.
