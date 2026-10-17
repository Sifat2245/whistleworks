import { useEffect } from "react";
import { Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useRegisteredReferees } from "@/hooks/api/useRegisteredReferees";
import {
  useRecommendedLevels,
  useStoreEvaluation,
  buildEvaluationFormData,
} from "@/hooks/api/useEvaluation";
import LoaderV2 from "@/components/common/LoaderV2";
import {
  LuUserCheck,
  LuTarget,
  LuMessageSquareText,
  LuScale,
  LuFootprints,
  LuActivity,
  LuEye,
  LuLock,
  LuMessageSquare,
} from "react-icons/lu";

const CRITERIA = [
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

const ScoreSelector = ({ value, onChange, label, hint, icon, error }) => (
  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 sm:p-4 space-y-2.5 sm:space-y-3 font-sans">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base shrink-0 border border-blue-100">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-xs sm:text-sm leading-tight">
            {label}
          </p>
          {hint && <p className="text-[11px] text-slate-400 mt-0.5">{hint}</p>}
        </div>
      </div>

      {value ? (
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#00AEEF] border border-blue-100">
          {value} / 10
        </span>
      ) : (
        <span className="text-xs font-medium text-slate-400">Select 1-10</span>
      )}
    </div>

    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 pt-1">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => {
        const isSelected = Number(value) === num;
        return (
          <button
            key={num}
            type="button"
            onClick={() => onChange(num)}
            className={`py-2 text-xs sm:text-sm font-bold rounded-lg border transition-all cursor-pointer ${
              isSelected
                ? "bg-[#00AEEF] text-white border-[#00AEEF] shadow-xs scale-105"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
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

export default function EvaluationForm({
  campId,
  camp_id,
  refereeId,
  refereeData,
  onSuccess,
  onCancel,
  className = "",
}) {
  const activeCampId = campId || camp_id;
  const activeRefereeId = refereeId || refereeData?.referee_id || refereeData?.id;

  const { getRegisterReferess } = useRegisteredReferees(
    activeRefereeId ? null : activeCampId
  );

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

  const convertedRefOptions = getRegisterReferess?.map((ref) => ({
    value: String(ref?.referee_id),
    label: (
      <div className="flex items-center gap-2.5 py-0.5">
        <img
          src={ref?.avatar || "/default-avatar.png"}
          alt={ref?.name}
          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
          onError={(e) => {
            e.target.src = "/default-avatar.png";
          }}
        />
        <span className="font-medium text-slate-800 text-sm truncate">
          {ref?.name} {ref?.jersey_number ? `(#${ref?.jersey_number})` : ""}
        </span>
      </div>
    ),
    searchValue: `${ref?.name} ${ref?.jersey_number ? `(#${ref?.jersey_number})` : ""}`,
    referee: ref,
  }));

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    reset: resetForm,
    formState: { errors },
  } = useForm({
    defaultValues: {
      referee_id: activeRefereeId ? String(activeRefereeId) : "",
    },
  });

  // Keep form referee_id in sync if activeRefereeId changes
  useEffect(() => {
    if (activeRefereeId) {
      setValue("referee_id", String(activeRefereeId));
    }
  }, [activeRefereeId, setValue]);

  const selectedRefId = watch("referee_id");
  const selectedRefObj =
    refereeData ||
    getRegisterReferess?.find(
      (r) => String(r?.referee_id) === String(selectedRefId)
    );

  const watchedScores = watch(CRITERIA.map((c) => c.key));
  const ratedCount = (watchedScores || []).filter(
    (val) => val !== undefined && val !== null && val !== ""
  ).length;
  const progress = Math.round((ratedCount / CRITERIA.length) * 100);
  const totalScore = (watchedScores || []).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );
  const avgScore = ratedCount > 0 ? (totalScore / ratedCount).toFixed(2) : "0.00";

  const { mutate: storeEvaluation, isPending: isSubmitting } =
    useStoreEvaluation(activeCampId, {
      onSuccess: (response) => {
        resetForm();
        if (activeRefereeId) {
          setValue("referee_id", String(activeRefereeId));
        }
        onSuccess?.(response);
      },
    });

  const onSubmit = (formDataValues) => {
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
      },
      activeCampId
    );
    storeEvaluation(formData);
  };

  const refereeDisplayName =
    selectedRefObj?.name ||
    (selectedRefObj?.first_name
      ? `${selectedRefObj.first_name} ${selectedRefObj.last_name || ""}`.trim()
      : "Selected Referee");

  const refereeAvatar = selectedRefObj?.avatar || "/default-avatar.png";
  const refereeJersey = selectedRefObj?.jersey_number;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`w-full bg-white p-5 sm:p-6 rounded-xl border border-slate-200/80 shadow-xs flex flex-col gap-6 font-sans ${className}`}
    >
      {/* ── 1. Referee Selection / Preselected Banner ── */}
      <div>
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base border border-blue-100">
            <LuUserCheck />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              {activeRefereeId ? "Evaluating Official" : "Select Referee"}
            </h3>
            <p className="text-xs text-slate-400">
              {activeRefereeId
                ? "Official assigned to this evaluation"
                : "Choose the registered official to evaluate"}
            </p>
          </div>
        </div>

        {activeRefereeId ? (
          /* Preselected Referee Card */
          <div className="flex items-center gap-3.5 bg-slate-50 rounded-xl p-3.5 border border-slate-200/80">
            <img
              src={refereeAvatar}
              alt={refereeDisplayName}
              className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm sm:text-base font-bold text-slate-900 truncate">
                  {refereeDisplayName}
                </p>
                {refereeJersey && (
                  <span className="px-2 py-0.2 rounded-full text-xs font-semibold bg-blue-50 text-[#00AEEF]">
                    #{refereeJersey}
                  </span>
                )}
              </div>
              {selectedRefObj?.email && (
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {selectedRefObj.email}
                </p>
              )}
            </div>
          </div>
        ) : (
          /* Dropdown Select Referee */
          <div>
            <Controller
              name="referee_id"
              control={control}
              rules={{ required: "Please select a referee official" }}
              render={({ field }) => (
                <Select
                  {...field}
                  value={field.value || undefined}
                  showSearch
                  placeholder="Search and select referee official..."
                  className="w-full text-left focus-within:[&_.ant-select-selector]:!border-[#00AEEF] shadow-2xs"
                  size="large"
                  options={convertedRefOptions}
                  filterOption={(input, option) =>
                    (option?.searchValue || "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  onChange={(val) => field.onChange(val)}
                />
              )}
            />
            {errors.referee_id && (
              <p className="text-xs text-red-500 font-medium mt-1.5">
                {errors.referee_id.message}
              </p>
            )}

            {/* Selected referee badge preview */}
            {selectedRefObj && (
              <div className="mt-3 flex items-center gap-3 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                <img
                  src={selectedRefObj?.avatar || "/default-avatar.png"}
                  alt={selectedRefObj?.name}
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  onError={(e) => {
                    e.target.src = "/default-avatar.png";
                  }}
                />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-tight">
                    {selectedRefObj?.name}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {selectedRefObj?.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── 2. Performance Criteria ── */}
      <div>
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-slate-900">
              Evaluation Criteria
            </h3>
            <p className="text-xs text-slate-400">
              Rate each officiating mechanic and performance category from 1 (poor) to 10 (excellent)
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-slate-700">
              {ratedCount} / {CRITERIA.length} Rated ({progress}%)
            </span>
            <div className="w-24 bg-slate-100 rounded-full h-1.5 mt-1 overflow-hidden">
              <div
                className="bg-[#00AEEF] h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {CRITERIA.map((crit) => (
            <Controller
              key={crit.key}
              name={crit.key}
              control={control}
              rules={{ required: `${crit.label} is required` }}
              render={({ field }) => (
                <ScoreSelector
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

        {/* Live score banner */}
        <div className="flex items-center justify-between mt-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <span className="text-slate-500 font-medium">
            Total Score: <strong className="text-slate-900">{totalScore} / 60</strong>
          </span>
          <span className="text-slate-500 font-medium">
            Avg Rating: <strong className="text-[#00AEEF]">{avgScore} / 10</strong>
          </span>
        </div>
      </div>

      {/* ── 3. Recommended Officiating Level ── */}
      <div>
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-slate-900">
            Officiating Level Recommendation
          </h3>
          <p className="text-xs text-slate-400">
            Select the highest recommended competition level for this official
          </p>
        </div>

        <Controller
          name="recommended_level"
          control={control}
          rules={{ required: "Please select a recommended officiating level" }}
          render={({ field }) => (
            <Select
              {...field}
              value={field.value || undefined}
              placeholder={levelsLoading ? "Loading levels..." : "Select highest level..."}
              className="w-full text-left shadow-2xs"
              size="large"
              options={levelOptions}
              disabled={levelsLoading}
            />
          )}
        />
        {errors.recommended_level && (
          <p className="text-xs text-red-500 font-medium mt-1.5">
            {errors.recommended_level.message}
          </p>
        )}
      </div>

      {/* ── 4. Comments & Feedback ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Private Comments */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <LuLock className="text-amber-500" />
            <span>Private Notes</span>
            <span className="text-slate-400 font-normal">(Staff only)</span>
          </label>
          <textarea
            {...register("private_comments")}
            rows={3}
            placeholder="Confidential notes visible only to camp director & evaluators..."
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#00AEEF] resize-none"
          />
        </div>

        {/* Referee Feedback */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <LuMessageSquare className="text-blue-500" />
            <span>Referee Feedback</span>
            <span className="text-slate-400 font-normal">(Shared with official)</span>
          </label>
          <textarea
            {...register("referee_feedback")}
            rows={3}
            placeholder="Constructive feedback shared with the referee..."
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-[#00AEEF] resize-none"
          />
        </div>
      </div>

      {/* ── 5. Action Buttons ── */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 sm:flex-initial px-6 py-3 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <LoaderV2 /> : "Submit Evaluation Report"}
        </button>
      </div>
    </form>
  );
}
