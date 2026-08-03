import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SiStripe } from "react-icons/si";
import {
  IoWalletOutline,
  IoFlashOutline,
  IoShieldCheckmarkOutline,
  IoCheckmarkCircle,
  IoClose,
} from "react-icons/io5";
import { FiExternalLink } from "react-icons/fi";
import { useConnectStripe } from "@/hooks/api/useStripConnection";

// ── Content ─────────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: IoWalletOutline,
    title: "Direct payouts to your bank",
    text: "Camp fees are transferred straight into your connected bank account.",
  },
  {
    icon: IoFlashOutline,
    title: "Automatic & on time",
    text: "No manual chasing — payouts are processed automatically through Stripe.",
  },
  {
    icon: IoShieldCheckmarkOutline,
    title: "Secure & trusted",
    text: "Payments run on Stripe's bank-grade security and encryption.",
  },
  {
    icon: IoCheckmarkCircle,
    title: "Full transparency",
    text: "Track every payout and transaction from your Stripe dashboard.",
  },
];

const STEPS = [
  "Click “Connect Stripe” below — you'll be securely redirected to Stripe's onboarding.",
  "Add your business and bank account details (takes about 5 minutes).",
  "You're all set — camp fees get paid directly into your account.",
];

const NoticePopup = ({ isOpen = false, onClose }) => {
  const connectStripeMutation = useConnectStripe();

  // Tracks that the user actually clicked connect so we only auto-close
  // the popup once that attempt settles (avoids closing a reopened popup
  // because of a stale mutation state).
  const [connectInitiated, setConnectInitiated] = useState(false);

  const handleConnect = () => {
    setConnectInitiated(true);
    connectStripeMutation.mutate();
  };

  // Close the popup once the connect attempt finishes (success or error),
  // keeping it open while pending so the user sees the connecting state.
  useEffect(() => {
    if (connectInitiated && !connectStripeMutation.isPending) {
      onClose?.();
      setConnectInitiated(false);
    }
  }, [connectInitiated, connectStripeMutation.isPending, onClose]);

  const handleRemindLater = () => {
    onClose?.();
  };

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
            role="dialog"
            aria-modal="true"
            aria-labelledby="notice-popup-title"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-xl mx-4 max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-6">
                {/* Close */}
                <button
                  type="button"
                  onClick={handleRemindLater}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <IoClose className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#635BFF] to-[#7a5cff] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#635BFF]/25">
                    <SiStripe className="w-7 h-7 text-white" />
                  </div>
                  <h3
                    id="notice-popup-title"
                    className="text-lg font-bold text-gray-900 mb-1.5"
                  >
                    New Update: Get Paid Directly
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    We&apos;ve partnered with Stripe to send your camp fees
                    <span className="font-medium text-gray-800">
                      {" "}
                      directly into your bank account.
                    </span>{" "}
                    Connect once and get paid automatically.
                  </p>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-5">
                  {BENEFITS.map(({ icon: Icon, title, text }) => (
                    <div
                      key={title}
                      className="flex items-start gap-3 bg-gray-50 rounded-lg p-3"
                    >
                      <span className="w-8 h-8 rounded-lg bg-[#635BFF]/10 text-[#635BFF] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {title}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                          {text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Steps */}
                <div className="bg-[#FAFAFA] border border-gray-100 rounded-lg p-4 mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                    How it works
                  </p>
                  <ol className="space-y-2.5">
                    {STEPS.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-[#635BFF] text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={handleConnect}
                    disabled={connectStripeMutation.isPending}
                    className="w-full inline-flex items-center justify-center gap-2 bg-[#635BFF] hover:bg-[#4f47e6] text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                  >
                    {connectStripeMutation.isPending ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <FiExternalLink className="w-4 h-4" />
                        Connect Stripe
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleRemindLater}
                    className="w-full text-gray-500 text-sm py-2 hover:text-gray-700 transition-colors"
                  >
                    Remind Me Later
                  </button>
                </div>

                {/* Trust note */}
                <p className="mt-4 text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <IoShieldCheckmarkOutline className="w-3 h-3" />
                  Secured by Stripe · You&apos;ll be redirected to complete onboarding
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NoticePopup;
