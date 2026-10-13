import { FiEdit2, FiMessageSquare, FiPlus } from "react-icons/fi";
import { useGetAiSessions } from "@/hooks/api/director-hooks/useAiChat";
import { formatSessionTitle } from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiPresentation";
import { cn } from "@/lib/utils";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import Loader from "@/components/common/Loader";

export default function AiSessionList({
  activeUuid,
  onSelect,
  onNewChat,
  onRename,
}) {
  const {
    sessions,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetAiSessions();
  return (
    <div className="space-y-4">
      <CommonSubmitBtn
        type="button"
        onClick={onNewChat}
        className="w-full gap-2"
      >
        <FiPlus aria-hidden="true" /> Start a new conversation
      </CommonSubmitBtn>
      {isLoading && (
        <div
          role="status"
          className="flex items-center gap-2 text-sm text-slate-500"
        >
          <Loader size={20} /> Loading conversations…
        </div>
      )}
      {isError && (
        <div role="alert" className="text-sm text-red-700">
          <p>{error?.message || "Unable to load conversations."}</p>
          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 underline"
          >
            Retry conversations
          </button>
        </div>
      )}
      {!isLoading && !isError && sessions.length === 0 && (
        <p className="text-sm text-slate-500">
          No saved conversations yet. Send a message to start one.
        </p>
      )}
      <ul className="space-y-2" aria-label="Saved conversations">
        {sessions.map((session) => (
          <li
            key={session.session_uuid}
            className={cn(
              "flex gap-1 rounded-xl border p-1",
              activeUuid === session.session_uuid
                ? "border-primary/40 bg-primary/5"
                : "border-slate-200 bg-white",
            )}
          >
            <button
              type="button"
              aria-current={
                activeUuid === session.session_uuid ? "true" : undefined
              }
              onClick={() => onSelect(session)}
              className="flex-1 min-w-0 text-left p-2 rounded-lg hover:bg-slate-50"
              aria-label={`Open conversation: ${formatSessionTitle(session.title)}`}
            >
              <span className="flex items-start gap-2 text-sm font-semibold text-slate-800">
                <FiMessageSquare
                  className="mt-1 shrink-0 text-primary"
                  aria-hidden="true"
                />
                <span className="line-clamp-2">
                  {formatSessionTitle(session.title)}
                </span>
              </span>
              {session.last_message?.content && (
                <p className="line-clamp-2 mt-2 text-xs text-slate-500">
                  {session.last_message.content}
                </p>
              )}
              <span className="block mt-2 text-[11px] text-slate-400">
                {Number.isFinite(Number(session.messages_count))
                  ? `${session.messages_count} messages`
                  : ""}
                {session.last_interaction_at &&
                  ` · ${new Date(session.last_interaction_at).toLocaleDateString()}`}
              </span>
            </button>
            <button
              type="button"
              onClick={() => onRename(session)}
              aria-label={`Rename conversation: ${formatSessionTitle(session.title)}`}
              className="self-start p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <FiEdit2 />
            </button>
          </li>
        ))}
      </ul>
      {hasNextPage && (
        <CommonSubmitBtn
          type="button"
          variant="secondary"
          isLoading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="w-full"
        >
          Load more conversations
        </CommonSubmitBtn>
      )}
    </div>
  );
}
