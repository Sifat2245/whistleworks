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
import { LuTrash2, LuLoaderCircle } from "react-icons/lu";
import Swal from "sweetalert2";
import {
  useRefereeEvaluationHistory,
  useDeleteRefereeEvaluation,
} from "@/hooks/api/useRankings";

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

  const normalizedText = useMemo(() => {
    if (!text || text === "-") return "";
    if (Array.isArray(text)) return text.filter(Boolean).join("\n");
    return String(text);
  }, [text]);

  if (!normalizedText) return <span className="text-gray-400">-</span>;

  const isLong = normalizedText.length > maxLength;

  if (!isLong) {
    return (
      <div className="text-xs text-gray-700 whitespace-pre-line max-w-[220px]">
        {normalizedText}
      </div>
    );
  }

  return (
    <div className="text-xs text-gray-700 max-w-[220px]">
      <Tooltip
        title={!isExpanded ? normalizedText : ""}
        placement="topLeft"
        mouseEnterDelay={0.3}
      >
        <div
          className={
            !isExpanded
              ? "truncate cursor-help"
              : "whitespace-pre-line leading-relaxed"
          }
        >
          {normalizedText}
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
  const refereeId = referee?.referee_id || referee?.id;

  const {
    data: historyPages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useRefereeEvaluationHistory(campId, refereeId, isOpen);

  const deleteMutation = useDeleteRefereeEvaluation(campId, refereeId);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = useCallback(
    (evaluationId) => {
      if (!evaluationId) return;

      Swal.fire({
        title: "Delete Evaluation?",
        text: "Are you sure you want to delete this evaluation? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#64748b",
        confirmButtonText: "Yes, delete",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          setDeletingId(evaluationId);
          deleteMutation.mutate(evaluationId, {
            onSettled: () => {
              setDeletingId(null);
            },
          });
        }
      });
    },
    [deleteMutation],
  );

  const evaluations = useMemo(() => {
    return (
      historyPages?.pages?.flatMap((page) => {
        if (Array.isArray(page)) return page;
        if (Array.isArray(page?.evaluations)) return page.evaluations;
        if (Array.isArray(page?.data)) return page.data;
        if (Array.isArray(page?.history)) return page.history;
        if (Array.isArray(page?.data?.data)) return page.data.data;
        if (Array.isArray(page?.data?.evaluations)) return page.data.evaluations;
        if (
          page &&
          typeof page === "object" &&
          (page.id || page.evaluation_id || page.submitted_at)
        ) {
          return [page];
        }
        return [];
      }) || []
    );
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

  const getCriteriaScore = (row, key) => {
    const orig = row?.original || row;
    const obj =
      orig?.scores || orig?.performance_criteria || orig || {};
    const val = obj[key];
    if (val !== undefined && val !== null && val !== "") {
      const num = Number(val);
      return !isNaN(num) ? num.toFixed(2) : String(val);
    }
    return "–";
  };

  const getOverallScore = (row) => {
    const orig = row?.original || row;
    const val =
      orig?.average_score ??
      orig?.overall ??
      orig?.total_score ??
      orig?.overall_avg;
    if (val !== undefined && val !== null && !isNaN(Number(val))) {
      return Number(val).toFixed(3);
    }
    return "–";
  };

  const getEvaluatorName = (row) => {
    const orig = row?.original || row;
    const ev = orig?.evaluator || orig?.evaluators;
    if (Array.isArray(ev)) {
      return (
        ev
          .map((e) => (typeof e === "object" ? e?.name || e?.email : e))
          .filter(Boolean)
          .join(", ") || "Evaluator"
      );
    }
    if (typeof ev === "object" && ev !== null) {
      return ev.name || ev.email || "Evaluator";
    }
    if (typeof ev === "string" && ev.trim()) {
      return ev;
    }
    return orig?.evaluator_name || "Evaluator";
  };

  const getRecommendedLevel = (row) => {
    const orig = row?.original || row;
    const lvl =
      orig?.recommended_level ||
      orig?.current_recommended_level ||
      orig?.highest_recommended_level ||
      (Array.isArray(orig?.recommended_levels) && orig.recommended_levels[0]);
    if (typeof lvl === "object" && lvl !== null) {
      return (
        lvl.level ||
        lvl.name ||
        String(lvl.sports_type_level_id || lvl.id || "")
      );
    }
    return lvl || "-";
  };

  const getNotesText = (row) => {
    const orig = row?.original || row;
    const val =
      orig?.private_comments ||
      orig?.notes ||
      orig?.comments ||
      orig?.private_notes;
    if (!val) return "";
    if (Array.isArray(val)) return val.filter(Boolean).join("\n");
    return String(val);
  };

  const getFeedbackText = (row) => {
    const orig = row?.original || row;
    const val =
      orig?.referee_feedback ||
      orig?.feedback ||
      orig?.public_comments;
    if (!val) return "";
    if (Array.isArray(val)) return val.filter(Boolean).join("\n");
    return String(val);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "submitted_at",
        header: "Date/Time",
        cell: ({ row }) => {
          const date =
            row.original?.submitted_at || row.original?.created_at || "-";
          return <div className="text-sm text-gray-700">{date}</div>;
        },
      },
      {
        id: "call_accuracy",
        header: "Call/No Call Accuracy",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {getCriteriaScore(row, "call_accuracy")}
          </div>
        ),
      },
      {
        id: "communication_skills",
        header: "Communication Skills",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {getCriteriaScore(row, "communication_skills")}
          </div>
        ),
      },
      {
        id: "consistency_of_calls",
        header: "Consistency of Calls",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {getCriteriaScore(row, "consistency_of_calls")}
          </div>
        ),
      },
      {
        id: "court_position_mechanics",
        header: "Court Position/Mechanics",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {getCriteriaScore(row, "court_position_mechanics")}
          </div>
        ),
      },
      {
        id: "fitness_mobility",
        header: "Fitness/Mobility",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {getCriteriaScore(row, "fitness_mobility")}
          </div>
        ),
      },
      {
        id: "game_awareness",
        header: "Game Awareness",
        cell: ({ row }) => (
          <div className="text-center font-medium">
            {getCriteriaScore(row, "game_awareness")}
          </div>
        ),
      },
      {
        id: "average_score",
        header: "Overall",
        cell: ({ row }) => (
          <div className="text-center">
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 font-bold rounded-full text-sm">
              {getOverallScore(row)}
            </span>
          </div>
        ),
      },
      {
        id: "private_comments",
        header: "Notes for Director",
        cell: ({ row }) => (
          <DesktopExpandableText text={getNotesText(row)} />
        ),
      },
      {
        id: "referee_feedback",
        header: "Referee Feedback",
        cell: ({ row }) => (
          <DesktopExpandableText text={getFeedbackText(row)} />
        ),
      },
      {
        id: "recommended_level",
        header: "Recommended Highest Level of Officiating",
        cell: ({ row }) => (
          <div className="text-center font-medium text-green-700">
            {getRecommendedLevel(row)}
          </div>
        ),
      },
      {
        id: "evaluator",
        header: "Evaluator",
        cell: ({ row }) => (
          <div className="text-sm font-medium text-gray-800">
            {getEvaluatorName(row)}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => {
          const evalId = row.original?.id || row.original?.evaluation_id;
          const isDeleting = deleteMutation.isPending && deletingId === evalId;
          return (
            <div className="flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleDelete(evalId)}
                disabled={deleteMutation.isPending}
                className="p-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Evaluation"
                aria-label="Delete Evaluation"
              >
                {isDeleting ? (
                  <LuLoaderCircle className="w-4 h-4 animate-spin text-red-600" />
                ) : (
                  <LuTrash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          );
        },
      },
    ],
    [handleDelete, deletingId, deleteMutation.isPending],
  );

  const table = useReactTable({
    data: evaluations,
    columns,
    getCoreRowModel: getCoreRowModel(),
    autoResetPageIndex: false,
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

  const refereeName = referee?.name || referee?.referee_name || "Referee";
  const refereeAvatar = referee?.avatar || referee?.referee_avatar || null;
  const rankDisplay = referee?.rank ?? "-";
  const overallRaw =
    referee?.overall_percentage ??
    referee?.overall_avg ??
    referee?.overall ??
    referee?.averages?.overall ??
    0;
  const overallNum = Number(overallRaw);
  const formattedOverall = !isNaN(overallNum) ? overallNum : 0;
  const evalCount = Number(referee?.count ?? referee?.total_evaluations ?? 0);

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
                    src={refereeAvatar}
                    alt={`${refereeName}'s avatar`}
                    className="bg-primary/10 text-primary border-2 border-primary/20"
                  >
                    {!refereeAvatar && refereeName
                      ? refereeName.charAt(0).toUpperCase()
                      : "R"}
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#333] truncate">
                    {refereeName}
                  </h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <BsTrophy className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="text-sm font-bold text-[#333]">
                      Rank #{rankDisplay}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="inline-block px-3 py-1.5 bg-primary/10 text-primary font-bold rounded-full text-sm whitespace-nowrap">
                    {formattedOverall.toFixed(1)}%
                  </span>
                  <p className="text-[11px] text-[#666] mt-1">
                    {evalCount} eval{evalCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              {/* Desktop centered layout */}
              <div className="hidden md:flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <Avatar
                    size={80}
                    src={refereeAvatar}
                    alt={`${refereeName}'s avatar`}
                    className="bg-primary/10 text-primary border-2 border-primary/20 shadow-md"
                  >
                    {!refereeAvatar && refereeName
                      ? refereeName.charAt(0).toUpperCase()
                      : "R"}
                  </Avatar>
                </div>
                <h3 className="text-lg font-semibold text-[#333]">
                  {refereeName}
                </h3>
                <div className="flex items-center gap-3 mt-3">
                  <BsTrophy className="w-6 h-6 text-amber-400" />
                  <span className="text-xl font-bold text-[#333]">
                    Rank #{rankDisplay}
                  </span>
                </div>
                <p className="text-base text-[#666] mt-3">
                  Overall Score:{" "}
                  <span className="font-bold text-base text-primary">
                    {formattedOverall.toFixed(3)}
                  </span>
                </p>
                <p className="text-sm text-[#666]">
                  Based on {evalCount} evaluation
                  {evalCount !== 1 ? "s" : ""}
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
                    {evaluations.map((evalItem, index) => {
                      const avgDisplay = getOverallScore(evalItem);
                      const evaluatorName = getEvaluatorName(evalItem);
                      const recLevel = getRecommendedLevel(evalItem);
                      const notesText = getNotesText(evalItem);
                      const feedbackText = getFeedbackText(evalItem);

                      return (
                        <div
                          key={evalItem?.id || index}
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
                                {evalItem?.submitted_at ||
                                  evalItem?.created_at ||
                                  "-"}
                              </p>
                              <p className="text-xs text-[#666] mt-0.5 truncate">
                                by {evaluatorName}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm">
                                {avgDisplay}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    evalItem?.id || evalItem?.evaluation_id,
                                  )
                                }
                                disabled={deleteMutation.isPending}
                                className="p-1.5 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 transition cursor-pointer disabled:opacity-50"
                                title="Delete Evaluation"
                                aria-label="Delete Evaluation"
                              >
                                {deleteMutation.isPending &&
                                deletingId ===
                                  (evalItem?.id || evalItem?.evaluation_id) ? (
                                  <LuLoaderCircle className="w-4 h-4 animate-spin text-red-600" />
                                ) : (
                                  <LuTrash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
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
                                  {getCriteriaScore(evalItem, s.key)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {recLevel && recLevel !== "-" && (
                            <div className="mt-3 flex items-center gap-2">
                              <span className="text-xs text-[#666]">
                                Recommended:
                              </span>
                              <span className="px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-semibold">
                                {recLevel}
                              </span>
                            </div>
                          )}

                          {notesText && (
                            <div className="mt-3">
                              <p className="text-xs font-semibold text-[#333] mb-1">
                                Notes for Director
                              </p>
                              <p className="text-xs text-[#666] whitespace-pre-line leading-relaxed">
                                {notesText}
                              </p>
                            </div>
                          )}

                          {feedbackText && (
                            <div className="mt-2">
                              <p className="text-xs font-semibold text-[#333] mb-1">
                                Referee Feedback
                              </p>
                              <p className="text-xs text-[#666] whitespace-pre-line leading-relaxed">
                                {feedbackText}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
