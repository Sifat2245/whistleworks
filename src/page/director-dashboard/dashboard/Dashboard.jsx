import { motion } from "framer-motion";
import { SiStripe } from "react-icons/si";
import {
  FiExternalLink,
  FiRefreshCw,
  FiPlus,
} from "react-icons/fi";
import MyCamps from "@/page/director-dashboard/dashboard/components/MyCampus";
import {
  useStripeConnectionStatus,
  useConnectStripe,
  useStripeDashboard,
} from "@/hooks/api/useStripConnection";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

// ── Stripe status card ─────────────────────────────────────────
const StripeStatCard = () => {
  const { data: stripeStatus, isLoading } = useStripeConnectionStatus();
  const connectMutation = useConnectStripe();
  const dashboardMutation = useStripeDashboard();

  const isConnected = stripeStatus?.can_receive_payouts && stripeStatus?.is_connected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`bg-white rounded-xl border shadow-sm p-4 sm:p-5 flex flex-col hover:shadow-md transition-all duration-200 ${
        isConnected ? "border-emerald-100" : "border-amber-100"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={`size-8 rounded-lg flex items-center justify-center ${
            isConnected ? "bg-emerald-50" : "bg-amber-50"
          }`}>
            <SiStripe className={`size-4 ${isConnected ? "text-emerald-600" : "text-amber-600"}`} />
          </div>
          <span className="text-sm font-semibold text-slate-800">Payouts</span>
        </div>
        {isLoading ? (
          <div className="size-2 rounded-full bg-slate-200 animate-pulse" />
        ) : (
          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
            isConnected ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          }`}>
            <span className={`size-1.5 rounded-full ${isConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
            {isConnected ? "Connected" : "Setup needed"}
          </span>
        )}
      </div>

      {/* Body */}
      <p className="text-xs text-slate-500 leading-relaxed mb-3">
        {isConnected
          ? "Camp fees are paid directly to your Stripe account."
          : "Connect Stripe to receive camp fees directly."}
      </p>

      {/* Action */}
      {isConnected ? (
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

      {stripeStatus?.stripe_account && isConnected && (
        <p className="mt-2 text-[10px] text-slate-400 truncate">
          {stripeStatus.stripe_account.slice(0, 14)}...
        </p>
      )}
    </motion.div>
  );
};

// ── Main Dashboard ─────────────────────────────────────────────
const DirectorHome = () => {
  const { userData } = useAuth();

  return (
    <div className="w-full ">
      {/* ── Welcome Header ── */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Welcome back{userData?.first_name ? `, ${userData.first_name}` : ""}
            </h1>
            <p className="text-sm sm:text-base text-slate-500 mt-1.5">
              Manage your camps, referees, and schedules.
            </p>
          </div>
          <Link
            to="/director-dashboard/create-new-camp"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#00AEEF] hover:bg-[#0099d4] text-white text-sm font-semibold rounded-xl transition-all shadow-lg shadow-[#00AEEF]/20 hover:shadow-[#00AEEF]/30 shrink-0"
          >
            <FiPlus className="size-4" />
            New Camp
          </Link>
        </div>
      </div>

      {/* ── Stripe Status ── */}
      <div className="mb-8 max-w-sm">
        <StripeStatCard />
      </div>

      {/* ── Camps List ── */}
      <MyCamps />
    </div>
  );
};

export default DirectorHome;