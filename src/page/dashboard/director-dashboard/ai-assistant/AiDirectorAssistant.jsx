import { useState, useRef, useEffect } from "react";
import { useGetMyCamp } from "@/hooks/api/director-hooks/useCamps";
import { generateAiResponse } from "./data/aiAssistantData";
import AiChatMessageList from "./components/AiChatMessageList";
import AiChatInput from "./components/AiChatInput";

const INITIAL_MESSAGES = [];

const AiDirectorAssistant = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCampFilter, setSelectedCampFilter] = useState("all");

  const { camps = [] } = useGetMyCamp(1);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const queryText = typeof textToSend === "string" ? textToSend : inputValue;
    if (!queryText || !queryText.trim() || isTyping) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate realistic AI generation
    setTimeout(() => {
      const responsePayload = generateAiResponse(queryText, selectedCampFilter);
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        ...responsePayload,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleCampFilterChange = (newCamp) => {
    setSelectedCampFilter(newCamp);
  };

  return (
    <div className="w-full h-[calc(100dvh-115px)] sm:h-[calc(100vh-105px)] flex flex-col justify-between overflow-hidden">
      {/* Main Conversation Stream */}
      <AiChatMessageList
        messages={messages}
        isTyping={isTyping}
        onSelectPrompt={handleSendMessage}
        messagesEndRef={messagesEndRef}
      />

      {/* Floating Prompt Input Bar with Embedded Camp Selector & @ Mentions */}
      <AiChatInput
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSendMessage}
        isTyping={isTyping}
        selectedCampFilter={selectedCampFilter}
        onCampFilterChange={handleCampFilterChange}
        campOptions={camps}
      />
    </div>
  );
};

export default AiDirectorAssistant;
