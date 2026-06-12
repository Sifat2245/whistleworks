import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdClose, MdArrowBack, MdOutlineSportsHandball } from "react-icons/md";
import { Avatar, Spin, Tag } from "antd";
import { useGetRefereeDetails } from "@/hooks/get-referee-details";
import useSubmitEvaluation from "@/hooks/submit-evaluation-hook";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import CommonInputWrapper from "./CommonInputWrapper";
import CommonSubmitBtn from "./CommonSubmitBtn";
import LoaderV2 from "./LoaderV2";
import { BsTrophy, BsPersonCheck } from "react-icons/bs";
import { HiOutlineCalendar, HiOutlineLocationMarker } from "react-icons/hi";

const scoreOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1}`,
  value: i + 1,
}));

const levelOptions = [
  { label: "NCAA D1", value: "NCAA D1" },
  { label: "NCAA D2", value: "NCAA D2" },
  { label: "NAIA", value: "NAIA" },
  { label: "JUCO", value: "JUCO" },
  { label: "HS", value: "HS" },
  { label: "JH/ELEM", value: "JH/ELEM" },
];

const StatCard = ({ label, value, color = "text-[#00AEEF]" }) => (
  <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-100">
    <div className={`text-2xl font-bold ${color}`}>{value ?? "—"}</div>
    <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide font-medium">{label}</div>
  </div>
);

const ScheduleRefereeModal = ({ isOpen, onClose, refereeData, campId, userRole = "evaluator" }) => {
  const [view, setView] = useState("details");

  const refereeId = refereeData?.referee_id;
  const { refereeDetails, isLoading } = useGetRefereeDetails(campId, refereeId);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
  } = useForm({
    defaultValues: { referee_id: String(refereeId) },
  });

  const { submitEvaluation, isSubmitting, isSuccess, isError, error, reset: resetMutation } =
    useSubmitEvaluation({ camp_id: campId });

  // Reset form when referee changes
  useEffect(() => {
    if (isOpen && refereeId) {
      resetForm({ referee_id: String(refereeId) });
    }
  }, [refereeId, isOpen, resetForm]);

  // Handle success via useEffect to avoid render-time side effects
  useEffect(() => {
    if (!isSuccess) return;
    Swal.fire({
      icon: "success",
      title: "Evaluation Submitted!",
      text: "The referee has been evaluated successfully.",
      timer: 2500,
      showConfirmButton: false,
    });
    resetForm();
    resetMutation();
    setView("details");
  }, [isSuccess, resetForm, resetMutation]);

  // Handle error via useEffect
  useEffect(() => {
    if (!isError) return;
    Swal.fire({
      icon: "error",
      title: "Submission Failed",
      text: error?.response?.data?.message || "Something went wrong! Please try again.",
      timer: 3000,
      showConfirmButton: false,
    });
    resetMutation();
  }, [isError, error, resetMutation]);

  const onSubmit = (data) => {
    submitEvaluation(data);
  };

  const handleClose = () => {
    setView("details");
    onClose();
  };

  const details = refereeDetails?.referee;
  const statistics = refereeDetails?.statistics;
  const evaluations = refereeDetails?.evaluations || [];
  const assignedSlots = refereeDetails?.assigned_slots;
  const camp = refereeDetails?.camp;

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
            <div className="overflow-y-auto" style={{ maxHeight: "calc(90vh - 80px)" }}>
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

                    {/* Performance Stats */}
                    {statistics && (
                      <>
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
                            Performance Overview
                          </h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            <StatCard label="Overall" value={statistics.averages?.overall?.toFixed(1)} color="text-purple-600" />
                            <StatCard label="Evaluations" value={statistics.total_evaluations} color="text-[#00AEEF]" />
                            <StatCard label="Evaluators" value={statistics.unique_evaluators} color="text-emerald-600" />
                            <StatCard label="Call Accuracy" value={statistics.averages?.call_accuracy?.toFixed(1)} />
                            <StatCard label="Communication" value={statistics.averages?.communication_skills?.toFixed(1)} />
                            <StatCard label="Consistency" value={statistics.averages?.consistency_of_calls?.toFixed(1)} />
                            <StatCard label="Court Position" value={statistics.averages?.court_position_mechanics?.toFixed(1)} />
                            <StatCard label="Fitness" value={statistics.averages?.fitness_mobility?.toFixed(1)} />
                            <StatCard label="Game Awareness" value={statistics.averages?.game_awareness?.toFixed(1)} />
                          </div>
                        </div>

                        {/* Recommended Level */}
                        {statistics.highest_recommended_level && (
                          <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                            <BsTrophy className="w-8 h-8 text-amber-500 shrink-0" />
                            <div>
                              <p className="text-xs text-amber-700 uppercase tracking-wide font-medium">Highest Recommended Level</p>
                              <p className="text-lg font-bold text-amber-800">{statistics.highest_recommended_level}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )}

                    {/* Assigned Game Slots */}
                    {assignedSlots?.slots?.length > 0 && (
                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                          Assigned Games ({assignedSlots.total_slots})
                        </h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {assignedSlots.slots.map((slot) => (
                            <div
                              key={slot.game_slot_id}
                              className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-100"
                            >
                              <div className="shrink-0 w-2 h-full bg-[#00AEEF] rounded-full mt-1" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800">
                                  {slot.game_details?.court_name || "Court"}
                                </p>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mt-1">
                                  <span className="inline-flex items-center gap-1">
                                    <HiOutlineCalendar className="w-3.5 h-3.5" />
                                    {slot.game_details?.date}
                                  </span>
                                  <span>
                                    {slot.game_details?.start_time?.slice(0, 5)} - {slot.game_details?.end_time?.slice(0, 5)}
                                  </span>
                                  {slot.location?.address && (
                                    <span className="inline-flex items-center gap-1">
                                      <HiOutlineLocationMarker className="w-3.5 h-3.5" />
                                      {slot.location.address}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Evaluations */}
                    {evaluations.length > 0 && (
                      <div className="border-t border-gray-100 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                          Recent Evaluations ({evaluations.length})
                        </h4>
                        <div className="space-y-3">
                          {evaluations.slice(0, 5).map((evalItem) => (
                            <div key={evalItem.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold text-gray-800">{evalItem.evaluator?.name}</span>
                                  <span className="text-xs text-gray-400">({evalItem.submitted_at})</span>
                                </div>
                                <Tag color="purple" className="m-0">
                                  Avg: {Number(evalItem.average_score).toFixed(1)}/10
                                </Tag>
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
                                {evalItem.scores && Object.entries(evalItem.scores).map(([key, score]) => (
                                  <div key={key} className="bg-white rounded-lg p-2 border border-gray-50">
                                    <div className="font-bold text-gray-800">{score}</div>
                                    <div className="text-gray-400 truncate">
                                      {key.replace(/_/g, " ")}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {evalItem.recommended_level && (
                                <div className="mt-2 text-xs text-gray-500">
                                  Recommended: <span className="font-semibold text-amber-700">{evalItem.recommended_level}</span>
                                </div>
                              )}
                              {evalItem.referee_feedback && (
                                <div className="mt-2 text-xs text-gray-600 italic border-t border-gray-200 pt-2">
                                  "{evalItem.referee_feedback}"
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evaluate Button */}
                    {userRole !== "referee" && (
                      <div className="border-t border-gray-100 pt-4">
                        <button
                          onClick={() => setView("evaluation")}
                          className="w-full py-3 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#00AEEF]/20 hover:shadow-[#00AEEF]/30"
                        >
                          Evaluate This Referee
                        </button>
                      </div>
                    )}
                  </div>
                )
              ) : (
                /* Evaluation Form View */
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
                  {/* Referee being evaluated */}
                  <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 border border-blue-100">
                    <Avatar size={48} src={refereeData?.avatar}>
                      {refereeData?.name?.charAt(0)?.toUpperCase() || "R"}
                    </Avatar>
                    <div>
                      <p className="text-xs text-blue-600 uppercase tracking-wide font-medium">Evaluating</p>
                      <p className="text-lg font-bold text-gray-900">{refereeData?.name || "Referee"}</p>
                    </div>
                  </div>

                  <input type="hidden" {...register("referee_id")} />

                  <h3 className="text-base font-semibold text-gray-800 border-b border-gray-100 pb-2">
                    Performance Criteria
                  </h3>

                  <CommonInputWrapper
                    type="select"
                    label="Call/No Call Accuracy (10=Excellent; 1=Poor)"
                    placeholder="Select one.."
                    register_as="call_accuracy"
                    control={control}
                    options={scoreOptions}
                    validationRules={{ required: "Required" }}
                    errors={errors}
                  />

                  <CommonInputWrapper
                    type="select"
                    label="Communication Skills (10=Excellent; 1=Poor)"
                    placeholder="Select one.."
                    register_as="communication_skills"
                    control={control}
                    options={scoreOptions}
                    validationRules={{ required: "Required" }}
                    errors={errors}
                  />

                  <CommonInputWrapper
                    type="select"
                    label="Consistency of Calls (10=Excellent; 1=Poor)"
                    placeholder="Select one.."
                    register_as="consistency_of_calls"
                    control={control}
                    options={scoreOptions}
                    validationRules={{ required: "Required" }}
                    errors={errors}
                  />

                  <CommonInputWrapper
                    type="select"
                    label="Court Position/Mechanics (10=Excellent; 1=Poor)"
                    placeholder="Select one.."
                    register_as="court_position_mechanics"
                    control={control}
                    options={scoreOptions}
                    validationRules={{ required: "Required" }}
                    errors={errors}
                  />

                  <CommonInputWrapper
                    type="select"
                    label="Fitness/Mobility (10=Excellent; 1=Poor)"
                    placeholder="Select one.."
                    register_as="fitness_mobility"
                    control={control}
                    options={scoreOptions}
                    validationRules={{ required: "Required" }}
                    errors={errors}
                  />

                  <CommonInputWrapper
                    type="select"
                    label="Game Awareness (10=Excellent; 1=Poor)"
                    placeholder="Select one.."
                    register_as="game_awareness"
                    control={control}
                    options={scoreOptions}
                    validationRules={{ required: "Required" }}
                    errors={errors}
                  />

                  <CommonInputWrapper
                    type="textarea"
                    label="Private Comments"
                    textareaClass="border-black/15"
                    placeholder="Write private comments (visible only to evaluators and directors)..."
                    register_as="private_comments"
                    register={register}
                    errors={errors}
                  />

                  <CommonInputWrapper
                    type="textarea"
                    textareaClass="border-black/15"
                    label="Referee Feedback"
                    placeholder="Write feedback for the referee..."
                    register_as="referee_feedback"
                    register={register}
                    errors={errors}
                  />

                  <CommonInputWrapper
                    type="select"
                    label="Recommended HIGHEST Level of Officiating"
                    placeholder="Select one.."
                    register_as="recommended_level"
                    control={control}
                    options={levelOptions}
                    validationRules={{ required: "Required" }}
                    errors={errors}
                  />

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setView("details")}
                      className="flex-1 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <CommonSubmitBtn
                      variant="primary"
                      className="flex-1!"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <LoaderV2 /> : "Submit Evaluation"}
                    </CommonSubmitBtn>
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
