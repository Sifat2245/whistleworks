import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoSync } from "react-icons/io5";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const SettingsModal = ({ isOpen, onClose, campId }) => {
  const axiosInstance = useAxiosSecure();

  // Start with sensible defaults (same as before)
  const [publishForEvaluators, setPublishForEvaluators] = useState(true);
  const [hideEvaluatorName, setHideEvaluatorName] = useState(true);
  const [hideRankingNumbers, setHideRankingNumbers] = useState(true);
  const [publishForReferees, setPublishForReferees] = useState(false);

  const [saving, setSaving] = useState(false);

  // Fetch settings quietly when modal opens
  useEffect(() => {
    if (!isOpen || !campId) return;

    const fetchSettings = async () => {
      try {
        const res = await axiosInstance.get(`/camp/${campId}/ranking-settings`);
        const data = res?.data?.data || {};

        setPublishForEvaluators(data.publish_for_evaluators === 1);
        setHideEvaluatorName(data.hide_evaluator_name === 1);
        setHideRankingNumbers(data.hide_ranking_numbers === 1);
        setPublishForReferees(data.publish_for_referees === 1);
      } catch (err) {
        console.error("Failed to load ranking settings:", err);
      }
    };

    fetchSettings();
  }, [isOpen, campId, axiosInstance]);

  // Auto-save on any toggle
  const updateSetting = async (key, value) => {
    const payload = {
      publish_for_evaluators: publishForEvaluators ? 1 : 0,
      hide_evaluator_name: hideEvaluatorName ? 1 : 0,
      hide_ranking_numbers: hideRankingNumbers ? 1 : 0,
      publish_for_referees: publishForReferees ? 1 : 0,
    };
    payload[key] = value ? 1 : 0;

    try {
      setSaving(true);
      await axiosInstance.put(`/camp/${campId}/ranking-settings`, payload);
    } catch (error) {
      console.error("Failed to save setting:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (setter, key) => (checked) => {
    setter(checked);
    updateSetting(key, checked);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        onClick={onClose}
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
            <div className="flex items-center gap-3">
              {saving && <IoSync className="w-5 h-5 text-[#00AEEF] animate-spin" />}
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Body - Always show toggles, no loading state */}
          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <ToggleItem
                title="Publish for Evaluators"
                description="Show ranking report to evaluators"
                checked={publishForEvaluators}
                onChange={handleToggle(setPublishForEvaluators, "publish_for_evaluators")}
                disabled={saving}
              />
              <ToggleItem
                title="Hide Evaluator Name"
                description="Hide evaluator name from referees"
                checked={hideEvaluatorName}
                onChange={handleToggle(setHideEvaluatorName, "hide_evaluator_name")}
                disabled={saving}
              />
              <ToggleItem
                title="Hide Ranking Numbers"
                description="Hide ranking numbers to referees"
                checked={hideRankingNumbers}
                onChange={handleToggle(setHideRankingNumbers, "hide_ranking_numbers")}
                disabled={saving}
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              <ToggleItem
                title="Publish for Referees"
                description="Show ENTIRE ranking report to referee"
                checked={publishForReferees}
                onChange={handleToggle(setPublishForReferees, "publish_for_referees")}
                disabled={saving}
                highlightTitle
              />
              <p className="text-xs text-gray-500 italic">
                Note: Referees cannot see their evaluation until after 3 evals have been submitted
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Fixed ToggleItem - Correct onChange
const ToggleItem = ({ title, description, checked, onChange, disabled, highlightTitle = false }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className={`font-semibold ${highlightTitle ? "text-red-600" : "text-gray-900"}`}>
        {title}
      </p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div
        className={`w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${
          highlightTitle ? "peer-checked:bg-red-500" : "peer-checked:bg-[#00AEEF]"
        }`}
      />
    </label>
  </div>
);

export default SettingsModal;