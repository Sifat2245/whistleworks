import { useRegisteredReferees } from "@/hooks/api/useRegisteredReferees";
import { useRecommendedLevels } from "@/hooks/api/useEvaluation";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import { Select } from "antd";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import LoaderV2 from "@/components/common/LoaderV2";
import { LuUserCheck, LuClipboardCheck, LuMessageSquare, LuAward, LuLock } from "react-icons/lu";

const CRITERIA_CONFIG = [
  { key: "call_accuracy", label: "Call / No Call Accuracy" },
  { key: "communication_skills", label: "Communication Skills" },
  { key: "consistency_of_calls", label: "Consistency of Calls" },
  { key: "court_position_mechanics", label: "Court Position & Mechanics" },
  { key: "fitness_mobility", label: "Fitness & Mobility" },
  { key: "game_awareness", label: "Game Awareness" },
];

const ScoreSelector = ({ value, onChange, label, error }) => (
  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2.5">
    <div className="flex items-center justify-between">
      <label className="text-xs sm:text-sm font-semibold text-slate-800">
        {label}
      </label>
      {value ? (
        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#00AEEF] border border-blue-100">
          {value} / 10
        </span>
      ) : (
        <span className="text-xs font-medium text-slate-400">Select 1-10</span>
      )}
    </div>

    <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
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

const EvaluationFormV2 = ({ camp_id, sports_type_name }) => {
  const axiosInstance = useAxiosSecure();
  const { getRegisterReferess } = useRegisteredReferees(camp_id);

  const { data: recommendedLevels = [], isLoading: levelsLoading } =
    useRecommendedLevels(sports_type_name);

  const levelOptions = recommendedLevels.map((level) => ({
    label: level,
    value: level,
  }));

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

  const giveEvaluationMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(
        "/referee/evaluation/upsert",
        formData
      );
      return response?.data;
    },
    onSuccess: (data) => {
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: data?.message || "Evaluation submitted successfully",
        timer: 2500,
        showConfirmButton: false,
      });

      resetForm();
    },
    onError: (error) => {
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.data ||
        "Something went wrong! Please try again.";

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMessage,
        timer: 4000,
        showConfirmButton: false,
      });
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("referee_id", data.referee_id);
    formData.append("camp_id", camp_id);

    formData.append("call_accuracy", Number(data.call_accuracy));
    formData.append("communication_skills", Number(data.communication_skills));
    formData.append("consistency_of_calls", Number(data.consistency_of_calls));
    formData.append("court_position_mechanics", Number(data.court_position_mechanics));
    formData.append("fitness_mobility", Number(data.fitness_mobility));
    formData.append("game_awareness", Number(data.game_awareness));

    if (data.private_comments?.trim()) {
      formData.append("private_comments", data.private_comments);
    }

    if (data.referee_feedback?.trim()) {
      formData.append("referee_feedback", data.referee_feedback);
    }

    formData.append("recommended_level", data.recommended_level);
    formData.append("status", "submitted");

    giveEvaluationMutation.mutate(formData);
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

      {/* ── 2. Performance Criteria Ratings ──────────────────── */}
      <div>
        <div className="flex items-center gap-2 border-b border-[#E8E8E8] pb-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base border border-blue-100">
            <LuClipboardCheck />
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
          {CRITERIA_CONFIG.map(({ key, label }) => (
            <Controller
              key={key}
              name={key}
              control={control}
              rules={{ required: "Rating required" }}
              render={({ field }) => (
                <ScoreSelector
                  value={field.value}
                  onChange={field.onChange}
                  label={label}
                  error={errors[key]}
                />
              )}
            />
          ))}
        </div>
      </div>

      {/* ── 3. Written Feedback & Comments ───────────────────── */}
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
                (Visible only to evaluators and camp directors)
              </span>
            </label>
            <textarea
              {...register("private_comments")}
              rows={3}
              placeholder="Write internal notes, evaluators' private remarks, or administrative logs..."
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
              Recommended Officiating Level
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

      {/* ── Submit Button ────────────────────────────────────── */}
      <button
        type="submit"
        disabled={giveEvaluationMutation.isPending}
        className="w-full py-3 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-bold text-sm sm:text-base rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
      >
        {giveEvaluationMutation.isPending ? (
          <LoaderV2 />
        ) : (
          "Submit Evaluation Report"
        )}
      </button>
    </form>
  );
};

export default EvaluationFormV2;