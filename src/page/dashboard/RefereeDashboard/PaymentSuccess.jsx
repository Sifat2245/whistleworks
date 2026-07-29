import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  // Read camp registration data stored in localStorage before Stripe redirect
  const [registrationData, setRegistrationData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("pending_camp_registration");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRegistrationData(parsed);
      } catch {
        // ignore parse errors
      }
      // Clear it immediately so it's not picked up again
      localStorage.removeItem("pending_camp_registration");
    }
  }, []);

  const campInfo = registrationData?.camp;
  const priceBreakdown = registrationData?.price_breakdown;
  const discountInfo = registrationData?.discount;
  const campName = campInfo?.name;

  useEffect(() => {
    // Brief pause for the entrance animations to feel intentional
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  // Confetti particles config
  const confettiColors = ["#00aeef", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"];
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
    duration: 1.2 + Math.random() * 1.2,
    color: confettiColors[i % confettiColors.length],
    size: 6 + Math.random() * 8,
    rotation: Math.random() * 360,
  }));

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

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 0.6, delay: 0.3, ease: "easeInOut" },
    },
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
      transition: { duration: 1.2, delay: 0.5, repeat: Infinity, ease: "easeOut" },
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
            Processing your registration...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-linear-to-b from-primary/[0.03] via-white to-white px-4 py-12">
      {/* ===== Decorative Background Elements ===== */}
      {/* Large gradient blobs */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -left-20 w-64 h-64 bg-blue-200/10 rounded-full blur-3xl" />

      {/* Floating confetti particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 20, x: `${p.x}vw`, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [20, -60, -140, -220],
            x: [`${p.x}vw`, `${p.x + (Math.random() - 0.5) * 8}vw`],
            rotate: p.rotation,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 2,
          }}
          className="absolute top-1/2 z-0"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: p.id % 3 === 0 ? "50%" : "2px",
          }}
        />
      ))}

      {/* ===== Main Card ===== */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-primary/10 border border-gray-100/80 p-8 md:p-10 text-center"
        >
          {/* --- Animated Success Icon --- */}
          <motion.div
            variants={circleVariants}
            className="relative mx-auto mb-7 w-24 h-24 flex items-center justify-center"
          >
            {/* Pulsing ring */}
            <motion.div
              variants={pulseRingVariants}
              initial="hidden"
              animate="visible"
              className="absolute inset-0 rounded-full border-2 border-primary/30"
            />

            {/* Static circle background */}
            <div className="absolute inset-0 rounded-full bg-primary/10" />

            {/* Checkmark */}
            <svg
              className="relative w-12 h-12 text-primary"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <motion.path
                d="M5 13l4 4L19 7"
                variants={checkmarkVariants}
                initial="hidden"
                animate="visible"
              />
            </svg>
          </motion.div>

          {/* --- Heading --- */}
          <motion.h1
            variants={itemVariants}
            className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 tracking-tight"
          >
            Payment Successful!
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-gray-500 text-base mb-8"
          >
            Your camp registration has been confirmed.{" "}
            {campName && (
              <>
                You&apos;re all set for <span className="font-semibold text-gray-700">{campName}</span>.
              </>
            )}
          </motion.p>

          {/* --- Confirmation Details Card --- */}
          <motion.div
            variants={itemVariants}
            className="bg-linear-to-br from-gray-50 to-gray-50/50 rounded-2xl p-6 border border-gray-100 mb-8 text-left"
          >
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Registration Summary
            </h3>

            <div className="space-y-3.5">
              {/* Camp Info */}
              {campInfo && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs mb-4">
                  <div className="px-4 py-3.5 bg-linear-to-r from-primary/[0.04] to-transparent border-b border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Camp Details
                    </p>
                  </div>
                  <div className="px-4 py-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Camp</span>
                      <span className="text-sm font-semibold text-gray-900 text-right max-w-[200px]">
                        {campInfo.name}
                      </span>
                    </div>
                    {campInfo.location && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Location</span>
                        <span className="text-sm font-medium text-gray-700 text-right max-w-[200px]">
                          {campInfo.location}
                        </span>
                      </div>
                    )}
                    {campInfo.start_date && campInfo.end_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Duration</span>
                        <span className="text-xs font-medium text-gray-700 text-right">
                          {campInfo.start_date} — {campInfo.end_date}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Price Breakdown */}
              {priceBreakdown && (
                <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-xs mb-4">
                  <div className="px-4 py-3.5 bg-linear-to-r from-green-50 to-transparent border-b border-gray-100">
                    <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
                      Payment Details
                    </p>
                  </div>
                  <div className="px-4 py-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Camp Fee</span>
                      <span className="text-sm font-semibold text-gray-900">
                        ${Number(priceBreakdown.camp_price || 0).toFixed(2)}
                      </span>
                    </div>
                    {Number(priceBreakdown.sports_fee) > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Technology Fee</span>
                        <span className="text-sm font-medium text-gray-700">
                          ${Number(priceBreakdown.sports_fee).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {Number(priceBreakdown.discount) > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 flex items-center gap-1.5">
                          Discount
                          {discountInfo?.coupon_code && (
                            <span className="text-xs font-mono text-green-600 bg-green-100 px-1.5 py-0.5 rounded">
                              {discountInfo.coupon_code}
                            </span>
                          )}
                        </span>
                        <span className="text-sm font-semibold text-green-600">
                          -${Number(priceBreakdown.discount).toFixed(2)}
                        </span>
                      </div>
                    )}
                    {Number(priceBreakdown.price_after_discount) > 0 && (
                      <>
                        <div className="border-t border-gray-100 pt-2.5" />
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-gray-700">
                            Price After Discount
                          </span>
                          <span className="text-base font-bold text-primary">
                            ${Number(priceBreakdown.price_after_discount).toFixed(2)}
                          </span>
                        </div>
                      </>
                    )}
                    {Number(priceBreakdown.processing_fee) > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Processing Fee</span>
                        <span className="text-sm font-medium text-gray-700">
                          ${Number(priceBreakdown.processing_fee).toFixed(2)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-gray-200 pt-2.5" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900">Total Charged</span>
                      <span className="text-lg font-bold text-primary">
                        ${Number(priceBreakdown.total || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className="inline-flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Confirmed
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Date</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date().toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Time</span>
                <span className="text-sm font-semibold text-gray-900">
                  {new Date().toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          </motion.div>

          {/* --- Action Buttons --- */}
          <motion.div
            variants={itemVariants}
            className="space-y-3"
          >              <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/referee-dashboard/active-camps")}
              className="w-full bg-primary hover:bg-[#0099d4] text-white font-semibold py-3.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 cursor-pointer border-none outline-none"
            >
              Go to My Camps
            </motion.button>

            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/referee-dashboard/find-camps")}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3.5 px-6 rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer"
            >
              Find More Camps
            </motion.button>
          </motion.div>

          {/* --- Footer note --- */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-xs text-gray-400"
          >
            A confirmation email will be sent to your registered email address.
          </motion.p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
