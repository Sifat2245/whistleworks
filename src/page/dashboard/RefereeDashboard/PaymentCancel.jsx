import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentCancel = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 20 },
    },
  };

  const xMarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (delay = 0) => ({
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.5, delay: 0.3 + delay, ease: "easeInOut" },
    }),
  };

  const circleVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 140,
        damping: 12,
        delay: 0.15,
      },
    },
  };

  const pulseRingVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 2.2,
      opacity: 0,
      transition: {
        duration: 1.2,
        delay: 0.5,
        repeat: Infinity,
        ease: "easeOut",
      },
    },
  };

  if (!showContent) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-linear-to-b from-primary/[0.03] via-white to-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
          <p className="text-gray-500 text-sm font-medium tracking-wide">
            Processing...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-linear-to-b from-amber-50/40 via-white to-white px-4 py-12">
      {/* ===== Decorative Background Elements ===== */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-amber-200/10 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -left-20 w-64 h-64 bg-orange-200/10 rounded-full blur-3xl" />

      {/* ===== Main Card ===== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-amber-900/5 border border-gray-100/80 p-8 md:p-10 text-center"
        >
          {/* --- Animated Cancel Icon --- */}
          <motion.div
            variants={circleVariants}
            className="relative mx-auto mb-7 w-24 h-24 flex items-center justify-center"
          >
            {/* Pulsing ring */}
            <motion.div
              variants={pulseRingVariants}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 rounded-full border-2 border-amber-300/40"
            />

            {/* Circle background */}
            <div className="absolute inset-0 rounded-full bg-amber-100" />

            {/* X Mark */}
            <svg
              className="relative w-12 h-12 text-amber-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M18 6L6 18"
                custom={0}
                variants={xMarkVariants}
                initial="hidden"
                animate="visible"
              />
              <motion.path
                d="M6 6l12 12"
                custom={0.15}
                variants={xMarkVariants}
                initial="hidden"
                animate="visible"
              />
            </svg>
          </motion.div>

          {/* --- Heading --- */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 tracking-tight"
          >
            Payment Cancelled
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-gray-500 text-base mb-8"
          >
            Your registration was not completed.{" "}
            No charges have been made to your account.
          </motion.p>

          {/* --- Info Card --- */}
          <motion.div
            variants={itemVariants}
            className="bg-linear-to-br from-amber-50/80 to-amber-50/40 rounded-2xl p-6 border border-amber-100/80 mb-8 text-left"
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center mt-0.5">
                <svg
                  className="w-4 h-4 text-amber-500"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  What happened?
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  The payment process was interrupted or cancelled before
                  completion. You can try registering again whenever you&apos;re
                  ready. If you encountered an error, please try again or
                  contact support.
                </p>
              </div>
            </div>
          </motion.div>

          {/* --- Action Buttons --- */}
          <motion.div variants={itemVariants} className="space-y-3">
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/referee-dashboard/find-camps")}
              className="w-full bg-primary hover:bg-[#0099d4] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 cursor-pointer border-none outline-none"
            >
              Browse Camps
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3.5 px-6 rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer"
            >
              Try Again
            </motion.button>
          </motion.div>

          {/* --- Footer note --- */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-xs text-gray-400"
          >
            Need help?{" "}
            <button
              type="button"
              onClick={() => navigate("/faq")}
              className="text-primary hover:text-[#0099d4] underline font-medium cursor-pointer"
            >
              Visit our FAQ
            </button>
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentCancel;
