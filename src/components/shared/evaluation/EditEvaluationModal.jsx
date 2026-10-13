import { useEffect } from "react";
import { Modal, Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import {
  useRecommendedLevels,
  useUpdateEvaluation,
  buildEvaluationFormData,
} from "@/hooks/api/useEvaluation";
import LoaderV2 from "@/components/common/LoaderV2";
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
} from "react-icons/lu";

const CRITERIA_CONFIG = [
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

const EditScoreSelector = ({ value, onChange, label, hint, icon, error }) => (
  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2.5 font-sans">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[#00AEEF] text-base">{icon}</span>
        <div>
          <p className="font-semibold text-slate-800 text-xs sm:text-sm leading-tight">
            {label}
          </p>
          {hint && <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>}
        </div>
      </div>
      {value ? (
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#00AEEF] border border-blue-100">
          {value} / 10
        </span>
      ) : (
        <span className="text-xs text-slate-400">1-10</span>
      )}
    </div>

    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 pt-0.5">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
        const isSelected = Number(value) === num;
        return (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
              isSelected
                ? "bg-[#00AEEF] text-white border-[#00AEEF] shadow-2xs scale-105"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {num}
          </button>
        );
      })}
    </div>
    {error && <p className="text-xs text-red-500 font-medium">{error.message}</p>}
  </div>
);

export default function EditEvaluationModal({
  isOpen,
  onClose,
  evaluation,
  campId,
}) {
  const activeCampId = campId || evaluation?.camp_id || evaluation?.camp?.id;
  const { data: recommendedLevels = [], isLoading: levelsLoading } =
    useRecommendedLevels(activeCampId);

  const levelOptions = (recommendedLevels || []).map((lvl) => {
    if (typeof lvl === "object" && lvl !== null) {
      const label = lvl.name || lvl.level || String(lvl.id);
      const value =
        lvl.id !== undefined && lvl.id !== null && lvl.id !== ""
          ? lvl.id
          : (lvl.name || lvl.level);
      return {
        label,
        value,
      };
    }
    return {
      label: String(lvl),
      value: lvl,
    };
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  // Populate form values when evaluation changes
  useEffect(() => {
    if (evaluation && isOpen) {
      const criteria = evaluation.performance_criteria || {};
      let initialLevel =
        evaluation.recommended_level_id ||
        evaluation.current_recommended_level ||
        evaluation.recommended_level ||
        "";

      if (initialLevel && Array.isArray(recommendedLevels) && recommendedLevels.length > 0) {
        const match = recommendedLevels.find((lvl) => {
          if (typeof lvl === "object" && lvl !== null) {
            return (
              String(lvl.id) === String(initialLevel) ||
              lvl.name === initialLevel ||
              lvl.level === initialLevel
            );
          }
          return false;
        });
        if (match?.id !== undefined && match?.id !== null && match?.id !== "") {
          initialLevel = match.id;
        }
      }

      reset({
        referee_id: String(evaluation?.referee?.id || ""),
        call_accuracy: criteria.call_accuracy ?? "",
        communication_skills: criteria.communication_skills ?? "",
        consistency_of_calls: criteria.consistency_of_calls ?? "",
        court_position_mechanics: criteria.court_position_mechanics ?? "",
        fitness_mobility: criteria.fitness_mobility ?? "",
        game_awareness: criteria.game_awareness ?? "",
        recommended_level: initialLevel,
        private_comments: evaluation.private_comments || "",
        referee_feedback: evaluation.referee_feedback || "",
        status: evaluation.status || "submitted",
      });
    }
  }, [evaluation, isOpen, reset, recommendedLevels]);

  const { mutate: updateEvaluation, isPending: isUpdating } =
    useUpdateEvaluation(activeCampId, {
      onSuccess: () => {
        onClose();
      },
    });

  const onSubmit = (formDataValues) => {
    if (!evaluation?.id) return;
    let resolvedRecommendedLevel = formDataValues.recommended_level;
    if (
      resolvedRecommendedLevel !== undefined &&
      resolvedRecommendedLevel !== null &&
      resolvedRecommendedLevel !== ""
    ) {
      const match = recommendedLevels.find((lvl) => {
        if (typeof lvl === "object" && lvl !== null) {
          return (
            String(lvl.id) === String(resolvedRecommendedLevel) ||
            lvl.name === resolvedRecommendedLevel ||
            lvl.level === resolvedRecommendedLevel
          );
        }
        return false;
      });
      if (match?.id !== undefined && match?.id !== null && match?.id !== "") {
        resolvedRecommendedLevel = match.id;
      }
    }

    const formData = buildEvaluationFormData(
      {
        ...formDataValues,
        recommended_level: resolvedRecommendedLevel,
        referee_id: String(evaluation?.referee?.id || ""),
      },
      activeCampId
    );
    updateEvaluation({ evaluationId: evaluation.id, formData });
  };

  // Live score calculations
  const watchedScores = watch(CRITERIA_CONFIG.map((c) => c.key));
  const currentTotal = (watchedScores || []).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );
  const currentAvg = (currentTotal / CRITERIA_CONFIG.length).toFixed(2);
  const currentPercentage = Math.round((currentTotal / 60) * 100);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={760}
      centered
      destroyOnClose
      className="custom-edit-evaluation-modal"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="font-sans py-2 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <img
              src={evaluation?.referee?.avatar || "/default-avatar.png"}
              alt={evaluation?.referee?.name || "Referee"}
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Edit Evaluation — {evaluation?.referee?.name}
              </h3>
              <p className="text-xs text-slate-500">{evaluation?.referee?.email}</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 bg-blue-50/60 px-3 py-1.5 rounded-lg border border-blue-100 text-xs">
            <span className="text-slate-600 font-medium">Total: <strong>{currentTotal}/60</strong></span>
            <span className="text-slate-300">|</span>
            <span className="text-[#00AEEF] font-bold">Avg: {currentAvg}</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-600 font-bold">{currentPercentage}%</span>
          </div>
        </div>

        {/* 6 Criteria Grids */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Performance Criteria (1–10)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {CRITERIA_CONFIG.map((crit) => (
              <Controller
                key={crit.key}
                name={crit.key}
                control={control}
                rules={{ required: `${crit.label} is required` }}
                render={({ field }) => (
                  <EditScoreSelector
                    value={field.value}
                    onChange={field.onChange}
                    label={crit.label}
                    hint={crit.hint}
                    icon={crit.icon}
                    error={errors[crit.key]}
                  />
                )}
              />
            ))}
          </div>
        </div>

        {/* Recommended Level Selection */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center text-sm border border-amber-100">
              <LuAward />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                Officiating Level Recommendation
              </h4>
              <p className="text-[11px] text-slate-400">
                Update highest recommended competitive level
              </p>
            </div>
          </div>

          <Controller
            name="recommended_level"
            control={control}
            rules={{ required: "Recommended level is required" }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder={levelsLoading ? "Loading levels..." : "Select level..."}
                className="w-full text-left"
                size="large"
                options={levelOptions}
                disabled={levelsLoading}
              />
            )}
          />
          {errors.recommended_level && (
            <p className="text-xs text-red-500 font-medium">
              {errors.recommended_level.message}
            </p>
          )}
        </div>

        {/* Comments: Private & Referee */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Private Comments */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <LuLock className="text-amber-500" />
              Private Notes (Staff only)
            </label>
            <textarea
              {...register("private_comments")}
              rows={3}
              placeholder="Internal notes visible to director & evaluator..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#00AEEF] resize-none"
            />
          </div>

          {/* Referee Feedback */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <LuMessageSquare className="text-blue-500" />
              Referee Feedback
            </label>
            <textarea
              {...register("referee_feedback")}
              rows={3}
              placeholder="Constructive feedback shared with official..."
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#00AEEF] resize-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isUpdating}
            className="px-5 py-2 text-xs sm:text-sm font-bold rounded-lg bg-[#00AEEF] hover:bg-[#0099d4] text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
          >
            {isUpdating ? <LoaderV2 /> : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
