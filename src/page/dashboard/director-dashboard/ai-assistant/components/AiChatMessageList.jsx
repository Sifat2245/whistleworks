import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import AiChatMessageItem from "@/page/dashboard/director-dashboard/ai-assistant/components/AiChatMessageItem";
import AiChatEmptyState from "@/page/dashboard/director-dashboard/ai-assistant/components/AiChatEmptyState";

export default function AiChatMessageList({
  messages = [],
  isTyping = false,
  isSavedSession = false,
  messagesEndRef,
}) {
  const following = useRef(true);
  const reduced = useReducedMotion();
  const followResponse = useCallback(() => {
    if (following.current)
      messagesEndRef.current?.scrollIntoView({
        behavior: "auto",
        block: "end",
      });
  }, [messagesEndRef]);
  useEffect(() => {
    if (following.current)
      messagesEndRef.current?.scrollIntoView({
        behavior: reduced ? "auto" : "smooth",
        block: "end",
      });
  }, [messages, isTyping, messagesEndRef, reduced]);
  return (
    <div
      className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-4 py-1 sm:py-4 flex flex-col"
      onScroll={(event) => {
        const element = event.currentTarget;
        following.current =
          element.scrollHeight - element.scrollTop - element.clientHeight < 100;
      }}
    >
      {messages.length === 0 ? (
        <AiChatEmptyState isSavedSession={isSavedSession} />
      ) : (
        <div
          role="log"
          aria-label="AI conversation"
          aria-live="polite"
          className="max-w-3xl mx-auto w-full space-y-4 sm:space-y-6"
        >
          {messages.map((message) => (
            <AiChatMessageItem
              key={message.id}
              message={message}
              onTypingProgress={followResponse}
            />
          ))}
          {isTyping && (
            <div
              role="status"
              className="flex items-center gap-2 text-xs text-slate-500 py-2"
            >
              <span className="size-2 rounded-full bg-primary animate-pulse motion-reduce:animate-none" />
              Thinking…
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
