import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiUser,
  FiShield,
  FiLogOut,
  FiChevronRight,
  FiExternalLink,
} from "react-icons/fi";
import { SiStripe } from "react-icons/si";
import { useStripeConnectionStatus, useConnectStripe, useStripeDashboard } from "@/hooks/api/useStripConnection";
import userImage from "@/assets/dashboard/userImage.png";

const roleColors = {
  director: "bg-purple-100 text-purple-700",
  evaluator: "bg-blue-100 text-blue-700",
  referee: "bg-emerald-100 text-emerald-700",
};

const containerVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

const UserPopover = ({ onNavigate }) => {
  const { userData, handleLogout } = useAuth();
  const userRole = userData?.role;

  const { data: stripeStatus, isLoading: stripeLoading } = useStripeConnectionStatus();
  const connectStripeMutation = useConnectStripe();
  const dashboardMutation = useStripeDashboard();

  const isStripeConnected = stripeStatus?.is_connected;
  const payoutsActive = stripeStatus?.can_receive_payouts;
  const isPayoutPending = isStripeConnected && !payoutsActive;

  const profilePath =
    {
      director: "/director-dashboard/profile",
      evaluator: "/evaluator-dashboard/profile",
      referee: "/referee-dashboard/profile",
    }[userRole] || "/";

  const dashboardPath =
    {
      director: "/director-dashboard",
      evaluator: "/evaluator-dashboard",
      referee: "/referee-dashboard",
    }[userRole] || "/";

  const menuGroups = [
    [
      { id: "dashboard", label: "Dashboard", path: dashboardPath, icon: FiGrid },
      { id: "profile", label: "Profile", path: profilePath, icon: FiUser },
    ],
    [
      { id: "privacy", label: "Privacy Policy", path: "/privacy-policy", icon: FiShield },
    ],
    [
      { id: "logout", label: "Logout", icon: FiLogOut, isAction: true },
    ],
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-64 p-2 select-none"
    >
      {/* Profile Header */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100"
      >
        <div className="relative shrink-0">
          <div className="size-11 rounded-full ring-2 ring-primary/20 overflow-hidden shadow-sm">
            <img
              src={userData?.avatar || userImage}
              alt={userData?.first_name || "User"}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 size-3.5 bg-emerald-400 border-2 border-white rounded-full" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {userData?.first_name || "User"}{" "}
              {userData?.last_name || ""}
            </p>
            <span
              className={`shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-semibold uppercase tracking-wide ${
                roleColors[userRole] || "bg-gray-100 text-gray-600"
              }`}
            >
              {userRole || "user"}
            </span>
          </div>
          <p className="text-xs text-gray-500 truncate mt-0.5">
            {userData?.email || ""}
          </p>
        </div>
      </motion.div>

      {/* Menu Items */}
      <div className="space-y-0.5">
        {menuGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            {groupIdx > 0 && (
              <div className="my-1 border-t border-gray-100" />
            )}
            {group.map((item) =>
              item.isAction ? (
                <motion.button
                  key={item.id}
                  variants={itemVariants}
                  onClick={() => {
                    onNavigate?.();
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200 group cursor-pointer"
                >
                  <span className="shrink-0 size-8 flex items-center justify-center rounded-lg bg-red-50 text-red-400 group-hover:bg-red-100 transition-colors">
                    <item.icon className="size-4" />
                  </span>
                  <span className="flex-1 text-left">{item.label}</span>
                  <FiChevronRight className="size-3.5 text-gray-300 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all" />
                </motion.button>
              ) : (
                <motion.div key={item.id} variants={itemVariants}>
                  <Link
                    to={item.path}
                    onClick={onNavigate}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all duration-200 group"
                  >
                    <span className="shrink-0 size-8 flex items-center justify-center rounded-lg bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      <item.icon className="size-4" />
                    </span>
                    <span className="flex-1 text-black text-left">{item.label}</span>
                    <FiChevronRight className="size-3.5 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                </motion.div>
              )
            )}
          </div>
        ))}
      </div>

      {/* Stripe Connection - Only for directors */}
      {userRole === "director" && (
        <motion.div variants={itemVariants}>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <div className="px-3 py-2.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Payments
                </span>
                <SiStripe className="size-4 text-[#635BFF]" />
              </div>

              {stripeLoading ? (
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-gray-300 animate-pulse" />
                  <span className="text-xs text-gray-400">Checking status...</span>
                </div>
              ) : isStripeConnected ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`size-2 rounded-full ${payoutsActive ? "bg-emerald-400" : "bg-amber-400"}`} />
                    <span className={`text-xs font-medium ${payoutsActive ? "text-emerald-600" : "text-amber-600"}`}>
                      Stripe connected
                    </span>
                  </div>
                  {isPayoutPending && (
                    <p className="text-[10px] text-amber-600 ml-4 leading-tight">
                      Payouts are being enabled — you&apos;ll receive a notification once they&apos;re active.
                    </p>
                  )}
                  {payoutsActive && (
                    <button
                      onClick={() => dashboardMutation.mutate()}
                      disabled={dashboardMutation.isPending}
                      className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-[11px] font-medium text-slate-600 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      {dashboardMutation.isPending ? (
                        <div className="size-3 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                      ) : (
                        <FiExternalLink className="size-3" />
                      )}
                      Stripe Dashboard
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => connectStripeMutation.mutate()}
                  disabled={connectStripeMutation.isPending}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-white bg-[#635BFF] hover:bg-[#4f47e6] disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm"
                >
                  {connectStripeMutation.isPending ? (
                    <>
                      <div className="size-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <FiExternalLink className="size-3.5" />
                      Connect Stripe
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

    </motion.div>
  );
};

export default UserPopover;
