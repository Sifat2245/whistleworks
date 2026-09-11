import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCheckmarkCircle,
  IoCloseCircle,
  IoArrowForward,
  IoRocketOutline,
  IoShieldCheckmarkOutline,
  IoFlashOutline,
  IoRemoveCircleOutline,
} from "react-icons/io5";
import { SiStripe } from "react-icons/si";
import { FiExternalLink, FiRefreshCw, FiArrowLeft } from "react-icons/fi";
import {
  useStripeConnectionStatus,
  useStripeDashboard,
} from "@/hooks/api/director-hooks/useStripConnection";

// ─── Confetti Particles ───────────────────────────────────────────
const CONFETTI_COLORS = [
  "#635BFF",
  "#00AEEF",
  "#00D68F",
  "#FFC94D",
  "#FF6B6B",
  "#A78BFA",
  "#F472B6",
];

const ConfettiParticle = ({ index }) => {
  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const x = useMemo(() => Math.random() * 100, []);
  const delay = useMemo(() => Math.random() * 2, []);
  const duration = useMemo(() => 2.5 + Math.random() * 2, []);
  const size = useMemo(() => 6 + Math.random() * 8, []);
  const rotation = useMemo(() => Math.random() * 360, []);

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: -20 }}
      initial={{ y: -20, opacity: 1, rotate: rotation }}
      animate={{
        y: typeof window !== "undefined" ? window.innerHeight * 0.8 : 600,
        opacity: [1, 1, 0],
        rotate: rotation + 360 + Math.random() * 360,
      }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
        repeat: Infinity,
        repeatDelay: 1 + Math.random() * 3,
      }}
    >
      <div
        className="rounded-sm"
        style={{
          width: size,
          height: size * 0.6,
          backgroundColor: color,
          transform: `rotate(${rotation}deg)`,
        }}
      />
    </motion.div>
  );
};

const ConfettiRain = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
    {Array.from({ length: 30 }).map((_, i) => (
      <ConfettiParticle key={i} index={i} />
    ))}
  </div>
);


// ─── Step indicator for checking state ──────────────────────────
const steps = [
  { label: "Connecting to Stripe", icon: SiStripe },
  { label: "Verifying account", icon: IoShieldCheckmarkOutline },
  { label: "Confirming payout eligibility", icon: IoFlashOutline },
];

const StepProgress = ({ currentStep }) => (
  <div className="space-y-4 w-full max-w-xs mx-auto">
    {steps.map((step, i) => {
      const StepIcon = step.icon;
      const isActive = i <= currentStep;
      const isCurrent = i === currentStep;

      return (
        <motion.div
          key={step.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.15 }}
          className={`flex items-center gap-3.5 ${
            !isActive ? "opacity-30" : ""
          }`}
        >
          <div
            className={`relative size-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 ${
              isCurrent
                ? "bg-[#635BFF] shadow-lg shadow-[#635BFF]/30"
                : isActive
                ? "bg-emerald-500 shadow-lg shadow-emerald-500/30"
                : "bg-slate-200"
            }`}
          >
            {isActive && i < currentStep ? (
              <IoCheckmarkCircle className="size-4 text-white" />
            ) : isCurrent ? (
              <div className="size-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <StepIcon className="size-4 text-slate-400" />
            )}
          </div>
          <span
            className={`text-sm font-medium ${
              isCurrent
                ? "text-[#635BFF]"
                : isActive
                ? "text-emerald-600"
                : "text-slate-400"
            }`}
          >
            {step.label}
          </span>
        </motion.div>
      );
    })}
  </div>
);

// ─── Status Stats ────────────────────────────────────────────────
const StatBadge = ({ label, value, positive }) => (
  <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span
      className={`text-sm font-semibold flex items-center gap-1.5 ${
        positive ? "text-emerald-600" : "text-slate-700"
      }`}
    >
      {positive && (
        <span className="size-1.5 rounded-full bg-emerald-500 inline-block" />
      )}
      {value}
    </span>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────
const StripeConnectionSuccess = () => {
  const {
    data: status,
    isLoading,
    refetch,
  } = useStripeConnectionStatus();
  const dashboardMutation = useStripeDashboard();

  const [checking, setChecking] = useState(true);
  const [progressStep, setProgressStep] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiKey, setConfettiKey] = useState(0);

  const isStripeConnected = status?.is_connected;
  const payoutsActive = status?.can_receive_payouts;
  const isPayoutPending = isStripeConnected && !payoutsActive;

  // Progress through steps while checking
  useEffect(() => {
    if (!checking) return;
    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev < 2) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [checking]);

  // Retry status polling — stop once we have a definitive state
  useEffect(() => {
    const hasResult = status && (status?.is_connected || status?.can_receive_payouts === false);
    if (!checking || hasResult) return;

    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      refetch();
      if (attempts >= 8) {
        clearInterval(interval);
        setChecking(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [refetch, checking, status]);

  // When data loads, stop checking after a short delay
  useEffect(() => {
    if (!isLoading && status) {
      const timer = setTimeout(() => {
        setChecking(false);
        if (payoutsActive && isStripeConnected) {
          setShowConfetti(true);
          setConfettiKey((k) => k + 1);
        }
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isLoading, status, payoutsActive, isStripeConnected]);

  // Determine page state
  const pageState = checking || isLoading
    ? "checking"
    : isStripeConnected && payoutsActive
    ? "connected"
    : isStripeConnected && isPayoutPending
    ? "pending_payouts"
    : status
    ? "pending"
    : "error";

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Confetti on success */}
      <AnimatePresence>
        {showConfetti && pageState === "connected" && <ConfettiRain key={confettiKey} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="relative w-full max-w-lg"
      >
        {/* ── Main Card ── */}
        <motion.div
          layout
          className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-slate-900/10 border border-slate-200/60 overflow-hidden"
        >
          {/* Top accent bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#635BFF] via-[#00AEEF] to-[#635BFF]" />

          <div className="p-8 sm:p-10">
            {/* ── Icon Circle ── */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 250,
                damping: 18,
              }}
              className="mx-auto mb-7"
            >
              <div className="relative size-24 mx-auto">
                {/* Ripple effect for checking */}
                {pageState === "checking" && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-[#635BFF]"
                    animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}

                {/* Pulsing ring for connected */}
                {pageState === "connected" && (
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-emerald-400"
                    animate={{ scale: [1, 1.25], opacity: [0.4, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut",
                      delay: 0.5,
                    }}
                  />
                )}

                <div
                  className={`size-full rounded-full flex items-center justify-center relative z-10 ${
                    pageState === "checking"
                      ? "bg-gradient-to-br from-indigo-50 to-blue-50"
                      : pageState === "connected"
                      ? "bg-gradient-to-br from-emerald-50 to-green-50"
                      : pageState === "pending_payouts"
                      ? "bg-gradient-to-br from-blue-50 to-indigo-50"
                      : "bg-gradient-to-br from-amber-50 to-orange-50"
                  }`}
                >
                  {pageState === "checking" ? (
                    <SiStripe className="size-9 text-[#635BFF]" />
                  ) : pageState === "connected" ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: 0.3,
                      }}
                    >
                      <IoCheckmarkCircle className="size-10 text-emerald-500" />
                    </motion.div>
                  ) : pageState === "pending_payouts" ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 15,
                        delay: 0.3,
                      }}
                    >
                      <IoCheckmarkCircle className="size-10 text-blue-500" />
                    </motion.div>
                  ) : (
                    <IoCloseCircle className="size-10 text-amber-500" />
                  )}
                </div>
              </div>
            </motion.div>

            {/* ── Title & Message ── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center mb-8"
            >
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                {pageState === "checking"
                  ? "Connecting to Stripe"
                  : pageState === "connected"
                  ? "Stripe Connected Successfully!"
                  : pageState === "pending_payouts"
                  ? "Stripe Account Connected"
                  : pageState === "pending"
                  ? "Setup Not Complete"
                  : "Connection Error"}
              </h2>

              <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-sm mx-auto">
                {pageState === "checking"
                  ? "We're securely linking your Stripe account. This should only take a moment..."
                  : pageState === "connected"
                  ? "Your Stripe account is fully connected and ready to receive payouts. You're all set to manage payments seamlessly."
                  : pageState === "pending_payouts"
                  ? "Your Stripe account is linked successfully. Payouts are being enabled — Stripe is reviewing your account, which typically takes 1–2 business days."
                  : pageState === "pending"
                  ? "Your Stripe account hasn't completed the setup process yet. Please finish the onboarding to enable payouts."
                  : "We couldn't verify your Stripe connection status. This might be a temporary issue."}
              </p>
            </motion.div>

            {/* ── Checking Progress ── */}
            {pageState === "checking" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <StepProgress currentStep={progressStep} />
              </motion.div>
            )}

            {/* ── Connected: Account Details (full payouts active) ── */}
            {pageState === "connected" && status && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-8"
              >
                {/* Success banner */}
                <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-xl p-4 mb-5 flex items-start gap-3">
                  <IoRocketOutline className="size-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Payouts are active
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      Camp fees will be paid directly to your connected Stripe
                      account.
                    </p>
                  </div>
                </div>

                {/* Account info card */}
                <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Account Details
                  </h4>
                  <div className="divide-y divide-slate-100">
                    <StatBadge
                      label="Stripe Account"
                      value={
                        status.stripe_account
                          ? `${status.stripe_account.slice(0, 6)}...${status.stripe_account.slice(-4)}`
                          : "Connected"
                      }
                      positive
                    />
                    <StatBadge
                      label="Payout Eligibility"
                      value={status.can_receive_payouts ? "Eligible" : "Pending"}
                      positive={status.can_receive_payouts}
                    />
                    <StatBadge
                      label="Connection Status"
                      value={status.is_connected ? "Active" : "Inactive"}
                      positive={status.is_connected}
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Pending Payouts: Connected but payouts not yet enabled ── */}
            {pageState === "pending_payouts" && status && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-8"
              >
                {/* Info banner */}
                <div className="bg-blue-50/80 border border-blue-200/60 rounded-xl p-4 mb-5 flex items-start gap-3">
                  <IoFlashOutline className="size-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Stripe is connected — payouts are being enabled
                    </p>
                    <p className="text-xs text-blue-600 mt-0.5">
                      Stripe is reviewing your account details. This usually takes 1–2 business days. You&apos;ll be able to receive payouts once the review is complete.
                    </p>
                  </div>
                </div>

                {/* Account info card */}
                <div className="bg-slate-50/80 border border-slate-200/60 rounded-xl p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                    Account Details
                  </h4>
                  <div className="divide-y divide-slate-100">
                    <StatBadge
                      label="Stripe Account"
                      value={
                        status.stripe_account
                          ? `${status.stripe_account.slice(0, 6)}...${status.stripe_account.slice(-4)}`
                          : "Connected"
                      }
                      positive
                    />
                    <StatBadge
                      label="Payout Eligibility"
                      value="Being enabled"
                      positive={false}
                    />
                    <StatBadge
                      label="Connection Status"
                      value="Active"
                      positive
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Pending: Troubleshooting ── */}
            {pageState === "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-8"
              >
                <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-5">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-500 mb-3 flex items-center gap-2">
                    <IoRemoveCircleOutline className="size-3.5" />
                    Steps to complete
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Complete the Stripe onboarding form",
                      "Verify your business/identity details",
                      "Add a bank account for payouts",
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <span className="size-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-slate-600">{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* ── Error State ── */}
            {pageState === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="mb-8"
              >
                <div className="bg-red-50/80 border border-red-200/60 rounded-xl p-5 text-center">
                  <p className="text-sm text-red-700 mb-3">
                    Could not verify connection status.
                  </p>
                  <button
                    onClick={() => {
                      refetch();
                      setChecking(true);
                      setProgressStep(0);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded-lg transition-all"
                  >
                    <FiRefreshCw className="size-3.5" />
                    Try Again
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Actions ── */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="space-y-3"
            >
              {pageState === "connected" || pageState === "pending_payouts" ? (
                <>
                  <Link
                    to="/director-dashboard"
                    className="group inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-gradient-to-r from-[#635BFF] to-[#00AEEF] hover:from-[#4f47e6] hover:to-[#0099d4] text-white font-semibold rounded-xl transition-all shadow-lg shadow-[#635BFF]/20 hover:shadow-[#635BFF]/30"
                  >
                    Go to Dashboard
                    <IoArrowForward className="size-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <button
                    onClick={() => dashboardMutation.mutate()}
                    disabled={dashboardMutation.isPending}
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all disabled:opacity-50"
                  >
                    {dashboardMutation.isPending ? (
                      <>
                        <div className="size-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                        Opening Stripe...
                      </>
                    ) : (
                      <>
                        <FiExternalLink className="size-4" />
                        View Stripe Dashboard
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/director-dashboard"
                    className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-all"
                  >
                    <FiArrowLeft className="size-4" />
                    Return to Dashboard
                  </Link>
                  {pageState === "pending" && (
                    <button
                      onClick={() => {
                        setChecking(true);
                        setProgressStep(0);
                        refetch();
                      }}
                      className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 text-sm text-[#635BFF] hover:text-[#4f47e6] font-medium rounded-xl transition-all"
                    >
                      <FiRefreshCw className="size-3.5" />
                      Check status again
                    </button>
                  )}
                </>
              )}
            </motion.div>

            {/* ── Footer note ── */}
            {(pageState === "connected" || pageState === "pending_payouts") && status?.stripe_account && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-[11px] text-slate-400 text-center"
              >
                Account ID: {status.stripe_account.slice(0, 8)}...
                {status.stripe_account.slice(-4)}
              </motion.p>
            )}

            {pageState === "checking" && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 text-[11px] text-slate-400 text-center"
              >
                Please don&apos;t close this page while we verify your connection
              </motion.p>
            )}
          </div>
        </motion.div>

        {/* ── Trust badge ── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-5 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5"
        >
          <IoShieldCheckmarkOutline className="size-3.5" />
          Secured by Stripe · Your payment data is encrypted
        </motion.p>
      </motion.div>
    </div>
  );
};

export default StripeConnectionSuccess;
