import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  IoCallOutline,
} from "react-icons/io5";
import { useAuth } from "@/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

const NoticePopup = () => {
  const { userData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const getProfilePath = () => {
    const role = userData?.role?.toLowerCase();
    const paths = {
      director: "/director-dashboard/profile",
      evaluator: "/evaluator-dashboard/profile",
      referee: "/referee-dashboard/profile",
    };
    return paths[role] || "/dashboard/profile";
  };

  useEffect(() => {
    const pathname = location.pathname;

    if (pathname.includes("/profile")) {
      setIsOpen(false);
      return;
    }

    const isDashboard =
      pathname === "/director-dashboard" ||
      pathname === "/evaluator-dashboard" ||
      pathname === "/referee-dashboard";

    const phone = userData?.phone || "";
    const needsPhoneUpdate = !phone || !phone.startsWith("+");
    const showPopup = isDashboard && needsPhoneUpdate;

    if (showPopup) {
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }

    setIsOpen(false);
  }, [location.pathname, userData]);

  const handleUpdate = () => {
    setIsOpen(false);
    navigate(getProfilePath(), {
      state: {
        openEditProfile: true,
        focusPhone: true,
        source: "phone-update-popup",
      },
    });
  };

  const handleRemindLater = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm mx-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="bg-white rounded-2xl shadow-xl">
              <div className="p-6 text-center">
                {/* Icon - Using IoCallOutline for phone */}
                <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <IoCallOutline className="w-7 h-7 text-blue-500" />
                </div>
                
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Update Phone Number
                </h3>
                
                {/* Description */}
                <p className="text-sm text-gray-600 mb-4">
                  Add your country code to receive important updates about games, schedules, and camps via SMS.
                </p>
                
                {/* Info Box */}
                <div className="bg-gray-50 rounded-lg p-3 mb-5">
                  <p className="text-xs text-gray-500">
                    Example: <span className="font-mono font-medium text-gray-700">+1 234 567 8900</span>
                  </p>
                </div>
                
                {/* Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={handleUpdate}
                    className="w-full bg-primary text-white py-2.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-colors"
                  >
                    Update Phone Number
                  </button>
                  
                  <button
                    onClick={handleRemindLater}
                    className="w-full text-gray-500 text-sm py-2 hover:text-gray-700 transition-colors"
                  >
                    Remind Me Tomorrow
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NoticePopup;
