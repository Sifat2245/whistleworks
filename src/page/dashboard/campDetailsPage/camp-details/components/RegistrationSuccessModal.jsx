import { Modal } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

const RegistrationSuccessModal = ({ open, onClose, registrationData }) => {
  if (!registrationData) return null;

  const { registration, camp, payment } = registrationData;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      destroyOnClose
      closeIcon={
        <CloseCircleOutlined className="text-gray-400 hover:text-gray-600 transition-colors text-lg" />
      }
      className="registration-success-modal"
      styles={{
        body: {
          padding: 0,
          overflow: "hidden",
          borderRadius: 12,
        },
        content: {
          borderRadius: 12,
          overflow: "hidden",
          padding: 0,
        },
        mask: {
          backdropFilter: "blur(4px)",
        },
      }}
    >
      <AnimatePresence>
        {open && (
          <div className="relative">
            {/* Success banner with animated checkmark — using primary blue */}
            <div className="bg-linear-to-r from-primary to-[#0086b8] px-8 pt-10 pb-12 text-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-xl" />

              {/* Animated checkmark circle */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 160,
                  damping: 14,
                  delay: 0.1,
                }}
                className="mx-auto mb-5 w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
              >
                <motion.svg
                  className="w-10 h-10 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <motion.path
                    d="M5 13l4 4L19 7"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4, ease: "easeInOut" }}
                  />
                </motion.svg>
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-2xl font-bold text-white mb-1"
              >
                Registration Complete!
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-white/80 text-sm"
              >
                You have successfully registered for this camp
              </motion.p>
            </div>

            {/* Content body */}
            <div className="px-6 py-6 space-y-5">
              {/* Camp Details */}
              {camp && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Camp Details
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Camp Name</span>
                      <span className="text-sm font-semibold text-gray-900 text-right">
                        {camp.name}
                      </span>
                    </div>
                    {camp.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Location</span>
                        <span className="text-sm font-medium text-gray-700 text-right max-w-[240px]">
                          {camp.location}
                        </span>
                      </div>
                    )}
                    {camp.start_date && camp.end_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Duration</span>
                        <span className="text-sm font-medium text-gray-700">
                          {formatDate(camp.start_date)} — {formatDate(camp.end_date)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Registration Info */}
              {registration && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Registration Info
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {registration.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Registered At</span>
                      <span className="text-sm font-medium text-gray-700">
                        {formatDate(registration.registered_at)}{" "}
                        {formatTime(registration.registered_at) &&
                          `at ${formatTime(registration.registered_at)}`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Registration ID</span>
                      <span className="text-xs font-mono text-gray-400 bg-gray-200/70 px-2 py-0.5 rounded">
                        #{registration.id}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Payment Summary (when free/discounted) */}
              {payment && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                >
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                    Payment Summary
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-2.5">
                    {Number(payment.discount_amount) > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Discount Applied</span>
                        <span className="text-sm font-semibold text-primary">
                          -${Number(payment.discount_amount).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Amount Charged</span>
                      <span className="text-lg font-bold text-primary">
                        ${Number(payment.amount || 0).toFixed(2)}
                      </span>
                    </div>
                    {payment.paid_at && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                        <span className="text-sm text-gray-500">Paid At</span>
                        <span className="text-sm font-medium text-gray-700">
                          {formatDate(payment.paid_at)}{" "}
                          {formatTime(payment.paid_at)}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Action button */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="pt-1"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-primary hover:bg-[#0099d4] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 cursor-pointer border-none outline-none"
                >
                  Done
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default RegistrationSuccessModal;
