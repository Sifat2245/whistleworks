import { Modal, Spin } from "antd";
import { useEvaluationDetails } from "@/hooks/api/useEvaluation";
import {
  LuTarget,
  LuMessageSquareText,
  LuScale,
  LuFootprints,
  LuActivity,
  LuEye,
  LuLock,
  LuMessageSquare,
  LuAward,
  LuCalendar,
  LuUserCheck,
} from "react-icons/lu";

const CRITERIA_MAP = [
  {
    key: "call_accuracy",
    label: "Call / No Call Accuracy",
    hint: "Correct decisions on plays",
    icon: <LuTarget />,
  },
  {
    key: "communication_skills",
    label: "Communication Skills",
    hint: "Clarity with players & coaches",
    icon: <LuMessageSquareText />,
  },
  {
    key: "consistency_of_calls",
    label: "Consistency of Calls",
    hint: "Uniformity throughout the game",
    icon: <LuScale />,
  },
  {
    key: "court_position_mechanics",
    label: "Court Position & Mechanics",
    hint: "Positioning & movement",
    icon: <LuFootprints />,
  },
  {
    key: "fitness_mobility",
    label: "Fitness & Mobility",
    hint: "Endurance & agility",
    icon: <LuActivity />,
  },
  {
    key: "game_awareness",
    label: "Game Awareness",
    hint: "Reading the flow of play",
    icon: <LuEye />,
  },
];

export default function EvaluationDetailsModal({
  isOpen,
  onClose,
  evaluationId,
  initialData = null,
}) {
  const { data: detailData, isLoading } = useEvaluationDetails(evaluationId, {
    enabled: !!evaluationId && isOpen,
  });

  const evaluation = detailData || initialData;
  const referee = evaluation?.referee;
  const evaluator = evaluation?.evaluator;
  const criteria = evaluation?.performance_criteria || {};
  const recommendedLevel =
    evaluation?.current_recommended_level ||
    evaluation?.recommended_level ||
    "N/A";

  const totalScore = evaluation?.total_score ?? 0;
  const maxScore = evaluation?.max_score ?? 60;
  const averageScore = evaluation?.average_score ?? 0;
  const percentage = evaluation?.percentage ?? Math.round((totalScore / maxScore) * 100);

  const submittedAt = evaluation?.submitted_at
    ? new Date(evaluation.submitted_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      destroyOnClose
      className="custom-evaluation-modal"
    >
      <div className="font-sans py-2">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img
              src={referee?.avatar || "/default-avatar.png"}
              alt={referee?.name || "Referee"}
              className="w-12 h-12 rounded-full object-cover border-2 border-slate-200 shadow-xs"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {referee?.name || "Referee Official"}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                  {evaluation?.status || "Submitted"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{referee?.email}</p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-500 space-y-0.5">
            <div className="flex items-center sm:justify-end gap-1.5 text-slate-700 font-medium">
              <LuUserCheck className="text-slate-400" />
              <span>
                By: {evaluator?.name || "Evaluator"} (
                <span className="capitalize">{evaluator?.role || "Staff"}</span>)
              </span>
            </div>
            <div className="flex items-center sm:justify-end gap-1.5 text-slate-400">
              <LuCalendar className="text-slate-400" />
              <span>{submittedAt}</span>
            </div>
          </div>
        </div>

        {isLoading && !initialData ? (
          <div className="py-16 flex justify-center items-center">
            <Spin size="large" />
          </div>
        ) : (
          <div className="mt-5 space-y-6">
            {/* ── Summary Banner ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gradient-to-br from-slate-50 to-blue-50/40 p-4 rounded-xl border border-blue-100/70">
              <div className="text-center sm:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Total Score
                </p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  <span className="text-[#00AEEF]">{totalScore}</span>
                  <span className="text-xs text-slate-400 font-normal"> / {maxScore}</span>
                </p>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Average Rating
                </p>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  {averageScore}
                  <span className="text-xs text-slate-400 font-normal"> / 10</span>
                </p>
              </div>

              <div className="text-center sm:text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Performance
                </p>
                <p className="text-xl font-bold text-emerald-600 mt-0.5">
                  {percentage}%
                </p>
              </div>

              <div className="text-center sm:text-left col-span-2 sm:col-span-1">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Recommended Level
                </p>
                <div className="inline-flex items-center gap-1 mt-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs">
                  <LuAward className="text-amber-500" />
                  <span className="truncate">{recommendedLevel}</span>
                </div>
              </div>
            </div>

            {/* ── Criteria Breakdown ── */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Performance Criteria Breakdown
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CRITERIA_MAP.map((item) => {
                  const score = criteria[item.key] ?? "—";
                  const scoreNum = Number(score) || 0;
                  const scorePercent = Math.min(100, Math.max(0, (scoreNum / 10) * 100));

                  return (
                    <div
                      key={item.key}
                      className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[#00AEEF] text-base">{item.icon}</span>
                          <div>
                            <p className="text-xs font-semibold text-slate-800">
                              {item.label}
                            </p>
                            <p className="text-[10px] text-slate-400">{item.hint}</p>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                          {score} / 10
                        </span>
                      </div>

                      {/* Progress line */}
                      <div className="w-full bg-slate-200 rounded-full h-1.5 mt-2.5 overflow-hidden">
                        <div
                          className="bg-[#00AEEF] h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${scorePercent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Written Remarks ── */}
            <div className="space-y-3">
              {/* Private Comments */}
              <div className="bg-amber-50/50 border border-amber-200/70 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1.5">
                  <LuLock className="text-amber-600" />
                  <span>Private Comments (Visible only to Director & Evaluators)</span>
                </div>
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {evaluation?.private_comments || (
                    <span className="text-slate-400 italic">No private comments provided.</span>
                  )}
                </p>
              </div>

              {/* Referee Feedback */}
              <div className="bg-blue-50/50 border border-blue-200/70 rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-1.5">
                  <LuMessageSquare className="text-blue-600" />
                  <span>Referee Feedback (Shared with referee)</span>
                </div>
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {evaluation?.referee_feedback || (
                    <span className="text-slate-400 italic">No feedback entered for referee.</span>
                  )}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
