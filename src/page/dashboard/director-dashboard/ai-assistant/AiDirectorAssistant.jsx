import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Drawer } from "antd";
import { FiClock, FiEdit2, FiMessageSquare, FiPlus } from "react-icons/fi";
import {
  useGetAiCamps,
  useGetAiSessionHistory,
  useSendAiChat,
} from "@/hooks/api/director-hooks/useAiChat";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import Loader from "@/components/common/Loader";
import AiChatInput from "@/page/dashboard/director-dashboard/ai-assistant/components/AiChatInput";
import AiChatMessageList from "@/page/dashboard/director-dashboard/ai-assistant/components/AiChatMessageList";
import AiSessionList from "@/page/dashboard/director-dashboard/ai-assistant/components/AiSessionList";
import AiRenameSessionModal from "@/page/dashboard/director-dashboard/ai-assistant/components/AiRenameSessionModal";
import {
  aiErrorMessage,
  buildAiPrompt,
  normalizeAiMessage,
} from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiChat";
import { formatSessionTitle } from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiPresentation";

const freshConversation = () => ({
  uuid: null,
  title: "New conversation",
  messages: [],
});

export default function AiDirectorAssistant() {
  const [searchParams, setSearchParams] = useSearchParams();
  const routeUuid = searchParams.get("session") || null;
  const [conversation, setConversation] = useState(() =>
    routeUuid
      ? { uuid: routeUuid, title: "Conversation", messages: null }
      : freshConversation(),
  );
  const [inputValue, setInputValue] = useState("");
  const [selectedCampFilter, setSelectedCampFilter] = useState("all");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [viewVersion, setViewVersion] = useState(0);
  const epochRef = useRef(0);
  const previousRouteUuid = useRef(routeUuid);
  const sendingRef = useRef(false);
  const aliveRef = useRef(true);
  const messagesEndRef = useRef(null);
  const { camps = [], isLoading: isCampsLoading } = useGetAiCamps();
  const sendMutation = useSendAiChat();
  const history = useGetAiSessionHistory(conversation.uuid, {
    enabled: conversation.messages === null,
  });
  useEffect(() => {
    aliveRef.current = true;
    return () => {
      aliveRef.current = false;
      epochRef.current += 1;
    };
  }, []);
  const loadingHistory = conversation.messages === null;
  const savedMessages = useMemo(
    () =>
      (Array.isArray(history.data?.messages) ? history.data.messages : [])
        .filter(
          (message) =>
            message &&
            (message.role === "user" || message.role === "assistant"),
        )
        .map((message) => normalizeAiMessage(message)),
    [history.data?.messages],
  );
  const messages = conversation.messages ?? savedMessages;
  const rawTitle = loadingHistory
    ? history.data?.title || conversation.title
    : conversation.title;
  const title = formatSessionTitle(rawTitle);
  const changingRoute = routeUuid !== conversation.uuid;
  const historyUnavailable =
    changingRoute || (loadingHistory && (!history.data || history.isError));

  const changeConversation = useCallback((next) => {
    epochRef.current += 1;
    sendingRef.current = false;
    setViewVersion(epochRef.current);
    setConversation(next);
    setInputValue("");
    setSelectedCampFilter("all");
    setIsSending(false);
    setSendError(null);
    setHistoryOpen(false);
    setRenameTarget(null);
  }, []);
  useEffect(() => {
    // A first reply updates local state before Router completes its navigation.
    // Reset only for a URL change, so that promotion does not reload the chat.
    if (previousRouteUuid.current === routeUuid) return;
    previousRouteUuid.current = routeUuid;
    if (!changingRoute) return;
    changeConversation(
      routeUuid
        ? { uuid: routeUuid, title: "Conversation", messages: null }
        : freshConversation(),
    );
  }, [routeUuid, changingRoute, changeConversation]);
  const navigateSession = (uuid, replace = false) => {
    const next = new URLSearchParams(searchParams);
    if (uuid) next.set("session", uuid);
    else next.delete("session");
    setSearchParams(next, { replace });
  };
  const newChat = () => {
    if (!routeUuid) changeConversation(freshConversation());
    else navigateSession(null);
  };
  const openSession = (session) => {
    setHistoryOpen(false);
    if (session.session_uuid !== routeUuid)
      navigateSession(session.session_uuid);
  };

  const sendRequest = (request) => {
    const epoch = epochRef.current;
    sendingRef.current = true;
    setIsSending(true);
    setSendError(null);
    sendMutation.mutate(request.payload, {
      onSuccess: (response) => {
        if (!aliveRef.current || epoch !== epochRef.current) return;
        sendingRef.current = false;
        setIsSending(false);
        const data = response?.data;
        const reply =
          data?.assistant_message ||
          data?.response ||
          (typeof data?.message === "object" ? data.message : data);
        if (
          !reply ||
          (!reply.content &&
            !reply.widget_payload &&
            typeof data?.message !== "string")
        ) {
          setSendError({
            ...request,
            error:
              "The server returned no response. Open conversation history to check its status before retrying.",
          });
          return;
        }
        const uuid = data.session_uuid || conversation.uuid;
        const assistant = normalizeAiMessage(
          {
            ...reply,
            content: reply.content || data.message || "",
            scope: request.scope,
          },
          true,
        );
        setConversation((current) => ({
          uuid,
          title: data.session_title || data.title || current.title,
          messages: [...(current.messages || []), assistant],
        }));
        // Promote a fresh chat without discarding its local transcript or animation.
        if (uuid && uuid !== routeUuid) navigateSession(uuid, true);
        if (!uuid)
          setSendError({
            ...request,
            cannotRetry: true,
            error:
              "The response is missing a conversation ID. Open history to continue this conversation.",
          });
      },
      onError: (error) => {
        if (!aliveRef.current || epoch !== epochRef.current) return;
        sendingRef.current = false;
        setIsSending(false);
        setSendError({
          ...request,
          error: aiErrorMessage(
            error,
            "Unable to send message. Please try again.",
          ),
        });
      },
    });
  };
  const handleSendMessage = (textToSend, mentions = []) => {
    const text = typeof textToSend === "string" ? textToSend : inputValue;
    if (!text.trim() || sendingRef.current || historyUnavailable || sendError)
      return;
    const selected = camps.find(
      (camp) => String(camp.id ?? camp.value) === String(selectedCampFilter),
    );
    if (selectedCampFilter !== "all" && !selected) return;
    const camp =
      selectedCampFilter === "all"
        ? null
        : {
            id: selected.id ?? selected.value,
            name: selected.name || selected.camp_name || selected.label,
          };
    const payload = { message: buildAiPrompt(text, mentions, camp) };
    if (conversation.uuid) payload.session_uuid = conversation.uuid;
    const userMessage = normalizeAiMessage({ role: "user", content: text });
    setConversation({
      ...conversation,
      title,
      messages: [...messages, userMessage],
    });
    setInputValue("");
    sendRequest({
      payload,
      text,
      userId: userMessage.id,
      scope: camp?.name || "All Camps",
    });
  };

  return (
    <div className="w-full h-[calc(100dvh-115px)] sm:h-[calc(100vh-105px)] flex flex-col overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/70 bg-white/80 px-2 sm:px-5 py-3 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <FiMessageSquare
            className="text-primary shrink-0"
            aria-hidden="true"
          />
          <h2 className="truncate text-sm font-semibold text-slate-800">
            {title}
          </h2>
          {conversation.uuid && (
            <button
              type="button"
              aria-label="Rename current conversation"
              onClick={() =>
                setRenameTarget({ session_uuid: conversation.uuid, title })
              }
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <FiEdit2 />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => setHistoryOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100"
          >
            <FiClock aria-hidden="true" /> History
          </button>
          <CommonSubmitBtn
            type="button"
            onClick={newChat}
            className="gap-1.5 text-xs"
          >
            <FiPlus aria-hidden="true" /> New Chat
          </CommonSubmitBtn>
        </div>
      </div>
      {historyUnavailable ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
          {history.isError ? (
            <>
              <p role="alert" className="text-sm text-red-700">
                {aiErrorMessage(history.error, "Unable to load conversation.")}
              </p>
              <CommonSubmitBtn type="button" onClick={() => history.refetch()}>
                Retry history
              </CommonSubmitBtn>
            </>
          ) : (
            <>
              <Loader />
              <p role="status" className="text-sm text-slate-500">
                Loading conversation…
              </p>
            </>
          )}
        </div>
      ) : (
        <AiChatMessageList
          key={`messages-${viewVersion}`}
          messages={messages}
          isTyping={isSending}
          isSavedSession={Boolean(conversation.uuid)}
          messagesEndRef={messagesEndRef}
        />
      )}
      {sendError && (
        <div
          role="alert"
          className="mx-auto w-full max-w-3xl px-4 py-3 text-xs text-red-700 bg-red-50 border border-red-100 rounded-xl"
        >
          <p>{sendError.error}</p>
          {!sendError.cannotRetry && (
            <div className="flex gap-4 mt-2">
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => sendRequest(sendError)}
              >
                Retry message
              </button>
              <button
                type="button"
                className="font-semibold underline"
                onClick={() => {
                  setConversation((current) => ({
                    ...current,
                    messages: current.messages.filter(
                      (message) => message.id !== sendError.userId,
                    ),
                  }));
                  setInputValue(sendError.text);
                  setSendError(null);
                }}
              >
                Edit message
              </button>
            </div>
          )}
        </div>
      )}
      <AiChatInput
        key={`composer-${viewVersion}`}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSendMessage}
        isTyping={isSending || historyUnavailable || Boolean(sendError)}
        selectedCampFilter={selectedCampFilter}
        onCampFilterChange={setSelectedCampFilter}
        campOptions={camps}
        isCampsLoading={isCampsLoading}
      />
      <Drawer
        title="Your conversations"
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        width={360}
      >
        <AiSessionList
          activeUuid={conversation.uuid}
          onSelect={openSession}
          onNewChat={newChat}
          onRename={setRenameTarget}
        />
      </Drawer>
      {renameTarget && (
        <AiRenameSessionModal
          key={renameTarget.session_uuid}
          session={renameTarget}
          onClose={() => setRenameTarget(null)}
          onRenamed={(renamedTitle) => {
            setConversation((current) =>
              current.uuid === renameTarget.session_uuid
                ? {
                    ...current,
                    title: renamedTitle,
                    messages:
                      current.messages ??
                      (history.data && !history.isError ? savedMessages : null),
                  }
                : current,
            );
            setRenameTarget(null);
          }}
        />
      )}
    </div>
  );
}
