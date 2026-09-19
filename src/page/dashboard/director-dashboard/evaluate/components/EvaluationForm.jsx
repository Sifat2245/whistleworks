import { Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useRegisteredReferees } from "@/hooks/api/useRegisteredReferees";
import {
  useSubmitEvaluation,
  useRecommendedLevels,
  buildEvaluationFormData,
} from "@/hooks/api/useEvaluation";
import LoaderV2 from "@/components/common/LoaderV2";
import {
  LuClipboardList,
  LuUserCheck,
  LuTarget,
  LuMessageSquareText,
  LuScale,
  LuFootprints,
  LuActivity,
  LuEye,
  LuMessageSquare,
  LuSend,
  LuRefreshCw,
  LuAward,
  LuLock,
} from "react-icons/lu";

const criteria = [
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
  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-3 font-sans">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base shrink-0 border border-blue-100">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-xs sm:text-sm leading-tight">
            {label}
          </p>
          {hint && <p className="text-[11px] text-slate-500 mt-0.5">{hint}</p>}
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
            className={`py-2 text-xs sm:text-sm font-bold rounded-lg border transition-all cursor-pointer ${isSelected
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

const EvaluationForm = ({ camp_id, sports_type_name }) => {
  const { getRegisterReferess } = useRegisteredReferees(camp_id);

  const { data: recommendedLevels = [], isLoading: levelsLoading } =
    useRecommendedLevels(sports_type_name);

  const levelOptions = recommendedLevels.map((level) => ({
    label: level,
    value: level,
  }));

  const {
    mutate: submitEvaluation,
    isPending: isSubmitting,
    isSuccess,
    reset: resetMutation,
  } = useSubmitEvaluation(camp_id);

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
    formState: { errors },
    reset: resetForm,
  } = useForm();

  const selectedRefId = watch("referee_id");
  const selectedRefObj = getRegisterReferess?.find(
    (r) => String(r?.referee_id) === String(selectedRefId)
  );

  const watchedScores = watch(criteria.map((c) => c.key));
  const ratedCount = watchedScores.filter(
    (val) => val !== undefined && val !== null && val !== ""
  ).length;
  const progress = Math.round((ratedCount / criteria.length) * 100);

  if (isSuccess) {
    resetForm();
    resetMutation();
  }

  const onSubmit = (data) => {
    const formData = buildEvaluationFormData(data, camp_id);
    submitEvaluation(formData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full bg-white p-5 sm:p-6 rounded-xl border border-[#E8E8E8] shadow-xs flex flex-col gap-6 font-sans"
    >
      {/* ── 1. Select Referee ─────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 border-b border-[#E8E8E8] pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base border border-blue-100">
            <LuUserCheck />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#333]">
              Select Referee
            </h3>
            <p className="text-xs text-gray-500">
              Choose the referee official to grade and evaluate.
            </p>
          </div>
        </div>

        <Controller
          name="referee_id"
          control={control}
          rules={{ required: "Please select a referee" }}
          render={({ field }) => (
            <Select
              {...field}
              showSearch
              placeholder="Search or select a referee..."
              className="w-full text-left"
              size="large"
              options={convertedRefOptions}
              filterOption={(input, option) =>
                (option?.searchValue ?? "").toLowerCase().includes(input.toLowerCase())
              }
            />
          )}
        />
        {errors.referee_id && (
          <p className="text-xs text-red-500 font-medium mt-1">
            {errors.referee_id.message}
          </p>
        )}

        {/* Selected Referee Preview Card */}
        {selectedRefObj && (
          <div className="mt-3 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center gap-3.5">
            <img
              src={selectedRefObj.avatar || "/default-avatar.png"}
              alt={selectedRefObj.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
              onError={(e) => {
                e.target.src = "/default-avatar.png";
              }}
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {selectedRefObj.name}
                {selectedRefObj.jersey_number && (
                  <span className="ml-2 text-xs font-semibold text-[#00AEEF]">
                    #{selectedRefObj.jersey_number}
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 truncate">
                {selectedRefObj.email || "Registered Official"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Progress Bar ─────────────────────────────────────── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Performance Evaluation Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#00AEEF] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── 2. Performance Criteria Ratings ──────────────────── */}
      <div>
        <div className="flex items-center gap-2 border-b border-[#E8E8E8] pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base border border-blue-100">
            <LuClipboardList />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#333]">
              Performance Criteria (1 = Poor, 10 = Excellent)
            </h3>
            <p className="text-xs text-gray-500">
              Tap a score rating button for each of the six category criteria.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {criteria.map((item) => (
            <Controller
              key={item.key}
              name={item.key}
              control={control}
              rules={{ required: "Rating required" }}
              render={({ field }) => (
                <ScoreSelector
                  value={field.value}
                  onChange={field.onChange}
                  label={item.label}
                  hint={item.hint}
                  icon={item.icon}
                  error={errors[item.key]}
                />
              )}
            />
          ))}
        </div>
      </div>

      {/* ── 3. Written Comments & Feedback ───────────────────── */}
      <div>
        <div className="flex items-center gap-2 border-b border-[#E8E8E8] pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base border border-blue-100">
            <LuMessageSquare />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#333]">
              Written Comments & Feedback
            </h3>
            <p className="text-xs text-gray-500">
              Provide feedback for the official referee and confidential notes for directors.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Referee Feedback */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
              <span>Referee Feedback</span>
              <span className="text-[11px] font-normal text-slate-400">
                (Visible to referee)
              </span>
            </label>
            <textarea
              {...register("referee_feedback")}
              rows={3}
              placeholder="Write feedback, key strengths, and constructive tips for the referee..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00AEEF] focus:bg-white text-xs sm:text-sm placeholder-gray-400 transition"
            />
          </div>

          {/* Private Comments */}
          <div>
            <label className="text-xs sm:text-sm font-semibold text-slate-800 flex items-center gap-1.5 mb-1.5">
              <LuLock className="text-[#00AEEF] text-xs" />
              <span>Private Comments</span>
              <span className="text-[11px] font-normal text-slate-400">
                (Visible only to directors & evaluators)
              </span>
            </label>
            <textarea
              {...register("private_comments")}
              rows={3}
              placeholder="Write internal notes or administrative logs..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#00AEEF] focus:bg-white text-xs sm:text-sm placeholder-gray-400 transition"
            />
          </div>
        </div>
      </div>

      {/* ── 4. Recommended Officiating Level ──────────────────── */}
      <div>
        <div className="flex items-center gap-2 border-b border-[#E8E8E8] pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base border border-blue-100">
            <LuAward />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-[#333]">
              Recommended HIGHEST Level of Officiating
            </h3>
            <p className="text-xs text-gray-500">
              Select the highest recommended competition level for this referee.
            </p>
          </div>
        </div>

        <Controller
          name="recommended_level"
          control={control}
          rules={{ required: "Please select a recommended level" }}
          render={({ field }) => (
            <Select
              {...field}
              placeholder={levelsLoading ? "Loading levels..." : "Select highest level..."}
              className="w-full text-left"
              size="large"
              options={levelOptions}
              disabled={levelsLoading}
            />
          )}
        />
        {errors.recommended_level && (
          <p className="text-xs text-red-500 font-medium mt-1">
            {errors.recommended_level.message}
          </p>
        )}
      </div>

      {/* ── Actions ────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-[#E8E8E8]">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 w-full py-3 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <LoaderV2 />
          ) : (
            <>
              <LuSend className="text-base" />
              <span>Submit Evaluation</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => resetForm()}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition font-semibold text-sm cursor-pointer"
        >
          <LuRefreshCw className="text-base text-slate-500" />
          <span>Clear</span>
        </button>
      </div>
    </form>
  );
};

export default EvaluationForm;