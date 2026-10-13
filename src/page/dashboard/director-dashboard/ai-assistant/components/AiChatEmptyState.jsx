import { FiMessageSquare } from "react-icons/fi";

export default function AiChatEmptyState({ isSavedSession = false }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full px-4 py-8 text-center gap-5">
      <span className="size-14 rounded-2xl flex items-center justify-center bg-primary/10 text-primary">
        <FiMessageSquare className="size-6" aria-hidden="true" />
      </span>
      <div className="space-y-3">
        <h2 className="text-xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
          {isSavedSession
            ? "No messages in this conversation yet"
            : "How can WhistleWorks AI assist you today?"}
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
          {isSavedSession
            ? "Send a message below to continue this conversation."
            : "Ask about your camps, referee evaluations, or evaluator results. Choose a camp below and use @ to mention an official or evaluator."}
        </p>
      </div>
    </div>
  );
}
