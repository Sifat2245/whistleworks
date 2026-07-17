import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import { ImSpinner2 } from "react-icons/im";
import { useStripeConnectionStatus } from "@/hooks/api/useStripConnection";

const StripeConnectionSuccess = () => {
  const { data: status, isLoading, isError, refetch } = useStripeConnectionStatus();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Retry status a few times since onboarding might take a moment
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      refetch();
      if (attempts >= 6) {
        clearInterval(interval);
        setChecking(false);
      }
    }, 2000);

    // Also clear after first successful fetch
    return () => clearInterval(interval);
  }, [refetch]);

  useEffect(() => {
    if (!isLoading && status) {
      const timer = setTimeout(() => setChecking(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, status]);

  const isConnected = status?.can_receive_payouts && status?.is_connected;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="mx-auto mb-6"
          >
            {checking || isLoading ? (
              <div className="size-20 rounded-full bg-blue-50 flex items-center justify-center mx-auto">
                <ImSpinner2 className="size-10 text-[#00AEEF] animate-spin" />
              </div>
            ) : isConnected ? (
              <div className="size-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
                <IoCheckmarkCircle className="size-10 text-emerald-500" />
              </div>
            ) : (
              <div className="size-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
                <IoCloseCircle className="size-10 text-amber-500" />
              </div>
            )}
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {checking || isLoading
              ? "Verifying Connection..."
              : isConnected
              ? "Stripe Connected!"
              : "Connection Pending"}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-500 text-sm mb-8 leading-relaxed"
          >
            {checking || isLoading
              ? "We're checking your Stripe account status. This should only take a moment..."
              : isConnected
              ? "Your Stripe account has been successfully connected. You can now receive payouts directly for your camp fees."
              : "Your Stripe account is not yet fully set up. Please complete the onboarding process to start receiving payouts."}
          </motion.p>

          {/* Action */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-3"
          >
            {isConnected ? (
              <Link
                to="/director-dashboard"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-[#00AEEF] hover:bg-[#0099d4] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#00AEEF]/20 hover:shadow-[#00AEEF]/30"
              >
                Back to Dashboard
              </Link>
            ) : (
              <Link
                to="/director-dashboard"
                className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all"
              >
                Return to Dashboard
              </Link>
            )}
          </motion.div>

          {/* Error state */}
          {isError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-xs text-red-500"
            >
              Could not verify connection status.{" "}
              <button
                onClick={() => refetch()}
                className="text-[#00AEEF] hover:underline font-medium"
              >
                Try again
              </button>
            </motion.p>
          )}

          {/* Account info */}
          {status?.stripe_account && isConnected && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-4 text-xs text-gray-400"
            >
              Account: {status.stripe_account}
            </motion.p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StripeConnectionSuccess;
