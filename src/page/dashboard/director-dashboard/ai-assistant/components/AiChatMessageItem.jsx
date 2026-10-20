import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiCopy, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  aiResponseText,
} from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiPresentation";
import AiMarkdownContent from "@/page/dashboard/director-dashboard/ai-assistant/components/AiMarkdownContent";
import AiWidgetRenderer from "@/page/dashboard/director-dashboard/ai-assistant/components/AiWidgetRenderer";
import useTypedResponse from "@/page/dashboard/director-dashboard/ai-assistant/hooks/useTypedResponse";

const AiChatMessageItem = ({ message, onTypingProgress }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.sender === "user" || message.role === "user";
  const textContent = message.content || message.text || "";
  const reduced = useReducedMotion();
  const typed = useTypedResponse(textContent, !isUser && message.animate);
  const copiedTimer = useRef(null);
  useEffect(() => () => window.clearTimeout(copiedTimer.current), []);
  useEffect(() => {
    if (!isUser) onTypingProgress?.();
  }, [typed.text, isUser, onTypingProgress]);

  const handleCopy = async () => {
    try {
      const copyText = aiResponseText(message, false);

      await navigator.clipboard.writeText(copyText);
      setIsCopied(true);
      toast.success("Response copied to clipboard!");
      window.clearTimeout(copiedTimer.current);
      copiedTimer.current = window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy response");
    }
  };

  if (isUser) {
    return (
      <div className="flex justify-end w-full">
        <div className="bg-white border border-slate-200/90 shadow-2xs text-slate-900 rounded-3xl px-4.5 py-2.5 text-sm max-w-[85%] sm:max-w-[75%] leading-relaxed">
          <p className="whitespace-pre-line">{textContent}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-3 w-full max-w-full text-slate-800 text-sm leading-relaxed">
      <div aria-busy={typed.typing}>
        <div aria-hidden={typed.typing ? true : undefined}>
          <AiMarkdownContent content={typed.text} />
        </div>
        {typed.typing && (
          <>
            <span className="sr-only">{textContent}</span>
            <button
              type="button"
              onClick={typed.finish}
              className="text-[11px] text-sky-700 underline mt-2"
            >
              Show full response
            </button>
          </>
        )}
      </div>
      <motion.div
        initial={message.animate && !reduced ? { opacity: 0, y: 8 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduced ? 0 : 0.3 }}
      >
        <AiWidgetRenderer
          type={message.widget_type}
          payload={message.widget_payload}
        />
      </motion.div>

      {/* Minimal Action Bar */}
      <div className="flex items-center gap-3 pt-1 text-slate-400">
        <button
          type="button"
          onClick={handleCopy}
          title="Copy response"
          aria-label="Copy response"
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer flex items-center gap-1 text-xs"
        >
          {isCopied ? (
            <>
              <FiCheck className="size-3.5 text-emerald-600" />
              <span className="text-emerald-700 text-[11px] font-medium">
                Copied
              </span>
            </>
          ) : (
            <FiCopy className="size-3.5" />
          )}
        </button>

        {message.scope && (
          <span className="text-[11px] text-slate-400 ml-auto">
            {message.scope}
          </span>
        )}
      </div>
    </div>
  );
};

export default AiChatMessageItem;
