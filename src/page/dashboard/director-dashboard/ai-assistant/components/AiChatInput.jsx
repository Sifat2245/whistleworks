import { useRef, useEffect, useState, useId } from "react";
import {
  FiArrowUp,
  FiChevronDown,
  FiCheck,
  FiAtSign,
  FiLayers,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { formatAiMention } from "@/page/dashboard/director-dashboard/ai-assistant/utils/aiChat";
import AiMentionMenu from "./AiMentionMenu";
import AiQuotaCircle from "./AiQuotaCircle";
import { useGetAiQuota } from "@/hooks/api/director-hooks/useAiChat";

const CampAvatar = ({ logo, name, size = "size-5" }) => {
  const [imageError, setImageError] = useState(false);

  if (logo && !imageError) {
    return (
      <img
        src={logo}
        alt=""
        onError={() => setImageError(true)}
        className={cn(
          size,
          "rounded-full object-cover shrink-0 border border-slate-200/80 bg-slate-50",
        )}
      />
    );
  }

  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "C";
  return (
    <div
      aria-hidden="true"
      className={cn(
        size,
        "rounded-full bg-slate-100 text-slate-600 font-bold text-[10px] flex items-center justify-center shrink-0 border border-slate-200/60",
      )}
    >
      {initial}
    </div>
  );
};

const AiChatInput = ({
  inputValue,
  onInputChange,
  onSubmit,
  isTyping,
  selectedCampFilter = "all",
  onCampFilterChange,
  campOptions = [],
  isCampsLoading = false,
}) => {
  const textareaRef = useRef(null);
  const mentionMenuId = useId();
  const campMenuRef = useRef(null);

  const [isCampDropdownOpen, setIsCampDropdownOpen] = useState(false);
  const [campSearchTerm, setCampSearchTerm] = useState("");
  const [isMentionMenuOpen, setIsMentionMenuOpen] = useState(false);
  const [mentionSearchTerm, setMentionSearchTerm] = useState("");
  const [mentions, setMentions] = useState([]);

  const { quota } = useGetAiQuota();
  const isQuotaBlocked = Boolean(
    quota?.is_blocked ||
    (quota?.remaining_queries !== undefined && quota.remaining_queries <= 0),
  );

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        140,
      )}px`;
    }
  }, [inputValue]);

  // Close camp dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (campMenuRef.current && !campMenuRef.current.contains(e.target)) {
        setIsCampDropdownOpen(false);
        setCampSearchTerm("");
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
    const atMatch = textBeforeCursor.match(/@([^@\n()]*)$/);

    if (atMatch) {
      setIsMentionMenuOpen(true);
      setMentionSearchTerm(atMatch[1] || "");
    } else {
      setIsMentionMenuOpen(false);
    }
  };

  const handleSubmitForm = () => {
    if (
      inputValue.trim() &&
      !isTyping &&
      !isMentionMenuOpen &&
      !isQuotaBlocked
    ) {
      onSubmit(inputValue, mentions);
      setMentions([]);
    }
  };

  const handleKeyDown = (e) => {
    // If mention menu is open and user presses ArrowDown/ArrowUp/Enter/Escape, let mention menu handle or close
    if (isMentionMenuOpen) {
      if (e.key === "Escape") {
        setIsMentionMenuOpen(false);
        return;
      }
      if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
        e.preventDefault();
        const options = document
          .getElementById(mentionMenuId)
          ?.querySelectorAll("[data-mention-option]");
        const index = e.key === "ArrowUp" ? (options?.length || 1) - 1 : 0;
        options?.[index]?.focus();
        return;
      }
    }

    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      handleSubmitForm();
    }
  };

  // When a referee or evaluator is selected from the @ menu
  const handleSelectMention = (name, category, item) => {
    const cursor = textareaRef.current
      ? textareaRef.current.selectionStart
      : inputValue.length;
    const textBefore = inputValue.slice(0, cursor);
    const textAfter = inputValue.slice(cursor);

    // Save mention details if item has ID
    if (item?.id !== undefined && item?.id !== null) {
      setMentions((prev) => {
        const exists = prev.some(
          (m) => m.id === item.id && m.role === category,
        );
        return exists
          ? prev
          : [
              ...prev,
              {
                id: item.id,
                name: item.name || name,
                role: category || item.role,
              },
            ];
      });
    }

    // Format mention tag (include ID if present)
    const mentionTag =
      item?.id !== undefined && item?.id !== null
        ? formatAiMention({ name, id: item.id })
        : `@${name}`;

    // If textBefore has an @ prefix, replace it; otherwise append @[Name] with proper spacing
    const hasAt = /@[^@\n()]*$/.test(textBefore);
    const updatedBefore = hasAt
      ? textBefore.replace(/@[^@\n()]*$/, () => `${mentionTag} `)
      : `${textBefore}${textBefore && !textBefore.endsWith(" ") ? " " : ""}${mentionTag} `;
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

  const activeCamp =
    selectedCampFilter !== "all"
      ? campOptions.find(
          (c) => String(c.id ?? c.value) === String(selectedCampFilter),
        )
      : null;

  // Find human-readable label of current active camp
  const getActiveCampLabel = () => {
    if (selectedCampFilter === "all") return "All Camps";
    if (activeCamp)
      return activeCamp.name || activeCamp.camp_name || activeCamp.label;
    if (selectedCampFilter === "midwest-2026")
      return "Midwest Elite Summit (2026)";
    if (selectedCampFilter === "great-lakes-2025")
      return "Great Lakes Ref Camp (2025)";
    if (selectedCampFilter === "chicago-2024")
      return "Chicago Officiating Clinic (2024)";
    return selectedCampFilter;
  };

  // Filter camps by search term
  const filteredCampOptions = campOptions.filter((camp) => {
    if (!campSearchTerm.trim()) return true;
    const name = camp.name || camp.camp_name || camp.label || "";
    return name.toLowerCase().includes(campSearchTerm.toLowerCase().trim());
  });

  return (
    <div className="w-full max-w-3xl mx-auto px-1 sm:px-4 pt-1 sm:pt-2 pb-1 sm:pb-2 shrink-0 space-y-1 sm:space-y-1.5 relative">
      {/* ── @ Mention Popup Menu ──────────────────────────────── */}
      <AiMentionMenu
        id={mentionMenuId}
        isOpen={isMentionMenuOpen}
        onClose={() => setIsMentionMenuOpen(false)}
        onSelectMention={handleSelectMention}
        searchTerm={mentionSearchTerm}
        selectedCampFilter={selectedCampFilter}
        campName={getActiveCampLabel()}
      />

      {/* ── Main Input Box Container ──────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitForm();
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
          aria-label="Message WhistleWorks AI"
          aria-controls={isMentionMenuOpen ? mentionMenuId : undefined}
          disabled={isTyping}
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
                aria-expanded={isCampDropdownOpen}
                disabled={isTyping}
              >
                {selectedCampFilter === "all" ? (
                  <FiLayers className="size-3 sm:size-3.5 text-primary shrink-0" />
                ) : (
                  <CampAvatar
                    logo={activeCamp?.logo}
                    name={getActiveCampLabel()}
                    size="size-3.5 sm:size-4"
                  />
                )}
                <span className="max-w-[105px] xs:max-w-[140px] sm:max-w-[200px] truncate">
                  {getActiveCampLabel()}
                </span>
                <FiChevronDown
                  className={cn(
                    "size-2.5 sm:size-3 transition-transform shrink-0",
                    isCampDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {/* Model / Camp Selector Dropdown Popover */}
              {isCampDropdownOpen && (
                <div className="absolute bottom-full left-0 mb-2 w-64 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-150">
                  <div className="px-2.5 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span>Query Camp Scope</span>
                    {campOptions.length > 0 && (
                      <span className="text-[10px] font-medium text-slate-400">
                        {filteredCampOptions.length} of {campOptions.length}
                      </span>
                    )}
                  </div>

                  {/* Camp Search Bar */}
                  <div className="px-1 py-1.5 border-b border-slate-100">
                    <div className="relative flex items-center">
                      <FiSearch className="absolute left-2.5 size-3.5 text-slate-400 pointer-events-none" />
                      <input
                        type="text"
                        value={campSearchTerm}
                        onChange={(e) => setCampSearchTerm(e.target.value)}
                        placeholder="Search camps..."
                        aria-label="Search camps"
                        onKeyDown={(event) => {
                          if (event.key === "Escape")
                            setIsCampDropdownOpen(false);
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all"
                        onClick={(e) => e.stopPropagation()}
                      />
                      {campSearchTerm && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCampSearchTerm("");
                          }}
                          className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                          aria-label="Clear camp search"
                        >
                          <FiX className="size-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-56 sm:max-h-64 overflow-y-auto space-y-1 pr-0.5 mt-1 overscroll-contain">
                    {/* All Camps Option */}
                    {(!campSearchTerm.trim() ||
                      "all camps".includes(
                        campSearchTerm.toLowerCase().trim(),
                      )) && (
                      <button
                        type="button"
                        onClick={() => {
                          onCampFilterChange("all");
                          setIsCampDropdownOpen(false);
                          setCampSearchTerm("");
                        }}
                        className={cn(
                          "w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer group",
                          selectedCampFilter === "all"
                            ? "bg-primary/10 text-primary font-bold"
                            : "hover:bg-slate-50 text-slate-700",
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div
                            className={cn(
                              "size-5 rounded-full flex items-center justify-center shrink-0 transition-colors",
                              selectedCampFilter === "all"
                                ? "bg-primary text-white"
                                : "bg-slate-100 text-slate-500 group-hover:bg-slate-200",
                            )}
                          >
                            <FiLayers className="size-3" />
                          </div>
                          <span className="truncate">All Camps</span>
                        </div>
                        {selectedCampFilter === "all" && (
                          <FiCheck className="size-3.5 text-primary shrink-0" />
                        )}
                      </button>
                    )}

                    {(!campSearchTerm.trim() ||
                      "all camps".includes(
                        campSearchTerm.toLowerCase().trim(),
                      )) && <div className="my-1 border-t border-slate-100" />}

                    {/* Loading State */}
                    {isCampsLoading && (
                      <div className="px-3 py-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <span className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <span>Loading camps...</span>
                      </div>
                    )}

                    {/* Dynamic Camps */}
                    {!isCampsLoading &&
                      filteredCampOptions.length > 0 &&
                      filteredCampOptions.map((camp) => {
                        const val = camp.id ?? camp.value;
                        const isSelected =
                          String(selectedCampFilter) === String(val);
                        const campName =
                          camp.name || camp.camp_name || camp.label;

                        return (
                          <button
                            key={val}
                            type="button"
                            onClick={() => {
                              onCampFilterChange(val);
                              setIsCampDropdownOpen(false);
                              setCampSearchTerm("");
                            }}
                            className={cn(
                              "w-full text-left px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer group",
                              isSelected
                                ? "bg-primary/10 text-primary font-bold"
                                : "hover:bg-slate-50 text-slate-700",
                            )}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <CampAvatar
                                logo={camp.logo}
                                name={campName}
                                size="size-5"
                              />
                              <span className="truncate" title={campName}>
                                {campName}
                              </span>
                            </div>
                            {isSelected && (
                              <FiCheck className="size-3.5 text-primary shrink-0" />
                            )}
                          </button>
                        );
                      })}

                    {/* Empty State */}
                    {!isCampsLoading && filteredCampOptions.length === 0 && (
                      <div className="px-3 py-3 text-center text-xs text-slate-400">
                        {campSearchTerm
                          ? `No camps matching "${campSearchTerm}"`
                          : "No specific camps available"}
                      </div>
                    )}
                  </div>
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
                  : "bg-slate-100/90 hover:bg-slate-200/80 text-slate-600",
              )}
              title="Mention Referee or Evaluator (@)"
              aria-label="Mention Referee or Evaluator"
              aria-expanded={isMentionMenuOpen}
              disabled={isTyping}
            >
              <FiAtSign className="size-3 sm:size-3.5" />
              <span className="hidden sm:inline">Mention</span>
            </button>
          </div>

          {/* Action controls: Quota Progress Circle & Send Button */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <AiQuotaCircle quota={quota} />

            <button
              type="submit"
              disabled={!inputValue.trim() || isTyping || isQuotaBlocked}
              aria-label="Send message"
              title={
                isQuotaBlocked
                  ? "Monthly AI query quota reached"
                  : "Send message"
              }
              className="size-7 sm:size-8 md:size-9 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-white rounded-full flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:cursor-not-allowed"
            >
              <FiArrowUp className="size-3.5 sm:size-4" />
            </button>
          </div>
        </div>
      </form>

      <p className="text-[10px] sm:text-[11px] text-center text-slate-400">
        Type <strong>@</strong> to mention a referee or evaluator. Queries are
        scoped to the selected camp.
      </p>
    </div>
  );
};

export default AiChatInput;
