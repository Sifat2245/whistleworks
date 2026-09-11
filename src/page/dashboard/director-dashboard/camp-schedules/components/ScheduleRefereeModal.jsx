import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdClose, MdArrowBack, MdOutlineSportsHandball } from "react-icons/md";
import { Avatar, Spin, Select } from "antd";
import { useGetRefereeDetails } from "@/hooks/api/useRefereeDetails";
import {
  useSubmitEvaluation,
  useRecommendedLevels,
  buildEvaluationFormData,
} from "@/hooks/api/useEvaluation";
import { useForm, Controller } from "react-hook-form";
import Swal from "sweetalert2";
import LoaderV2 from "../../../../../components/common/LoaderV2";
import { BsPersonCheck } from "react-icons/bs";
import {
  LuClipboardList,
  LuTarget,
  LuMessageSquareText,
  LuScale,
  LuFootprints,
  LuActivity,
  LuEye,
  LuMessageSquare,
  LuAward,
  LuLock,
  LuSend,
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

const ScheduleRefereeModal = ({ isOpen, onClose, refereeData, campId, userRole = "evaluator", sportsType }) => {
  const [view, setView] = useState("details");
  const scrollContainerRef = useRef(null);

  const refereeId = refereeData?.referee_id;
  const { refereeDetails, isLoading } = useGetRefereeDetails(campId, refereeId);

  const camp = refereeDetails?.camp;
  const { data: recommendedLevels = [], isLoading: levelsLoading } =
    useRecommendedLevels(sportsType);

  const levelOptions = recommendedLevels.map((level) => ({
    label: level,
    value: level,
  }));

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset: resetForm,
  } = useForm({
    defaultValues: { referee_id: String(refereeId) },
  });

  const watchedScores = watch(criteria.map((c) => c.key));
  const ratedCount = (watchedScores || []).filter(
    (val) => val !== undefined && val !== null && val !== ""
  ).length;
  const progress = Math.round((ratedCount / criteria.length) * 100);

  const {
    mutate: submitEvaluation,
    isPending: isSubmitting,
  } = useSubmitEvaluation(campId, {
    onSuccess: (response) => {
      Swal.fire({
        icon: "success",
        title: "Evaluation Submitted!",
        text: response?.data?.message || "The referee has been evaluated successfully.",
        timer: 2500,
        showConfirmButton: false,
      });
      resetForm();
      setView("details");
    },
  });

  // Reset form when referee changes
  useEffect(() => {
    if (isOpen && refereeId) {
      resetForm({ referee_id: String(refereeId) });
    }
  }, [refereeId, isOpen, resetForm]);

  const onSubmit = (data) => {
    const formData = buildEvaluationFormData(data, campId);
    submitEvaluation(formData);
  };

  const handleClose = () => {
    setView("details");
    onClose();
  };

  const details = refereeDetails?.referee;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50">
              <div className="flex items-center gap-3">
                {view === "evaluation" && (
                  <button
                    onClick={() => setView("details")}
                    className="text-gray-500 hover:text-gray-700 transition p-1 rounded-lg hover:bg-white/60"
                  >
                    <MdArrowBack className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-gray-900">
                  {view === "details" ? "Referee Details" : "Evaluate Referee"}
                </h2>
              </div>
              <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-white/60">
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div ref={scrollContainerRef} className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 80px)" }}>
              {view === "details" ? (
                isLoading ? (
                  <div className="flex justify-center items-center py-24">
                    <Spin size="large" tip="Loading referee details..." />
                  </div>
                ) : !details ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <MdOutlineSportsHandball className="w-16 h-16" />
                    <p className="text-lg font-medium">Unable to load referee details</p>
                    <p className="text-sm">The referee data could not be retrieved.</p>
                  </div>
                ) : (
                  <div className="p-6 space-y-6">
                    {/* Profile Section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-gray-100">
                      <Avatar
                        size={88}
                        src={details.avatar}
                        alt={details.first_name}
                        className="border-2 border-gray-200 shadow-md shrink-0"
                      >
                        {details.first_name?.charAt(0)?.toUpperCase() || "R"}
                      </Avatar>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="text-2xl font-bold text-gray-900">
                          {details.first_name} {details.last_name}
                        </h3>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                          {details.jersey_number && (
                            <span className="inline-flex items-center gap-1 text-sm font-medium text-[#00AEEF] bg-[#00AEEF]/10 px-3 py-1 rounded-full">
                              <BsPersonCheck className="w-3.5 h-3.5" />
                              #{details.jersey_number}
                            </span>
                          )}
                          <span className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                            details.registration_status === "checked_in"
                              ? "text-green-700 bg-green-100"
                              : "text-yellow-700 bg-yellow-100"
                          }`}>
                            {details.registration_status === "checked_in" ? "Checked In" : details.registration_status || "Registered"}
                          </span>
                        </div>
                        {details.checked_in_at && (
                          <p className="text-xs text-gray-400 mt-2">
                            Checked in: {details.checked_in_at}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Email</span>
                        <p className="text-sm text-gray-800">{details.email || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Phone</span>
                        <p className="text-sm text-gray-800">{details.phone || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Address</span>
                        <p className="text-sm text-gray-800">{details.address || "—"}</p>
                      </div>
                      <div className="space-y-1">
                        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Camp</span>
                        <p className="text-sm text-gray-800">{camp?.name || "—"}</p>
                      </div>
                    </div>

                    {/* Bio */}
                    {details.biography && (
                      <div>
                        <span className="text-xs text-gray-400 uppercase tracking-wide font-medium">Biography</span>
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{details.biography}</p>
                      </div>
                    )}

                    {/* Evaluate Button */}
                    {userRole !== "referee" && (
                      <div className="border-t border-gray-100 pt-4">
                        <button
                          onClick={() => {
                            setView("evaluation");
                            // Scroll to top when switching to evaluation form
                            scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="w-full py-3 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#00AEEF]/20 hover:shadow-[#00AEEF]/30 cursor-pointer"
                        >
                          Evaluate This Referee
                        </button>
                      </div>
                    )}
                  </div>
                )
              ) : (
                /* Evaluation Form View */
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6 font-sans">
                  {/* Referee being evaluated */}
                  <div className="flex items-center gap-3.5 bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                    <Avatar size={48} src={refereeData?.avatar}>
                      {refereeData?.name?.charAt(0)?.toUpperCase() || "R"}
                    </Avatar>
                    <div>
                      <p className="text-xs text-[#00AEEF] uppercase tracking-wide font-semibold">Evaluating Official</p>
                      <p className="text-base font-bold text-slate-900">{refereeData?.name || "Referee"}</p>
                    </div>
                  </div>

                  <input type="hidden" {...register("referee_id")} />

                  {/* Progress Bar */}
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

                  {/* Performance Criteria Ratings */}
                  <div>
                    <div className="flex items-center gap-2 border-b border-[#E8E8E8] pb-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base border border-blue-100">
                        <LuClipboardList />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#333]">
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

                  {/* Written Comments & Feedback */}
                  <div>
                    <div className="flex items-center gap-2 border-b border-[#E8E8E8] pb-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base border border-blue-100">
                        <LuMessageSquare />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#333]">
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

                  {/* Recommended Highest Level of Officiating */}
                  <div>
                    <div className="flex items-center gap-2 border-b border-[#E8E8E8] pb-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#00AEEF] flex items-center justify-center text-base border border-blue-100">
                        <LuAward />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-[#333]">
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

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-4 border-t border-[#E8E8E8]">
                    <button
                      type="button"
                      onClick={() => setView("details")}
                      className="w-1/3 py-3 border border-slate-200 text-slate-700 font-semibold text-sm rounded-xl hover:bg-slate-100 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 py-3 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
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
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleRefereeModal;

