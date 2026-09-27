import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

const ProfileSettingsModal = ({ isOpen, onClose, userData, onToggle, isUpdating }) => {
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
            <h3 className="text-xl font-bold text-gray-900">Profile Settings</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <IoClose className="w-6 h-6" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            <p className="text-sm text-gray-500">
              Control what information is visible on your profile.
            </p>
            <div className="space-y-4">
              <ToggleItem
                title="Show Phone Number"
                description="Toggle to show or hide your phone number"
                checked={userData?.is_phone_show !== false}
                onChange={(checked) => onToggle("is_phone_show", checked)}
                disabled={isUpdating}
              />
              <div className="border-t border-gray-100" />
              <ToggleItem
                title="Show Address"
                description="Toggle to show or hide your address"
                checked={userData?.is_address_show !== false}
                onChange={(checked) => onToggle("is_address_show", checked)}
                disabled={isUpdating}
              />
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

const ToggleItem = ({ title, description, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-semibold text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
    <label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        className="sr-only peer"
      />
      <div className="w-12 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00AEEF]" />
    </label>
  </div>
);

export default ProfileSettingsModal;
