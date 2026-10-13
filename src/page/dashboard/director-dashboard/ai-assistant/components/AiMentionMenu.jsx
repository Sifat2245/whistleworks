import { useState, useEffect, useRef } from "react";
import {
  FiUser,
  FiFileText,
  FiArrowLeft,
  FiChevronRight,
  FiSearch,
  FiX,
} from "react-icons/fi";
import { cn } from "@/lib/utils";
import { useGetAiParticipants } from "@/hooks/api/director-hooks/useAiChat";

const AiMentionMenu = ({
  id,
  isOpen,
  onClose,
  onSelectMention,
  searchTerm = "",
  selectedCampFilter = "all",
  campName = "",
}) => {
  const [activeCategory, setActiveCategory] = useState(null); // null | "referee" | "evaluator"
  const [internalSearch, setInternalSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuRef = useRef(null);
  const listContainerRef = useRef(null);

  // Debounce search input
  useEffect(() => {
    const raw = (internalSearch || searchTerm || "").replace(/^@/, "").trim();
    const handler = setTimeout(() => {
      setDebouncedSearch(raw);
    }, 250);
    return () => clearTimeout(handler);
  }, [internalSearch, searchTerm]);

  // Reset category and search when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setActiveCategory(null);
      setInternalSearch("");
      setDebouncedSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset search and selection when changing category
  const handleCategorySelect = (categoryId) => {
    setActiveCategory(categoryId);
    setInternalSearch("");
    setDebouncedSearch("");
    setSelectedIndex(0);
    if (listContainerRef.current) {
      listContainerRef.current.scrollTop = 0;
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Query participants using dedicated AI Chat hook with infinite pagination
  const {
    participants = [],
    total,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useGetAiParticipants({
    role: activeCategory,
    campId: selectedCampFilter !== "all" ? selectedCampFilter : undefined,
    search: debouncedSearch,
    enabled: Boolean(isOpen && activeCategory),
  });

  if (!isOpen) return null;

  const displayItems = participants;

  // Category Level 1 options
  const categoryOptions = [
    {
      id: "referee",
      label: "Referee",
      icon: FiUser,
      desc:
        selectedCampFilter !== "all" && campName
          ? `Referees in ${campName}`
          : "Officials registered across camps",
    },
    {
      id: "evaluator",
      label: "Evaluator",
      icon: FiFileText,
      desc:
        selectedCampFilter !== "all" && campName
          ? `Evaluators in ${campName}`
          : "Evaluator staff across camps",
    },
  ];

  const currentNavItems = activeCategory ? displayItems : categoryOptions;

  // Infinite scroll on container
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (
      scrollHeight - scrollTop - clientHeight < 60 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.closest("button")) return;
    if (e.key === "Escape") {
      e.preventDefault();
      if (activeCategory) {
        setActiveCategory(null);
        setInternalSearch("");
        setSelectedIndex(0);
      } else {
        onClose();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = (selectedIndex + 1) % Math.max(currentNavItems.length, 1);
      setSelectedIndex(next);
      menuRef.current?.querySelectorAll("[data-mention-option]")[next]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const next =
        (selectedIndex - 1 + currentNavItems.length) %
        Math.max(currentNavItems.length, 1);
      setSelectedIndex(next);
      menuRef.current?.querySelectorAll("[data-mention-option]")[next]?.focus();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = currentNavItems[selectedIndex];
      if (!selected) return;

      if (!activeCategory) {
        handleCategorySelect(selected.id);
      } else {
        onSelectMention(selected.name, activeCategory, selected);
      }
    }
  };

  return (
    <div
      id={id}
      ref={menuRef}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      className="absolute bottom-full left-0 mb-2 w-80 sm:w-96 bg-white border border-slate-200/90 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      {/* ── Menu Header ─────────────────────────────────────── */}
      <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {activeCategory && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory(null);
                setInternalSearch("");
                setSelectedIndex(0);
              }}
              className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-600 transition-colors cursor-pointer shrink-0"
              title="Back to Categories"
              aria-label="Back to Categories"
            >
              <FiArrowLeft className="size-3.5" />
            </button>
          )}
          <span className="text-xs font-bold text-slate-900 truncate">
            {activeCategory === "referee"
              ? "Select Referee"
              : activeCategory === "evaluator"
                ? "Select Evaluator"
                : "Mention Context (@)"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {activeCategory && total !== undefined && total > 0 && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {total} total
            </span>
          )}
          {activeCategory && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
              {activeCategory}s
            </span>
          )}
          {!activeCategory && selectedCampFilter !== "all" && campName && (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-600 max-w-[130px] truncate">
              {campName}
            </span>
          )}
        </div>
      </div>

      {/* ── Search Input when inside a category ─────────────── */}
      {activeCategory && (
        <div className="p-2 border-b border-slate-100 bg-white">
          <div className="relative flex items-center">
            <FiSearch className="absolute left-2.5 size-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              autoFocus
              value={internalSearch}
              onChange={(e) => {
                setInternalSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder={`Search ${activeCategory}s...`}
              aria-label={`Search ${activeCategory}s`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary transition-all"
            />
            {internalSearch && (
              <button
                type="button"
                onClick={() => {
                  setInternalSearch("");
                  setSelectedIndex(0);
                }}
                className="absolute right-2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                aria-label="Clear search"
              >
                <FiX className="size-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Scrollable Menu List Items ───────────────────────── */}
      <div
        ref={listContainerRef}
        onScroll={handleScroll}
        className="max-h-60 sm:max-h-64 overflow-y-auto p-1.5 space-y-1 overscroll-contain"
      >
        {/* Level 1: Category Selection */}
        {!activeCategory &&
          categoryOptions.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={cat.id}
                type="button"
                aria-label={`Category: ${cat.label}`}
                data-mention-option
                onFocus={() => setSelectedIndex(idx)}
                onClick={() => handleCategorySelect(cat.id)}
                className={cn(
                  "w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer text-xs",
                  isSelected
                    ? "bg-slate-100 text-slate-900"
                    : "hover:bg-slate-50 text-slate-700",
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-xs block truncate">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal truncate block">
                      {cat.desc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400 shrink-0">
                  <FiChevronRight className="size-3.5" />
                </div>
              </button>
            );
          })}

        {/* Level 2: Initial Loading State */}
        {activeCategory && isLoading && displayItems.length === 0 && (
          <div className="py-8 flex flex-col items-center justify-center gap-2 text-slate-400">
            <span className="size-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-xs">Loading {activeCategory}s...</span>
          </div>
        )}

        {/* Level 2: Participants List */}
        {activeCategory &&
          displayItems.map((item, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={item.id ? `${activeCategory}-${item.id}` : item.name}
                data-mention-option
                onFocus={() => setSelectedIndex(idx)}
                type="button"
                aria-label={
                  activeCategory === "referee"
                    ? `Select Official ${item.name}`
                    : `Select Evaluator Staff ${item.name}`
                }
                onClick={() => onSelectMention(item.name, activeCategory, item)}
                className={cn(
                  "w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer text-xs group",
                  isSelected
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-slate-50 text-slate-700",
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {item.avatar ? (
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="size-7 rounded-full object-cover shrink-0 border border-slate-200 bg-slate-100"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        if (e.currentTarget.nextElementSibling) {
                          e.currentTarget.nextElementSibling.style.display =
                            "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    style={{ display: item.avatar ? "none" : "flex" }}
                    className="size-7 rounded-full bg-slate-100 text-slate-700 items-center justify-center shrink-0 font-bold text-xs border border-slate-200"
                  >
                    {item.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-slate-900 text-xs block truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-500 truncate block capitalize">
                      {item.certifiedLevel ||
                        item.role ||
                        (activeCategory === "referee"
                          ? "Official"
                          : "Evaluator")}
                    </span>
                  </div>
                </div>

                <span
                  className={cn(
                    "text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0 ml-2 capitalize",
                    activeCategory === "referee"
                      ? "text-emerald-700 bg-emerald-50 border-emerald-200/80"
                      : "text-blue-700 bg-blue-50 border-blue-200/80",
                  )}
                >
                  {item.overallScore
                    ? `${item.overallScore}/10`
                    : activeCategory === "referee"
                      ? "Referee"
                      : "Evaluator"}
                </span>
              </button>
            );
          })}

        {/* Level 2: Loading More Spinner (Infinite Scroll) */}
        {activeCategory && isFetchingNextPage && (
          <div className="py-2 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <span className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[11px] font-medium">
              Loading more {activeCategory}s...
            </span>
          </div>
        )}

        {/* Level 2: Empty State */}
        {activeCategory && !isLoading && displayItems.length === 0 && (
          <div className="py-6 text-center text-xs text-slate-400">
            {debouncedSearch
              ? `No ${activeCategory}s found matching "${debouncedSearch}"`
              : `No ${activeCategory}s available in this scope`}
          </div>
        )}
      </div>
    </div>
  );
};

export default AiMentionMenu;
