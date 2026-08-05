import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiGrid,
  FiPlusCircle,
  FiClock,
  FiSearch,
  FiUser,
  FiLogOut,
  FiX,
  FiChevronRight,
} from "react-icons/fi";
import { SiStripe } from "react-icons/si";
import Logo from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import userImage from "@/assets/dashboard/userImage.png";

/* ── Per-role brand + palette ─────────────────────────────── */
const ROLE_META = {
  director: {
    label: "Director",
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
  },
  evaluator: {
    label: "Evaluator",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  referee: {
    label: "Referee",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
};

/* ── Nav config per role ──────────────────────────────────── */
// matchPrefix keeps the item highlighted while inside dynamic sub-routes.
const NAV_CONFIG = {
  director: [
    {
      section: "Management",
      items: [
        {
          id: "all-camps",
          label: "All Camps",
          icon: FiGrid,
          path: "/director-dashboard",
          matchPrefix: [
            "/director-dashboard/camp-overview",
            "/director-dashboard/edit-camp",
            "/director-dashboard/build-schedule",
            "/director-dashboard/court-list",
            "/director-dashboard/camp-schedules",
            "/director-dashboard/ranking",
            "/director-dashboard/roster",
            "/director-dashboard/make-announcement",
            "/director-dashboard/evaluate",
            "/director-dashboard/active-evaluate",
            "/director-dashboard/active-crews",
            "/director-dashboard/crew-details",
          ],
        },
        {
          id: "create-camp",
          label: "Create Camp",
          icon: FiPlusCircle,
          path: "/director-dashboard/create-new-camp",
        },
        {
          id: "previous-camps",
          label: "Previous Camps",
          icon: FiClock,
          path: "/director-dashboard/previous-camps",
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          id: "profile",
          label: "Profile",
          icon: FiUser,
          path: "/director-dashboard/profile",
        },
        {
          id: "stripe",
          label: "Stripe Connection",
          icon: SiStripe,
          path: "/director-dashboard/stripe-connection-success",
        },
      ],
    },
  ],
  referee: [
    {
      section: "Menu",
      items: [
        {
          id: "my-camps",
          label: "My Camps",
          icon: FiGrid,
          path: "/referee-dashboard",
          matchPrefix: [
            "/referee-dashboard/active-camps",
            "/referee-dashboard/camp",
            "/referee-dashboard/payment-success",
            "/referee-dashboard/payment-cancel",
          ],
        },
        {
          id: "find-camps",
          label: "Find Camps",
          icon: FiSearch,
          path: "/referee-dashboard/find-camps",
        },
        {
          id: "previous-camps",
          label: "Previous Camps",
          icon: FiClock,
          path: "/referee-dashboard/previous-camps",
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          id: "profile",
          label: "Profile",
          icon: FiUser,
          path: "/referee-dashboard/profile",
        },
      ],
    },
  ],
  evaluator: [
    {
      section: "Menu",
      items: [
        {
          id: "my-camps",
          label: "My Camps",
          icon: FiGrid,
          path: "/evaluator-dashboard",
          matchPrefix: [
            "/evaluator-dashboard/active-camps",
            "/evaluator-dashboard/camp",
          ],
        },
        {
          id: "find-camps",
          label: "Find Camps",
          icon: FiSearch,
          path: "/evaluator-dashboard/find-camps",
        },
        {
          id: "previous-camps",
          label: "Previous Camps",
          icon: FiClock,
          path: "/evaluator-dashboard/previous-camps",
        },
      ],
    },
    {
      section: "Account",
      items: [
        {
          id: "profile",
          label: "Profile",
          icon: FiUser,
          path: "/evaluator-dashboard/profile",
        },
      ],
    },
  ],
};

const isItemActive = (item, pathname) => {
  if (item.path && pathname === item.path) return true;
  return item.matchPrefix?.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
};

/* ── Sidebar pieces (module-level to avoid remount churn) ──── */
const SidebarLogo = ({ onClose }) => (
  <div className="flex h-[72px] shrink-0 items-center gap-3 border-b border-gray-100 px-5">
    <Link
      to={'/'}
      className="flex min-w-0 items-center gap-3"
      onClick={onClose}
    >
      <Logo className="size-9 shrink-0 sm:size-10" />
      <div className="min-w-0">
        <h1 className="truncate text-sm font-bold leading-tight tracking-wide text-primary">
          WHISTLE WORKS
        </h1>
       
      </div>
    </Link>
    {onClose && (
      <button
        type="button"
        onClick={onClose}
        aria-label="Close menu"
        className="ml-auto flex size-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
      >
        <FiX className="size-5" />
      </button>
    )}
  </div>
);

const SidebarNav = ({ nav, pathname }) => (
  <nav className="flex-1 overflow-y-auto px-3.5 py-5 hide-scrollbar">
    {nav.map((group) => (
      <div key={group.section} className="mb-6 last:mb-0">
        <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
          {group.section}
        </p>
        <div className="space-y-1">
          {group.items.map((item) => {
            const active = isItemActive(item, pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                aria-current={active ? "page" : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                    active
                      ? "bg-primary text-white shadow-sm shadow-primary/30"
                      : "bg-gray-100 text-gray-500 group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  <Icon className="size-[17px]" />
                </span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                {active && (
                  <FiChevronRight className="size-4 shrink-0 text-primary/60" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    ))}
  </nav>
);

const SidebarUserCard = ({ meta }) => {
  const { userData, handleLogout } = useAuth();
  const fullName =
    [userData?.first_name, userData?.last_name].filter(Boolean).join(" ") ||
    "User";

  return (
    <div className="shrink-0 border-t border-gray-100 p-3.5">
      <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-3">
        <div className="relative shrink-0">
          <div className="size-10 overflow-hidden rounded-full ring-2 ring-white shadow-sm">
            <img
              src={userData?.avatar || userImage}
              alt={fullName}
              className="h-full w-full object-cover"
            />
          </div>
          <span
            className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white ${meta.dot}`}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-gray-900">
            {fullName}
          </p>
          <p
            className={`mt-0.5 inline-flex items-center rounded-full px-2 py-px text-[9px] font-bold uppercase tracking-wide ${meta.badge}`}
          >
            {meta.label}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          title="Log out"
          aria-label="Log out"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 active:scale-95"
        >
          <FiLogOut className="size-[18px]" />
        </button>
      </div>
    </div>
  );
};

/* ── Main component ────────────────────────────────────────── */
const DashboardSidebar = ({
  role = "director",
  isOpen = false,
  onClose,
  containedDesktop = false,
}) => {
  const { pathname } = useLocation();

  const meta = ROLE_META[role] || ROLE_META.director;
  const nav = NAV_CONFIG[role] || NAV_CONFIG.director;

  // Auto-close the mobile drawer after navigating
  useEffect(() => {
    onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on Escape + lock body scroll while the drawer is open
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Desktop rail (always visible ≥ lg, full height) */}
      <aside
        className={`z-30 hidden w-[272px] flex-col border-r border-gray-100 bg-white lg:flex ${
          containedDesktop ? "sticky top-0 h-screen" : "fixed inset-y-0 left-0"
        }`}
      >
        <SidebarLogo meta={meta} role={role} />
        <SidebarNav nav={nav} pathname={pathname} />
        <SidebarUserCard meta={meta} />
      </aside>

      {/* Mobile drawer (animated, < lg) */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] lg:hidden"
            />
            <motion.aside
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Dashboard navigation"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] max-w-[85vw] flex-col bg-white shadow-2xl lg:hidden"
            >
              <SidebarLogo meta={meta} role={role} onClose={onClose} />
              <SidebarNav nav={nav} pathname={pathname} />
              <SidebarUserCard meta={meta} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DashboardSidebar;
