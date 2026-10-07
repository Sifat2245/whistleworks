import { useState, useEffect, useRef } from "react";
import { FiUser, FiFileText, FiArrowLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { cn } from "@/lib/utils";

const AiMentionMenu = ({
  isOpen,
  onClose,
  onSelectMention,
  referees = [],
  evaluators = [],
  searchTerm = "",
}) => {
  const [activeCategory, setActiveCategory] = useState(null); // null | "referee" | "evaluator"
  const [internalSearch, setInternalSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef(null);

  // Reset category and search when opening/closing
  useEffect(() => {
    if (!isOpen) {
      setActiveCategory(null);
      setInternalSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Click outside to close
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

  if (!isOpen) return null;

  const query = (internalSearch || searchTerm).toLowerCase().replace(/^@/, "");

  // Filter lists
  const filteredReferees = referees.filter(
    (ref) =>
      ref.name.toLowerCase().includes(query) ||
      ref.certifiedLevel?.toLowerCase().includes(query)
  );

  const filteredEvaluators = evaluators.filter(
    (ev) =>
      ev.name.toLowerCase().includes(query) ||
      ev.role?.toLowerCase().includes(query)
  );

  const currentItems =
    activeCategory === "referee"
      ? filteredReferees
      : activeCategory === "evaluator"
      ? filteredEvaluators
      : [
          { id: "referee", label: "Referee", count: referees.length, icon: FiUser, desc: "Officials registered in camp scope" },
          { id: "evaluator", label: "Evaluator", count: evaluators.length, icon: FiFileText, desc: "Evaluator staff in camp scope" },
        ];

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(currentItems.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + currentItems.length) % Math.max(currentItems.length, 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected = currentItems[selectedIndex];
      if (!selected) return;

      if (!activeCategory) {
        setActiveCategory(selected.id);
        setSelectedIndex(0);
      } else {
        onSelectMention(selected.name, activeCategory);
      }
    }
  };

  return (
    <div
      ref={menuRef}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      className="absolute bottom-full left-0 mb-2 w-80 sm:w-96 bg-white border border-slate-200/90 rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      {/* Menu Header */}
      <div className="p-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {activeCategory && (
            <button
              type="button"
              onClick={() => {
                setActiveCategory(null);
                setSelectedIndex(0);
              }}
              className="p-1 rounded-lg hover:bg-slate-200/70 text-slate-600 transition-colors cursor-pointer"
              title="Back to Categories"
              aria-label="Back to Categories"
            >
              <FiArrowLeft className="size-3.5" />
            </button>
          )}
          <span className="text-xs font-bold text-slate-900">
            {activeCategory === "referee"
              ? "Select Referee"
              : activeCategory === "evaluator"
              ? "Select Evaluator"
              : "Mention Context (@)"}
          </span>
        </div>

        {activeCategory && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 capitalize">
            {activeCategory}s
          </span>
        )}
      </div>

      {/* Internal Search input when inside category */}
      {activeCategory && (
        <div className="p-2 border-b border-slate-100 bg-white">
          <div className="relative flex items-center">
            <FiSearch className="absolute left-2.5 size-3.5 text-slate-400" />
            <input
              type="text"
              autoFocus
              value={internalSearch}
              onChange={(e) => {
                setInternalSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder={`Search ${activeCategory}s...`}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary"
            />
          </div>
        </div>
      )}

      {/* Menu List Items */}
      <div className="max-h-60 overflow-y-auto p-1.5 space-y-1">
        {/* Category Level 1 Selection */}
        {!activeCategory &&
          currentItems.map((cat, idx) => {
            const Icon = cat.icon;
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={cat.id}
                type="button"
                aria-label={`Category: ${cat.label}`}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setSelectedIndex(0);
                }}
                className={cn(
                  "w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer text-xs",
                  isSelected
                    ? "bg-slate-100 text-slate-900"
                    : "hover:bg-slate-50 text-slate-700"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Icon className="size-4" />
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">
                      {cat.label}
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      {cat.desc}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200/80 text-slate-600">
                    {cat.count}
                  </span>
                  <FiChevronRight className="size-3.5" />
                </div>
              </button>
            );
          })}

        {/* Level 2: Referee Selection */}
        {activeCategory === "referee" &&
          (filteredReferees.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No referees found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredReferees.map((ref, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={ref.id || ref.name}
                  type="button"
                  aria-label={`Select Official ${ref.name}`}
                  onClick={() => onSelectMention(ref.name, "referee")}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer text-xs",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <FiUser className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 text-xs block truncate">
                        {ref.name}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate block">
                        {ref.certifiedLevel}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 shrink-0 ml-2">
                    {ref.overallScore}/10
                  </span>
                </button>
              );
            })
          ))}

        {/* Level 2: Evaluator Selection */}
        {activeCategory === "evaluator" &&
          (filteredEvaluators.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400">
              No evaluators found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            filteredEvaluators.map((ev, idx) => {
              const isSelected = selectedIndex === idx;
              return (
                <button
                  key={ev.id || ev.name}
                  type="button"
                  aria-label={`Select Evaluator Staff ${ev.name}`}
                  onClick={() => onSelectMention(ev.name, "evaluator")}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer text-xs",
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-slate-50 text-slate-700"
                  )}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="size-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                      <FiFileText className="size-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900 text-xs block truncate">
                        {ev.name}
                      </span>
                      <span className="text-[10px] text-slate-500 truncate block">
                        {ev.role}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80 shrink-0 ml-2">
                    {ev.evalsSubmitted} Evals
                  </span>
                </button>
              );
            })
          ))}
      </div>
    </div>
  );
};

export default AiMentionMenu;
