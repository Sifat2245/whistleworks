import { motion } from "framer-motion";
import { SiStripe } from "react-icons/si";
import { FiExternalLink, FiRefreshCw, FiPlus } from "react-icons/fi";
import MyCamps from "@/page/dashboard/director-dashboard/dashboard/components/MyCampus";
import {
  useStripeConnectionStatus,
  useConnectStripe,
  useStripeDashboard,
} from "@/hooks/api/director-hooks/useStripConnection";
import { Link } from "react-router-dom";

// ── Skeleton ────────────────────────────────────────────────────
const StripeStatCardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4 sm:p-5 flex flex-col animate-pulse">
    {/* Header */}
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-lg bg-slate-100" />
        <div className="h-4 w-16 bg-slate-100 rounded" />
      </div>
      <div className="h-5 w-24 bg-slate-100 rounded-full" />
    </div>

    {/* Body */}
    <div className="space-y-2 mb-3">
      <div className="h-3 w-full bg-slate-100 rounded" />
      <div className="h-3 w-3/4 bg-slate-100 rounded" />
    </div>

    {/* Action */}
    <div className="h-9 w-full bg-slate-100 rounded-lg" />
  </div>
);

// ── Stripe status card ─────────────────────────────────────────
const StripeStatCard = () => {
  const { data: stripeStatus, isLoading } = useStripeConnectionStatus();
  const connectMutation = useConnectStripe();
  const dashboardMutation = useStripeDashboard();

  const isStripeConnected = stripeStatus?.is_connected;
  const payoutsActive = stripeStatus?.can_receive_payouts;
  const isPayoutPending = isStripeConnected && !payoutsActive;

  if (isLoading) return <StripeStatCardSkeleton />;

  // Determine the card state
  const cardState = !isStripeConnected
    ? "disconnected"
    : isPayoutPending
      ? "pending_payouts"
      : "connected";

  const borderColor =
    cardState === "connected"
      ? "border-emerald-100"
      : cardState === "pending_payouts"
        ? "border-orange-100"
        : "border-amber-100";

  const badgeStyle =
    cardState === "connected"
      ? "bg-emerald-50 text-emerald-600"
      : cardState === "pending_payouts"
        ? "bg-orange-50 text-orange-600"
        : "bg-amber-50 text-amber-600";

  const dotColor =
    cardState === "connected"
      ? "bg-emerald-500"
      : cardState === "pending_payouts"
        ? "bg-orange-500"
        : "bg-amber-500";

  const badgeLabel =
    cardState === "connected"
      ? "Active"
      : cardState === "pending_payouts"
        ? "Connected"
        : "Setup needed";

  const iconBg =
    cardState === "connected"
      ? "bg-emerald-50"
      : cardState === "pending_payouts"
        ? "bg-orange-50"
        : "bg-amber-50";

  const stripeIconColor =
    cardState === "connected"
      ? "text-emerald-600"
      : cardState === "pending_payouts"
        ? "text-orange-600"
        : "text-amber-600";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`bg-white rounded-xl border shadow-sm p-4 sm:p-5 flex flex-col hover:shadow-md transition-all duration-200 ${borderColor}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className={`size-8 rounded-lg flex items-center justify-center ${iconBg}`}
          >
            <SiStripe className={`size-4 ${stripeIconColor}`} />
          </div>
          <span className="text-sm font-semibold text-slate-800">Payouts</span>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${badgeStyle}`}
        >
          <span className={`size-1.5 rounded-full ${dotColor}`} />
          {badgeLabel}
        </span>
      </div>

      {/* Body */}
      <div className="mb-3 space-y-1.5">
        {cardState === "connected" && (
          <p className="text-xs text-slate-500 leading-relaxed">
            Camp fees are paid directly to your Stripe account. Payouts are
            active.
          </p>
        )}
        {cardState === "pending_payouts" && (
          <>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your Stripe account is connected. Payouts are being enabled — this
              typically takes 1–2 business days.
            </p>
            <p className="text-[11px] text-orange-600 flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-orange-400 animate-pulse" />
              Waiting for Stripe to verify your account
            </p>
          </>
        )}
        {cardState === "disconnected" && (
          <p className="text-xs text-slate-500 leading-relaxed">
            Connect Stripe to receive camp fees directly.
          </p>
        )}
      </div>

      {/* Action */}
      {cardState === "connected" ? (
        <button
          onClick={() => dashboardMutation.mutate()}
          disabled={dashboardMutation.isPending}
          className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-700 transition-all disabled:opacity-50"
        >
          {dashboardMutation.isPending ? (
            <FiRefreshCw className="size-3 animate-spin" />
          ) : (
            <FiExternalLink className="size-3" />
          )}
          Dashboard
        </button>
      ) : cardState === "pending_payouts" ? (
        <button
          onClick={() => dashboardMutation.mutate()}
          disabled={dashboardMutation.isPending}
          className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-all disabled:opacity-50"
        >
          {dashboardMutation.isPending ? (
            <div className="size-3 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
          ) : (
            <FiExternalLink className="size-3" />
          )}
          View Stripe
        </button>
      ) : (
        <button
          onClick={() => connectMutation.mutate()}
          disabled={connectMutation.isPending}
          className="inline-flex items-center justify-center gap-1.5 w-full px-3 py-2 text-xs font-medium text-white bg-[#635BFF] hover:bg-[#4f47e6] rounded-lg transition-all disabled:opacity-50 shadow-sm"
        >
          {connectMutation.isPending ? (
            <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <FiExternalLink className="size-3" />
          )}
          Connect
        </button>
      )}

      {stripeStatus?.stripe_account && isStripeConnected && (
        <p className="mt-2 text-[10px] text-slate-400 truncate">
          {stripeStatus.stripe_account.slice(0, 14)}...
        </p>
      )}
    </motion.div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────
const DirectorHome = () => {
  return (
    <div className="w-full ">
      {/* ── Welcome Header ── */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0">
          <StripeStatCard />
          <Link
            to="/director-dashboard/create-new-camp"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00AEEF] hover:bg-[#0099d4] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#00AEEF]/20 hover:shadow-[#00AEEF]/30 shrink-0"
          >
            <FiPlus className="size-4" />
            New Camp
          </Link>
        </div>
      </div>

      {/* ── Camps List ── */}
      <MyCamps />
    </div>
  );
};

export default DirectorHome;
