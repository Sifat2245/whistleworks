import { AnimatePresence, motion } from "framer-motion";
import { BsTrophy } from "react-icons/bs";
import { MdClose } from "react-icons/md";
import { Avatar, Tooltip } from "antd";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useRefereeEvaluationHistory } from "@/hooks/api/useRankings";

const SCORE_ITEMS = [
  { key: "call_accuracy", label: "Call Accuracy" },
  { key: "communication_skills", label: "Communication" },
  { key: "consistency_of_calls", label: "Consistency" },
  { key: "court_position_mechanics", label: "Mechanics" },
  { key: "fitness_mobility", label: "Fitness/Mobility" },
  { key: "game_awareness", label: "Game Awareness" },
];

const DesktopExpandableText = ({ text, maxLength = 50 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text || text === "-") return <span className="text-gray-400">-</span>;

  const isLong = text.length > maxLength;

  if (!isLong) {
    return <div className="text-xs text-gray-700 whitespace-pre-line max-w-[220px]">{text}</div>;
  }

  return (
    <div className="text-xs text-gray-700 max-w-[220px]">
      <Tooltip title={!isExpanded ? text : ""} placement="topLeft" mouseEnterDelay={0.3}>
        <div className={!isExpanded ? "truncate cursor-help" : "whitespace-pre-line leading-relaxed"}>
          {text}
        </div>
      </Tooltip>
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-[11px] font-semibold text-[#00AEEF] hover:underline mt-1 block cursor-pointer"
      >
        {isExpanded ? "Show Less" : "Show More"}
      </button>
    </div>
  );
};

const RefereeDetailsModal = ({ isOpen, onClose, referee, campId }) => {
  const refereeId = referee?.referee_id;

  const {
    data: historyPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useRefereeEvaluationHistory(campId, refereeId, isOpen);

  const evaluations = useMemo(() => {
    return historyPages?.pages?.flatMap((page) => page.evaluations || []) || [];
  }, [historyPages]);

  const observerRef = useRef();

  const lastEvaluationRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "submitted_at",
        header: "Date/Time",
        cell: ({ row }) => {
          const date = row.original.submitted_at;
          return <div className="text-sm text-gray-700">{date}</div>;
        },
      },
      {
        accessorKey: "scores.call_accuracy",
        header: "Call/No Call Accuracy",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.call_accuracy}
          </div>
        ),
      },
      {
        accessorKey: "scores.communication_skills",
        header: "Communication Skills",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.communication_skills}
          </div>
        ),
      },
      {
        accessorKey: "scores.consistency_of_calls",
        header: "Consistency of Calls",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.consistency_of_calls}
          </div>
        ),
      },
      {
        accessorKey: "scores.court_position_mechanics",
        header: "Court Position/Mechanics",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.court_position_mechanics}
          </div>
        ),
      },
      {
        accessorKey: "scores.fitness_mobility",
        header: "Fitness/Mobility",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.fitness_mobility}
          </div>
        ),
      },
      {
        accessorKey: "scores.game_awareness",
        header: "Game Awareness",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {row.original.scores.game_awareness}
          </div>
        ),
      },
      {
        accessorKey: "average_score",
        header: "Overall",
        cell: ({ row }) => (
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-full text-sm">
              {Number(row.original.average_score).toFixed(3)}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "private_comments",
        header: "Notes for Director",
        cell: ({ row }) => (
          <DesktopExpandableText text={row.original.private_comments} />
        ),
      },
      {
        accessorKey: "referee_feedback",
        header: "Referee Feedback",
        cell: ({ row }) => (
          <DesktopExpandableText text={row.original.referee_feedback} />
        ),
      },
      {
        accessorKey: "recommended_level",
        header: "Recommended Highest Level of Officiating",
        cell: ({ row }) => (
          <div className="text-center font-medium text-green-700">
            {row.original.recommended_level || "-"}
          </div>
        ),
      },
      {
        accessorKey: "evaluator.name",
        header: "Evaluator",
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-800">
            {row.original.evaluator.name}
          </div>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: evaluations,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!referee) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Referee performance details"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl max-w-8xl w-full my-8 max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-5 py-4 border-b border-border bg-primary/5 shrink-0">
              <h2 className="text-lg font-semibold text-[#333]">
                Referee Performance Details
              </h2>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 -mr-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition cursor-pointer"
              >
                <MdClose className="w-5 h-5" />
              </button>
            </div>

            {/* Summary Section — compact horizontal on mobile, centered on desktop */}
            <div className="p-3 sm:p-4 bg-[#FAFAFA] shrink-0">
              {/* Mobile compact layout */}
              <div className="md:hidden flex items-center gap-3">
                <div className="relative shrink-0">
                  <Avatar
                    size={44}
                    src={referee?.avatar}
                    alt={`${referee?.name}'s avatar`}
                    className="bg-primary/10 text-primary border-2 border-primary/20"
                  >
                    {!referee?.avatar && referee?.name
                      ? referee.name.charAt(0).toUpperCase()
                      : "R"}
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#333] truncate">
                    {referee.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <BsTrophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-sm font-bold text-[#333]">
                      Rank #{referee.rank}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-full text-sm whitespace-nowrap">
                    {referee.overall_percentage.toFixed(1)}%
                  </span>
                  <p className="text-[11px] text-[#666] mt-1">
                    {referee.count} eval{referee.count > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Desktop centered layout */}
              <div className="hidden md:flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <Avatar
                    size={80}
                    src={referee?.avatar}
                    alt={`${referee?.name}'s avatar`}
                    className="bg-primary/10 text-primary border-2 border-primary/20 shadow-md"
                  >
                    {!referee?.avatar && referee?.name
                      ? referee.name.charAt(0).toUpperCase()
                      : "R"}
                  </Avatar>
                </div>
                <h3 className="text-lg font-semibold text-[#333]">
                  {referee.name}
                </h3>
                <div className="flex items-center gap-3 mt-3">
                  <BsTrophy className="w-6 h-6 text-amber-400" />
                  <span className="text-xl font-bold text-[#333]">
                    Rank #{referee.rank}
                  </span>
                </div>
                <p className="text-base text-[#666] mt-3">
                  Overall Score:{" "}
                  <span className="font-bold text-base text-primary">
                    {referee.overall_percentage.toFixed(3)}
                  </span>
                </p>
                <p className="text-sm text-[#666]">
                  Based on {referee.count} evaluation
                  {referee.count > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Evaluations Table */}
            <div className="p-4 sm:p-6 flex-1 min-h-0 flex flex-col">
              <h3 className="text-lg font-semibold text-[#333] mb-4 shrink-0">
                Evaluation History ({evaluations?.length})
              </h3>

              {isLoading ? (
                <div className="text-center py-12 text-[#666]">
                  Loading evaluations...
                </div>
              ) : evaluations?.length === 0 ? (
                <div className="text-center py-12 text-[#666]">
                  No evaluations found.
                </div>
              ) : (
                <>
                  {/* Desktop table (md+) */}
                  <div className="hidden md:block min-h-0 overflow-auto border border-border rounded-[10px]">
                    <table className="w-full min-w-[1400px]">
                      <thead className="bg-[#FAFAFA] border-b border-border sticky top-0">
                        {table.getHeaderGroups().map((headerGroup) => (
                          <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => (
                              <th
                                key={header.id}
                                className="px-5 py-3 text-left text-xs font-semibold text-[#666] uppercase tracking-wider whitespace-nowrap"
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                              </th>
                            ))}
                          </tr>
                        ))}
                      </thead>
                      <tbody className="divide-y divide-border">
                        {table.getRowModel().rows.map((row, index) => (
                          <tr
                            key={row.id}
                            ref={
                              index === evaluations.length - 5
                                ? lastEvaluationRef
                                : null
                            }
                            className="hover:bg-primary/[0.03] transition-colors"
                          >
                            {row.getVisibleCells().map((cell) => (
                              <td key={cell.id} className="px-4 py-4 text-sm">
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile cards (below md) */}
                  <div className="md:hidden min-h-0 overflow-y-auto flex flex-col gap-3 pr-0.5">
                    {evaluations.map((evalItem, index) => (
                      <div
                        key={evalItem.id || index}
                        ref={
                          index === evaluations.length - 5
                            ? lastEvaluationRef
                            : null
                        }
                        className="bg-white border border-border rounded-[10px] p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#333]">
                              {evalItem.submitted_at}
                            </p>
                            <p className="text-xs text-[#666] mt-0.5 truncate">
                              by {evalItem.evaluator?.name || "Evaluator"}
                            </p>
                          </div>
                          <span className="shrink-0 inline-block px-3 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm">
                            {Number(evalItem.average_score).toFixed(3)}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2">
                          {SCORE_ITEMS.map((s) => (
                            <div
                              key={s.key}
                              className="flex items-center justify-between gap-2 rounded-lg bg-[#FAFAFA] border border-border px-3 py-2"
                            >
                              <span className="text-xs text-[#666] truncate">
                                {s.label}
                              </span>
                              <span className="text-sm font-semibold text-[#333]">
                                {evalItem.scores?.[s.key] ?? "–"}
                              </span>
                            </div>
                          ))}
                        </div>

                        {evalItem.recommended_level && (
                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-xs text-[#666]">
                              Recommended:
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                              {evalItem.recommended_level}
                            </span>
                          </div>
                        )}

                        {evalItem.private_comments && (
                          <div className="mt-3">
                            <p className="text-xs font-semibold text-[#333] mb-1">
                              Notes for Director
                            </p>
                            <p className="text-xs text-[#666] whitespace-pre-line leading-relaxed">
                              {evalItem.private_comments}
                            </p>
                          </div>
                        )}

                        {evalItem.referee_feedback && (
                          <div className="mt-2">
                            <p className="text-xs font-semibold text-[#333] mb-1">
                              Referee Feedback
                            </p>
                            <p className="text-xs text-[#666] whitespace-pre-line leading-relaxed">
                              {evalItem.referee_feedback}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Infinite scroll footer */}
                  {isFetchingNextPage && (
                    <div className="py-4 text-center text-[#666] text-sm shrink-0">
                      Loading more evaluations...
                    </div>
                  )}

                  {!hasNextPage && evaluations.length > 0 && (
                    <div className="py-4 text-center text-gray-400 text-sm shrink-0">
                      End of evaluation history
                    </div>
                  )}
                </>
              )}
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RefereeDetailsModal;
