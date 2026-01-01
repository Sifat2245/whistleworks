import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoSettingsOutline, IoClose } from "react-icons/io5";
import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import Rankings from "@/components/dashboard/director_dashboard/Rankings/Rankings";

const Ranking = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Toggle states
  const [publishForEvaluators, setPublishForEvaluators] = useState(true);
  const [hideEvaluatorName, setHideEvaluatorName] = useState(true);
  const [hideRankingNumbers, setHideRankingNumbers] = useState(true);
  const [publishForReferees, setPublishForReferees] = useState(false);

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <div className="w-full">
      <BackBtn />
      <div className="flex justify-between items-center mb-8">
        <CommonSectionTitle
          text="Ranking - Elite Officials Summer Camp 2024"
          subText="Performance rankings based on evaluation scores"
        />
        <CommonSubmitBtn
          variant="primary"
          type="button"
          onClick={openSettings}
          className="rounded-full p-3"
        >
          <IoSettingsOutline className="h-6 w-6" />
        </CommonSubmitBtn>
      </div>

      <Rankings />

      {/* Settings Popup Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={closeSettings}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-900">Ranking Settings</h3>
                <button
                  onClick={closeSettings}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <IoClose className="w-6 h-6" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Publish for Evaluators Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Publish for Evaluators</p>
                      <p className="text-sm text-gray-500">Show ranking report to evaluators</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={publishForEvaluators}
                        onChange={() => setPublishForEvaluators(!publishForEvaluators)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00AEEF]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Hide Evaluator Name</p>
                      <p className="text-sm text-gray-500">Hide evaluator name from referees</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hideEvaluatorName}
                        onChange={() => setHideEvaluatorName(!hideEvaluatorName)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00AEEF]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">Hide Ranking Numbers</p>
                      <p className="text-sm text-gray-500">Hide ranking numbers to referees</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hideRankingNumbers}
                        onChange={() => setHideRankingNumbers(!hideRankingNumbers)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00AEEF]"></div>
                    </label>
                  </div>
                </div>

                {/* Publish for Referees Section */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-red-600">Publish for Referees</p>
                      <p className="text-sm text-gray-500">Show ENTIRE ranking report to referee</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={publishForReferees}
                        onChange={() => setPublishForReferees(!publishForReferees)}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                    </label>
                  </div>

                  <p className="text-xs text-gray-500 italic">
                    Note: Referees cannot see their evaluation until after 3 evals have been submitted
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={closeSettings}
                  className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
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

export default Ranking;