import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MdClose, MdArrowBack, MdOutlineSportsHandball } from "react-icons/md";
import { Avatar, Spin } from "antd";
import { useGetRefereeDetails } from "@/hooks/api/useRefereeDetails";
import { BsPersonCheck } from "react-icons/bs";
import EvaluationForm from "@/components/shared/evaluation/EvaluationForm";

const ScheduleRefereeModal = ({
  isOpen,
  onClose,
  refereeData,
  campId,
  userRole = "evaluator",
}) => {
  const [view, setView] = useState("details");
  const scrollContainerRef = useRef(null);

  const refereeId = refereeData?.referee_id || refereeData?.id;
  const { refereeDetails, isLoading } = useGetRefereeDetails(campId, refereeId);

  const camp = refereeDetails?.camp;
  const details = refereeDetails?.referee;

  const handleClose = () => {
    setView("details");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-8 font-sans"
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
                    className="text-gray-500 hover:text-gray-700 transition p-1 rounded-lg hover:bg-white/60 cursor-pointer"
                  >
                    <MdArrowBack className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-xl font-bold text-gray-900">
                  {view === "details" ? "Referee Details" : "Evaluate Referee"}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition p-1 rounded-lg hover:bg-white/60 cursor-pointer"
              >
                <MdClose className="w-6 h-6" />
              </button>
            </div>

            {/* Body */}
            <div
              ref={scrollContainerRef}
              className="overflow-y-auto"
              style={{ maxHeight: "calc(90vh - 80px)" }}
            >
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
                          <span
                            className={`inline-flex items-center gap-1 text-sm font-medium px-3 py-1 rounded-full ${
                              details.registration_status === "checked_in"
                                ? "text-green-700 bg-green-100"
                                : "text-yellow-700 bg-yellow-100"
                            }`}
                          >
                            {details.registration_status === "checked_in"
                              ? "Checked In"
                              : details.registration_status || "Registered"}
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
                          type="button"
                          onClick={() => {
                            setView("evaluation");
                            scrollContainerRef.current?.scrollTo?.({ top: 0, behavior: "smooth" });
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
                /* Evaluation Form View — Using unified EvaluationForm */
                <EvaluationForm
                  campId={campId}
                  refereeId={refereeId}
                  refereeData={refereeData || details}
                  onSuccess={() => {
                    setView("details");
                  }}
                  onCancel={() => setView("details")}
                  className="border-0 shadow-none rounded-none p-6"
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleRefereeModal;
