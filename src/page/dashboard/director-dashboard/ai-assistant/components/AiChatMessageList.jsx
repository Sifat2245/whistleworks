import AiChatMessageItem from "./AiChatMessageItem";
import AiChatEmptyState from "./AiChatEmptyState";

const AiChatMessageList = ({
  messages = [],
  isTyping = false,
  onSelectPrompt,
  messagesEndRef,
}) => {
  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 min-h-0 overflow-y-auto px-1 sm:px-4 py-1 sm:py-4 flex flex-col">
      {isEmpty ? (
        <AiChatEmptyState onSelectPrompt={onSelectPrompt} />
      ) : (
        <div className="max-w-3xl mx-auto w-full space-y-4 sm:space-y-6">
          {messages.map((msg) => (
            <AiChatMessageItem key={msg.id} message={msg} />
          ))}

          {/* Thinking Indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 py-2">
              <span className="size-2 rounded-full bg-slate-400 animate-pulse" />
              <span>Thinking...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default AiChatMessageList;
