import { useRef, useEffect, useState } from "react";
import { FiArrowUp, FiChevronDown, FiCheck, FiAtSign, FiLayers } from "react-icons/fi";
import { cn } from "@/lib/utils";
import AiMentionMenu from "./AiMentionMenu";
import { getRefereesForCamp, getEvaluatorsForCamp } from "../data/aiAssistantData";

const AiChatInput = ({
  inputValue,
  onInputChange,
  onSubmit,
  isTyping,
  selectedCampFilter = "all",
  onCampFilterChange,
  campOptions = [],
}) => {
  const textareaRef = useRef(null);
  const campMenuRef = useRef(null);

  const [isCampDropdownOpen, setIsCampDropdownOpen] = useState(false);
  const [isMentionMenuOpen, setIsMentionMenuOpen] = useState(false);
  const [mentionSearchTerm, setMentionSearchTerm] = useState("");

  // Get active referees and evaluators based on selected camp
  const activeReferees = getRefereesForCamp(selectedCampFilter);
  const activeEvaluators = getEvaluatorsForCamp(selectedCampFilter);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140
      )}px`;
    }
  }, [inputValue]);

  // Close camp dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (campMenuRef.current && !campMenuRef.current.contains(e.target)) {
        setIsCampDropdownOpen(false);
      }
    };
    if (isCampDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCampDropdownOpen]);

  // Handle textarea change and detect "@" mentions
  const handleTextChange = (e) => {
    const value = e.target.value;
    onInputChange(value);

    // Check if cursor is immediately after "@" or a mention prefix
    const cursor = e.target.selectionStart;
    const textBeforeCursor = value.slice(0, cursor);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);

    if (atMatch) {
      setIsMentionMenuOpen(true);
      setMentionSearchTerm(atMatch[1] || "");
    } else {
      setIsMentionMenuOpen(false);
    }
  };

  const handleKeyDown = (e) => {
    // If mention menu is open and user presses ArrowDown/ArrowUp/Enter/Escape, let mention menu handle or close
    if (isMentionMenuOpen) {
      if (e.key === "Escape") {
        setIsMentionMenuOpen(false);
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim() && !isTyping && !isMentionMenuOpen) {
        onSubmit(inputValue);
      }
    }
  };

  // When a referee or evaluator is selected from the @ menu
  const handleSelectMention = (name) => {
    const cursor = textareaRef.current ? textareaRef.current.selectionStart : inputValue.length;
    const textBefore = inputValue.slice(0, cursor);
    const textAfter = inputValue.slice(cursor);

    // If textBefore has an @ prefix, replace it; otherwise append @[Name] with proper spacing
    const hasAt = /@\w*$/.test(textBefore);
    const updatedBefore = hasAt
      ? textBefore.replace(/@\w*$/, `@${name} `)
      : `${textBefore}${textBefore && !textBefore.endsWith(" ") ? " " : ""}@${name} `;
    const finalVal = updatedBefore + textAfter;

    onInputChange(finalVal);
    setIsMentionMenuOpen(false);

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = updatedBefore.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 50);
  };

  // Find human-readable label of current active camp
  const getActiveCampLabel = () => {
    if (selectedCampFilter === "all") return "All Camps (2024–2026)";
    const found = campOptions.find((c) => (c.id || c.value) === selectedCampFilter);
    if (found) return found.camp_name || found.name || found.label;
    if (selectedCampFilter === "midwest-2026") return "Midwest Elite Summit (2026)";
    if (selectedCampFilter === "great-lakes-2025") return "Great Lakes Ref Camp (2025)";
    if (selectedCampFilter === "chicago-2024") return "Chicago Officiating Clinic (2024)";
    return selectedCampFilter;
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-1 sm:px-4 pt-1 sm:pt-2 pb-1 sm:pb-2 shrink-0 space-y-1 sm:space-y-1.5 relative">
      {/* ── @ Mention Popup Menu ──────────────────────────────── */}
      <AiMentionMenu
        isOpen={isMentionMenuOpen}
        onClose={() => setIsMentionMenuOpen(false)}
        onSelectMention={handleSelectMention}
        referees={activeReferees}
        evaluators={activeEvaluators}
        searchTerm={mentionSearchTerm}
      />

      {/* ── Main Input Box Container ──────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (inputValue.trim() && !isTyping && !isMentionMenuOpen) {
            onSubmit(inputValue);
          }
        }}
        className="bg-white border border-slate-200/90 focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-slate-900/5 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 transition-all shadow-xs space-y-1.5 sm:space-y-2 relative"
      >
        {/* Text Input Field */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={inputValue}
          onChange={handleTextChange}
          onKeyDown={handleKeyDown}
          placeholder="Ask about referee histories, compare officials, or type @ to mention..."
          className="w-full max-h-[140px] bg-transparent resize-none px-2 sm:px-3 pt-0.5 sm:pt-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none leading-relaxed"
        />

        {/* Bottom Toolbar inside Input Field */}
        <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-1 px-0.5 sm:px-1 border-t border-slate-100/80">
          <div className="flex items-center gap-1 sm:gap-1.5">
            {/* Embedded Camp Selector (AI Model-Picker Style) */}
            <div className="relative" ref={campMenuRef}>
              <button
                type="button"
                onClick={() => setIsCampDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-slate-100/90 hover:bg-slate-200/80 text-slate-700 text-[11px] sm:text-xs font-semibold transition-colors cursor-pointer"
                title="Select Camp Scope"
                aria-label="Select Camp Scope"
              >
                <FiLayers className="size-3 sm:size-3.5 text-primary shrink-0" />
                <span className="max-w-[105px] xs:max-w-[140px] sm:max-w-[200px] truncate">
                  {getActiveCampLabel()}
                </span>
                <FiChevronDown className={cn("size-2.5 sm:size-3 transition-transform shrink-0", isCampDropdownOpen && "rotate-180")} />
              </button>

              {/* Model / Camp Selector Dropdown Popover */}
              {isCampDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 sm:w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 space-y-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Query Camp Scope
                  </div>

                  {/* All Camps Option */}
                  <button
                    type="button"
                    onClick={() => {
                      onCampFilterChange("all");
                      setIsCampDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                      selectedCampFilter === "all"
                        ? "bg-primary/10 text-primary font-bold"
                        : "hover:bg-slate-50 text-slate-700"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <FiLayers className="size-3.5" />
                      <span>All Camps (2024–2026)</span>
                    </div>
                    {selectedCampFilter === "all" && <FiCheck className="size-3.5 text-primary" />}
                  </button>

                  {/* Dynamic & Fallback Camps */}
                  {campOptions.length > 0
                    ? campOptions.map((camp) => {
                        const val = camp.id || camp.value;
                        const isSelected = selectedCampFilter === val;
                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              onCampFilterChange(val);
                              setIsCampDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                              isSelected
                                ? "bg-primary/10 text-primary font-bold"
                                : "hover:bg-slate-50 text-slate-700"
                            )}
                          >
                            <span className="truncate">{camp.camp_name || camp.name || camp.label}</span>
                            {isSelected && <FiCheck className="size-3.5 text-primary" />}
                          </button>
                        );
                      })
                    : [
                        { id: "midwest-2026", name: "Midwest Elite Summit (2026)" },
                        { id: "great-lakes-2025", name: "Great Lakes Ref Camp (2025)" },
                        { id: "chicago-2024", name: "Chicago Officiating Clinic (2024)" },
                      ].map((camp) => {
                        const isSelected = selectedCampFilter === camp.id;
                        return (
                          <button
                            key={camp.id}
                            type="button"
                            onClick={() => {
                              onCampFilterChange(camp.id);
                              setIsCampDropdownOpen(false);
                            }}
                            className={cn(
                              "w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer",
                              isSelected
                                ? "bg-primary/10 text-primary font-bold"
                                : "hover:bg-slate-50 text-slate-700"
                            )}
                          >
                            <span className="truncate">{camp.name}</span>
                            {isSelected && <FiCheck className="size-3.5 text-primary" />}
                          </button>
                        );
                      })}
                </div>
              )}
            </div>

            {/* Quick Context Mention Trigger Button */}
            <button
              type="button"
              onClick={() => setIsMentionMenuOpen((prev) => !prev)}
              className={cn(
                "inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-colors cursor-pointer",
                isMentionMenuOpen
                  ? "bg-primary text-white font-bold"
                  : "bg-slate-100/90 hover:bg-slate-200/80 text-slate-600"
              )}
              title="Mention Referee or Evaluator (@)"
              aria-label="Mention Referee or Evaluator"
            >
              <FiAtSign className="size-3 sm:size-3.5" />
              <span className="hidden sm:inline">Mention</span>
            </button>
          </div>

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            aria-label="Send message"
            className="size-7 sm:size-8 md:size-9 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            <FiArrowUp className="size-3.5 sm:size-4" />
          </button>
        </div>
      </form>

      <p className="text-[10px] sm:text-[11px] text-center text-slate-400">
        Type <strong>@</strong> to mention a referee or evaluator. Queries are scoped to the selected camp.
      </p>
    </div>
  );
};

export default AiChatInput;
