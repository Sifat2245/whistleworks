import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Spin } from "antd";
import Swal from "sweetalert2";
import {
  useMyEvaluations,
  useDeleteEvaluation,
} from "@/hooks/api/useEvaluation";
import EvaluationStatsCards from "./EvaluationStatsCards";
import EvaluationDetailsModal from "./EvaluationDetailsModal";
import EditEvaluationModal from "./EditEvaluationModal";
import PaginationV2 from "@/components/common/PaginationV2";
import {
  LuSearch,
  LuPlus,
  LuEye,
  LuPencil,
  LuTrash2,
  LuAward,
  LuRefreshCw,
  LuUserCheck,
  LuClipboardList,
} from "react-icons/lu";

export default function EvaluationsList({
  campId,
  campName,
  evaluatePath,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const [editingEvaluation, setEditingEvaluation] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const {
    camp,
    evaluations = [],
    overall_level_summary = [],
    statistics = {},
    pagination = {},
    isLoading,
    isFetching,
    refetch,
  } = useMyEvaluations(campId, currentPage);

  const { mutate: deleteEvaluation, isPending: isDeleting } =
    useDeleteEvaluation(campId, {
      onSuccess: () => {
        refetch();
      },
    });

  // Filter evaluations locally by referee name/email if search query is provided
  const filteredEvaluations = useMemo(() => {
    if (!searchQuery.trim()) return evaluations;
    const query = searchQuery.toLowerCase().trim();
    return evaluations.filter((ev) => {
      const name = ev?.referee?.name?.toLowerCase() || "";
      const email = ev?.referee?.email?.toLowerCase() || "";
      const level = (
        ev?.current_recommended_level ||
        ev?.recommended_level ||
        ""
      ).toLowerCase();
      return (
        name.includes(query) || email.includes(query) || level.includes(query)
      );
    });
  }, [evaluations, searchQuery]);

  const handleDelete = (evaluation) => {
    const refereeName = evaluation?.referee?.name || "this referee";
    Swal.fire({
      title: "Delete Evaluation?",
      text: `Are you sure you want to delete the evaluation for ${refereeName}? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteEvaluation(evaluation.id);
      }
    });
  };

  const handleOpenDetails = (evaluation) => {
    setSelectedEvaluation(evaluation);
    setIsDetailsOpen(true);
  };

  const handleOpenEdit = (evaluation) => {
    setEditingEvaluation(evaluation);
    setIsEditOpen(true);
  };

  const displayName = camp?.name || campName || "Camp";

  return (
    <div className="w-full font-sans space-y-6">
      {/* ── Statistics Overview Cards ── */}
      <EvaluationStatsCards
        statistics={statistics}
        overallLevelSummary={overall_level_summary}
      />

      {/* ── Main Container ── */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-5">
        {/* Top Control Bar: Search + Evaluate Referee CTA */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-base pointer-events-none" />
            <input
              type="text"
              placeholder="Search by referee name or level..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-[#00AEEF] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => refetch()}
              title="Refresh evaluations"
              className="p-2 sm:px-3 sm:py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LuRefreshCw
                className={`text-sm ${isFetching ? "animate-spin text-[#00AEEF]" : ""}`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            {evaluatePath && (
              <Link
                to={evaluatePath}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold rounded-lg bg-[#00AEEF] hover:bg-[#0099d4] text-white shadow-xs transition-all cursor-pointer shrink-0"
              >
                <LuPlus className="text-base" />
                <span>Evaluate Referee</span>
              </Link>
            )}
          </div>
        </div>

        {/* ── Evaluations Content ── */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Spin size="large" />
            <p className="text-xs text-slate-500 font-medium">Loading evaluations...</p>
          </div>
        ) : filteredEvaluations.length === 0 ? (
          <div className="py-16 px-4 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/40">
            <div className="w-14 h-14 mx-auto rounded-full bg-blue-50 text-[#00AEEF] flex items-center justify-center text-2xl mb-3 border border-blue-100">
              <LuClipboardList />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              {searchQuery ? "No matching evaluations found" : "No Evaluations Submitted Yet"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
              {searchQuery
                ? `No referee evaluations match "${searchQuery}". Try a different keyword.`
                : `You haven't submitted any evaluations for ${displayName} yet. Evaluate registered referee officials to record mechanics, game control, and level recommendations.`}
            </p>
            {evaluatePath && (
              <Link
                to={evaluatePath}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#00AEEF] hover:bg-[#0099d4] text-white shadow-xs transition-all"
              >
                <LuUserCheck className="text-base" />
                <span>Evaluate First Referee</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-200/80">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Referee</th>
                    <th className="py-3 px-4">Performance Score</th>
                    <th className="py-3 px-4">Recommended Level</th>
                    <th className="py-3 px-4">Evaluator</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredEvaluations.map((ev) => {
                    const referee = ev?.referee;
                    const evaluator = ev?.evaluator;
                    const totalScore = ev?.total_score ?? 0;
                    const maxScore = ev?.max_score ?? 60;
                    const avgScore = ev?.average_score ?? 0;
                    const percentage = ev?.percentage ?? Math.round((totalScore / maxScore) * 100);
                    const recommendedLevel =
                      ev?.current_recommended_level ||
                      ev?.recommended_level ||
                      "—";
                    const formattedDate = ev?.submitted_at
                      ? new Date(ev.submitted_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "—";

                    return (
                      <tr
                        key={ev.id}
                        className="hover:bg-slate-50/70 transition-colors"
                      >
                        {/* Referee Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={referee?.avatar || "/default-avatar.png"}
                              alt={referee?.name || "Referee"}
                              className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                              onError={(e) => {
                                e.target.src = "/default-avatar.png";
                              }}
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 leading-tight truncate">
                                {referee?.name || "Unknown Referee"}
                              </p>
                              <p className="text-xs text-slate-400 truncate mt-0.5">
                                {referee?.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Performance Score */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-slate-900">
                                {totalScore}
                                <span className="text-xs font-normal text-slate-400">
                                  {" "}/ {maxScore}
                                </span>
                              </span>
                              <span className="text-[11px] font-bold px-1.5 py-0.2 rounded-md bg-blue-50 text-[#00AEEF]">
                                {avgScore} / 10
                              </span>
                            </div>
                            <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-[#00AEEF] h-1.5 rounded-full"
                                style={{
                                  width: `${Math.min(100, Math.max(0, percentage))}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        {/* Recommended Level */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80">
                            <LuAward className="text-amber-500 shrink-0" />
                            <span className="truncate max-w-[140px]">{recommendedLevel}</span>
                          </span>
                        </td>

                        {/* Evaluator */}
                        <td className="py-3.5 px-4">
                          <p className="text-xs font-semibold text-slate-700">
                            {evaluator?.name || "Staff"}
                          </p>
                          <span className="text-[11px] text-slate-400 capitalize">
                            {evaluator?.role || "Evaluator"}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                          {formattedDate}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenDetails(ev)}
                              title="View details"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:text-[#00AEEF] text-slate-600 transition-colors cursor-pointer"
                            >
                              <LuEye className="text-base" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(ev)}
                              title="Edit evaluation"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:text-amber-600 text-slate-600 transition-colors cursor-pointer"
                            >
                              <LuPencil className="text-base" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(ev)}
                              disabled={isDeleting}
                              title="Delete evaluation"
                              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-red-50 hover:text-red-600 text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <LuTrash2 className="text-base" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-3">
              {filteredEvaluations.map((ev) => {
                const referee = ev?.referee;
                const totalScore = ev?.total_score ?? 0;
                const maxScore = ev?.max_score ?? 60;
                const avgScore = ev?.average_score ?? 0;
                const recommendedLevel =
                  ev?.current_recommended_level ||
                  ev?.recommended_level ||
                  "—";
                const formattedDate = ev?.submitted_at
                  ? new Date(ev.submitted_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  : "—";

                return (
                  <div
                    key={ev.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={referee?.avatar || "/default-avatar.png"}
                          alt={referee?.name || "Referee"}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                          onError={(e) => {
                            e.target.src = "/default-avatar.png";
                          }}
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">
                            {referee?.name}
                          </p>
                          <p className="text-xs text-slate-500">{referee?.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-400">{formattedDate}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs">
                      <div>
                        <span className="text-slate-500">Score: </span>
                        <strong className="text-slate-900">
                          {totalScore}/{maxScore}
                        </strong>{" "}
                        <span className="text-[#00AEEF]">({avgScore}/10)</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200/80">
                        {recommendedLevel}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200/60">
                      <button
                        type="button"
                        onClick={() => handleOpenDetails(ev)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 flex items-center gap-1 cursor-pointer"
                      >
                        <LuEye className="text-sm" /> View
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ev)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-amber-700 flex items-center gap-1 cursor-pointer"
                      >
                        <LuPencil className="text-sm" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(ev)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-red-600 flex items-center gap-1 cursor-pointer"
                      >
                        <LuTrash2 className="text-sm" /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {pagination?.total > (pagination?.per_page || 15) && (
              <div className="pt-4">
                <PaginationV2
                  currentPage={pagination.current_page || currentPage}
                  perPage={pagination.per_page || 15}
                  totalItem={pagination.total || filteredEvaluations.length}
                  handlePageClick={(p) => setCurrentPage(p)}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── View Details Modal ── */}
      <EvaluationDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false);
          setSelectedEvaluation(null);
        }}
        evaluationId={selectedEvaluation?.id}
        initialData={selectedEvaluation}
      />

      {/* ── Edit Evaluation Modal ── */}
      <EditEvaluationModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingEvaluation(null);
        }}
        evaluation={editingEvaluation}
        campId={campId}
      />
    </div>
  );
}
