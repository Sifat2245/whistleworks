import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdEmail, MdPhone, MdLocationOn, MdClose } from "react-icons/md";

const ActiveEvalutorList2 = ({ activeEvaluatorData = [] }) => {
  console.log(activeEvaluatorData, "data");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluator, setSelectedEvaluator] = useState(null);

  console.log(selectedEvaluator, "selected");

  const openModal = (evaluator) => {
    setSelectedEvaluator(evaluator);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvaluator(null);
  };

  return (
    <div className="w-full">
      {/* Title */}
      <h2 className="text-xl sm:text-2xl lg:text-3xl text-[#333333] uppercase pb-6 sm:pb-8 font-semibold tracking-wide">
        ACTIVE EVALUATORS
      </h2>

      {/* Evaluators Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
        {activeEvaluatorData.map((evaluator) => (
          <div
            key={evaluator.id}
            className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-lg hover:border-[#00AEEF]/50 transition-all duration-300 group flex flex-col h-full"
          >
            {/* Profile Section */}
            <div className="flex flex-col items-center mb-5">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-4">
                <img
                  src={evaluator.image || ""}
                  alt={evaluator.name}
                  className="w-full h-full rounded-full object-cover border-4 border-[#00AEEF]/20 shadow-md"
                />
              </div>

              <button
                onClick={() => openModal(evaluator)}
                className="text-base sm:text-lg font-bold text-[#333] text-center line-clamp-1 hover:text-[#00AEEF] hover:underline focus:outline-none transition-colors"
              >
                {evaluator.name || "Unnamed Evaluator"}
              </button>

              <span className="mt-2 inline-block bg-[#00AEEF]/10 text-[#00AEEF] text-xs font-semibold px-3 py-1.5 rounded-full">
                Active Evaluator
              </span>
            </div>

            {/* Info Section */}
            <div className="space-y-3 text-sm flex-1">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium text-gray-500 min-w-12">
                  Email:
                </span>
                <span className="text-[#00AEEF] truncate hover:underline">
                  {evaluator.evaluatorMail || "N/A"}
                </span>
              </div>

              {evaluator.evaluatorNumber && (
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="font-medium text-gray-500 min-w-12">
                    Phone:
                  </span>
                  <span className="truncate">{evaluator.evaluatorNumber}</span>
                </div>
              )}

              {evaluator.evaluatorAddress && (
                <div className="flex items-start gap-2 text-gray-600">
                  <span className="font-medium text-gray-500 min-w-12 mt-0.5">
                    Address:
                  </span>
                  <span className="text-gray-700 line-clamp-2 flex-1">
                    {evaluator.evaluatorAddress}
                  </span>
                </div>
              )}
            </div>

            {/* Status Footer */}
            <div className="mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="size-2.5 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="font-medium text-gray-700">Active</span>
                </div>
                {evaluator.approvedAt && (
                  <span className="text-gray-500">
                    Since{" "}
                    {new Date(evaluator.approvedAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {activeEvaluatorData.length === 0 && (
        <div className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-10 sm:p-16 text-center bg-gray-50/50">
          <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeWidth="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0A5.002 5.002 0 019 5c0-1.052-.143-2.074-.414-3.006m4.828 0A5.002 5.002 0 0113 5c0 1.052.143 2.074.414 3.006m-6.828 0A5.002 5.002 0 017 15c0 1.052.143 2.074.414 3.006"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-3">
            No Active Evaluators Yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Approved evaluators will appear here once they are confirmed.
          </p>
        </div>
      )}

      {/* Animated Modal */}
      <AnimatePresence>
        {isModalOpen && selectedEvaluator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                duration: 0.4,
              }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  Evaluator Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition"
                  aria-label="Close modal"
                >
                  <MdClose className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Avatar + Name */}
                <div className="flex flex-col items-center text-center">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400 }}
                    src={selectedEvaluator.image || "/default-avatar.png"}
                    alt={selectedEvaluator.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-[#00AEEF]/20 mb-4 shadow-lg"
                    onError={(e) => (e.target.src = "/default-avatar.png")}
                  />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedEvaluator.name || "Unnamed Evaluator"}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Evaluator ID: #{selectedEvaluator.id}
                  </p>
                  <span className="mt-3 inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full">
                    Active Since{" "}
                    {selectedEvaluator.approvedAt
                      ? new Date(
                          selectedEvaluator.approvedAt
                        ).toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })
                      : "N/A"}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MdEmail className="text-gray-400 text-xl" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">
                        {selectedEvaluator.evaluatorMail || "N/A"}
                      </p>
                    </div>
                  </div>

                  {selectedEvaluator.evaluatorNumber && (
                    <div className="flex items-center gap-3">
                      <MdPhone className="text-gray-400 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-gray-900">
                          {selectedEvaluator.evaluatorNumber}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedEvaluator.evaluatorAddress && (
                    <div className="flex items-center gap-3">
                      <MdLocationOn className="text-gray-400 text-xl" />
                      <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-900">
                          {selectedEvaluator.evaluatorAddress}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActiveEvalutorList2;
