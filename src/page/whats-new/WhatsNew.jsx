import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiSliders,
  FiUsers,
  FiCalendar,
  FiTrendingUp,
  FiAward,
  FiLayers,
  FiGrid,
  FiLock,
  FiZap,
  FiClock,
  FiDollarSign,
  FiBookOpen,
  FiChevronRight,
  FiMenu,
  FiX,
} from "react-icons/fi";

// Import screenshots for the Assistant Director update
import manageCampBtn from "@/assets/new-updates-asset/manage-camp-button.png";
import myAssignedCamps from "@/assets/new-updates-asset/my-assigned-camps.png";
import selectDirector from "@/assets/new-updates-asset/select-director.png";
import selectPermission from "@/assets/new-updates-asset/select-permission.png";
import updatePermissionOrRemoveDirector from "@/assets/new-updates-asset/update-permission-or-remove-director.png";

const RELEASES_DATA = [
  {
    version: "v1.2.0",
    date: "August 15, 2026",
    title: "Delegated Camp Control & Granular Permissions",
    category: "New Feature",
    summary:
      "Directors can now delegate management by assigning other directors as assistants. This release introduces role delegation with complete granular control over what sections assistants can view, edit, or manage.",
    type: "documentation",
    sections: [
      {
        id: "feature-intro",
        title: "Overview & Workflows",
        content:
          "Managing large camps can be operationally intensive. The delegation system allows camp owners to invite registered directors to co-manage their camp. By selecting granular permissions, you ensure assistants only access the features they need, keeping financials and overall camp settings secure.",
      },
      {
        id: "walkthrough",
        title: "Step-by-Step Setup Guide",
        isSteps: true,
        steps: [
          {
            number: "1",
            title: "Initiate Camp Delegation",
            description:
              "Navigate to your camp details or overview dashboard. Locate the 'Manage Camp' action button on the upper section of your camp card or page header. Clicking this opens the assignment panel.",
            image: manageCampBtn,
            alt: "Manage Camp Action button",
          },
          {
            number: "2",
            title: "Select an Assistant Director",
            description:
              "Use the dropdown select inside the modal to search and select from the list of registered directors. This links the user directly as an assistant to your camp.",
            image: selectDirector,
            alt: "Assigning assistant director dropdown",
          },
          {
            number: "3",
            title: "Configure Granular Permissions",
            description:
              "Assign specific administrative tasks by toggling permission switches. Toggle access rules for rosters, schedules, rankings, evaluations, crews, or court configurations depending on the assistant's responsibilities.",
            image: selectPermission,
            alt: "Granular permission settings",
          },
          {
            number: "4",
            title: "Assistant Access View",
            description:
              "Once saved, the camp will immediately appear in the assistant director's dashboard under a new tab: 'My Assigned Camps'. They can click through to access the sections you authorized.",
            image: myAssignedCamps,
            alt: "Assigned camps list",
          },
          {
            number: "5",
            title: "Adjust or Revoke Access",
            description:
              "Need to adjust access or end delegation? Re-open the 'Manage Camp' panel at any point to modify active permissions or completely remove the assistant. Revocation is instant, securing your data immediately.",
            image: updatePermissionOrRemoveDirector,
            alt: "Modify assistant panel",
          },
        ],
      },
      {
        id: "permissions",
        title: "Understanding Permission Scopes",
        isPermissionsTable: true,
        permissions: [
          {
            name: "Roster",
            icon: FiUsers,
            desc: "Permits managing camp referee participants, search, and details.",
          },
          {
            name: "Schedules",
            icon: FiCalendar,
            desc: "Permits building, updating, and managing court and match schedules.",
          },
          {
            name: "Ranking",
            icon: FiTrendingUp,
            desc: "Permits updating and managing referee performance tier lists.",
          },
          {
            name: "Evaluation",
            icon: FiAward,
            desc: "Permits entering and viewing official referee performance ratings.",
          },
          {
            name: "Crews",
            icon: FiLayers,
            desc: "Permits grouping and editing referee crew configurations.",
          },
          {
            name: "Court List",
            icon: FiGrid,
            desc: "Permits modifying court layouts, names, and allocations.",
          },
        ],
      },
      {
        id: "security",
        title: "Security & Administrative Limits",
        isSecurity: true,
        security: [
          {
            title: "No Billing & Financial Access",
            desc: "Stripe connection status, payout setups, and financial data remain restricted to the primary camp owner.",
            icon: FiLock,
          },
          {
            title: "Restricted Delegation Cascading",
            desc: "Assistant directors cannot assign other assistant directors or perform destructive actions like camp deletion.",
            icon: FiLock,
          },
          {
            title: "Real-time Permission Sync",
            desc: "Changes saved to the permissions list immediately take effect in the assistant's active session.",
            icon: FiCheckCircle,
          },
        ],
      },
    ],
  },
  {
    version: "v1.1.0",
    date: "July 28, 2026",
    title: "Slot-Based Scheduling & Crew Assignments",
    category: "UX Improvement",
    summary:
      "This release updates scheduling capabilities from global templates to flexible court-level slots. Directors can now assign pre-built referee crews or individual referees per slot, with automatic collision warnings.",
    type: "documentation",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "To allow flexible and dynamic tournament layouts, you can now manage referee assignments at the slot level. Double-booking conflict checks are performed instantly, keeping scheduling operations flawless.",
      },
      {
        id: "features",
        title: "Key Capabilities",
        isHighlightsList: true,
        highlights: [
          {
            title: "Slot-Level Crew & Ref Assignments",
            desc: "Assign a complete pre-built referee crew or single referees on a slot-by-slot basis, allowing full customization for complex tournament grids.",
            icon: FiGrid,
          },
          {
            title: "Real-Time Conflict Prevention",
            desc: "The system automatically alerts you with double-booking warnings if a referee or crew is scheduled on multiple courts simultaneously.",
            icon: FiZap,
          },
          {
            title: "Court Layout Customization",
            desc: "Add custom names, labels, and match times directly to court schedules to match the physical layout of your venue.",
            icon: FiSliders,
          },
        ],
      },
    ],
  },
  {
    version: "v1.0.0",
    date: "June 12, 2026",
    title: "Stripe Connect Registration Integration",
    category: "Core Setup",
    summary:
      "Core release introducing Stripe Connect integration to facilitate automated referee registrations, entry fee collections, and direct payments to your bank account.",
    type: "documentation",
    sections: [
      {
        id: "overview",
        title: "Overview",
        content:
          "Easily receive camp registration fees directly to your account. Onboard through Stripe Connect and allow referees to search, register, and pay online securely.",
      },
      {
        id: "capabilities",
        title: "Highlights",
        isHighlightsList: true,
        highlights: [
          {
            title: "Single-Click Stripe Onboarding",
            desc: "Connect your Stripe account instantly via the director dashboard to enable billing and automated online referee registration payments.",
            icon: FiDollarSign,
          },
          {
            title: "Live Payment Status Cards",
            desc: "Monitor your connection status, pending verifications, and payout eligibility in real time with our status indicator widgets.",
            icon: FiCheckCircle,
          },
          {
            title: "Seamless Referee Registration Flow",
            desc: "Referees can find camps, view registration fees, and complete sign-up checkout securely through Stripe-powered forms.",
            icon: FiUsers,
          },
        ],
      },
    ],
  },
];

const WhatsNew = () => {
  const { userData } = useAuth();
  const userRole = userData?.role;
  const [selectedVersion, setSelectedVersion] = useState(
    RELEASES_DATA[0].version,
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const activeRelease =
    RELEASES_DATA.find((r) => r.version === selectedVersion) ||
    RELEASES_DATA[0];

  const dashboardPath =
    {
      director: "/director-dashboard",
      evaluator: "/evaluator-dashboard",
      referee: "/referee-dashboard",
    }[userRole] || "/";

  // Scroll to section helper
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  // Reusable Sidebar Menu content to avoid duplication
  const renderSidebarContent = () => (
    <div className="space-y-8">
      {/* Version Navigator */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-2">
          <FiClock className="size-3.5" />
          Release History
        </h3>
        <nav className="space-y-1">
          {RELEASES_DATA.map((release) => {
            const isActive = release.version === selectedVersion;
            return (
              <button
                key={release.version}
                onClick={() => {
                  setSelectedVersion(release.version);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center cursor-pointer ${
                  isActive
                    ? "bg-slate-100 text-primary font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <span>{release.title.split(" & ")[0]}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* In-Page Navigation / Table of Contents */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 px-2">
          <FiBookOpen className="size-3.5" />
          On This Page
        </h3>
        <nav className="space-y-1">
          {activeRelease.sections.map((sect) => (
            <button
              key={sect.id}
              onClick={() => {
                scrollToSection(sect.id);
                setIsMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <FiChevronRight className="size-3 text-slate-300" />
              {sect.title}
            </button>
          ))}
        </nav>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2">
          Actions
        </h3>
        <div className="space-y-1 px-2">
          <Link
            to={dashboardPath}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-xs font-medium text-primary hover:underline flex items-center gap-1.5"
          >
            <FiArrowLeft className="size-3.5" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen text-slate-900 border-t border-slate-100">
      {/* Documentation Wrapper matching exactly Navbar width */}
      <div className="container max-w-screen-2xl py-6 sm:py-12">
        {/* Mobile Sub-Header & Menu Toggle Button */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <FiMenu className="size-4" />
            <span>Navigate Docs</span>
          </button>
          <span className="text-xs font-semibold text-primary truncate max-w-[180px]">
            {activeRelease.title.split(" & ")[0]}
          </span>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${
            isMobileMenuOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar Drawer Content */}
          <div
            className={`absolute left-0 top-0 h-full w-4/5 max-w-xs bg-white shadow-2xl p-6 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Documentation Menu
              </h3>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-xl cursor-pointer"
              >
                <FiX />
              </button>
            </div>

            {renderSidebarContent()}
          </div>
        </div>

        {/* Desktop Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12">
          {/* DESKTOP SIDEBAR (hidden on mobile, sticky on desktop) */}
          <aside className="hidden lg:block lg:col-span-3 lg:sticky lg:top-28 h-fit space-y-8">
            {renderSidebarContent()}
          </aside>

          {/* RIGHT CONTENT: Documentation Page */}
          <main className="lg:col-span-9 space-y-10 lg:pl-6">
            {/* Header / Meta */}
            <div className="space-y-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-2.5 text-xs text-slate-400 font-medium">
                <span>Docs</span>
                <span>/</span>
                <span>What&apos;s New</span>
                <span>/</span>
                <span className="text-slate-900 font-semibold">
                  {activeRelease.title}
                </span>
              </div>

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {activeRelease.title}
                </h1>
              </div>

              <div className="flex items-center gap-3 pt-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200">
                  {activeRelease.category}
                </span>
                <span className="text-xs text-slate-500">
                  Published {activeRelease.date}
                </span>
              </div>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-2 max-w-4xl">
                {activeRelease.summary}
              </p>
            </div>

            {/* Sections display */}
            <div className="space-y-12">
              {activeRelease.sections.map((sect) => (
                <section
                  key={sect.id}
                  id={sect.id}
                  className="space-y-5 scroll-mt-28"
                >
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight pb-2 border-b border-slate-100">
                    {sect.title}
                  </h2>

                  {/* Plain text section */}
                  {sect.content && (
                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-4xl">
                      {sect.content}
                    </p>
                  )}

                  {/* Highlights list (Changelog templates) */}
                  {sect.isHighlightsList && (
                    <div className="space-y-4 max-w-4xl">
                      {sect.highlights.map((h, index) => {
                        const Icon = h.icon;
                        return (
                          <div
                            key={index}
                            className="flex gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50"
                          >
                            <span className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <Icon className="size-4.5" />
                            </span>
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-900 text-sm">
                                {h.title}
                              </h4>
                              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                                {h.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Steps walkthrough (Guide Template) */}
                  {sect.isSteps && (
                    <div className="space-y-10 sm:space-y-14 max-w-4xl">
                      {sect.steps.map((step) => (
                        <div key={step.number} className="space-y-4">
                          {/* Step Number & Title */}
                          <div className="flex items-center gap-2">
                            <span className="flex items-center justify-center size-6 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
                              {step.number}
                            </span>
                            <h3 className="font-bold text-slate-900 text-base">
                              {step.title}
                            </h3>
                          </div>

                          {/* Step description */}
                          <p className="text-sm text-slate-600 leading-relaxed pl-8">
                            {step.description}
                          </p>

                          {/* Step Image */}
                          <div className="pl-8">
                            <div className="bg-slate-50 rounded-lg border border-slate-200 p-1 max-w-2xl shadow-sm">
                              <img
                                src={step.image}
                                alt={step.alt}
                                className="w-full h-auto rounded border border-slate-100"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Permissions table breakdown */}
                  {sect.isPermissionsTable && (
                    <div className="overflow-x-auto border border-slate-200 rounded-xl max-w-4xl shadow-sm">
                      <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Permission
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">
                              Scope Description
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-100">
                          {sect.permissions.map((perm) => {
                            const Icon = perm.icon;
                            return (
                              <tr
                                key={perm.name}
                                className="hover:bg-slate-50/50"
                              >
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900 flex items-center gap-2">
                                  <span className="size-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                                    <Icon className="size-4" />
                                  </span>
                                  {perm.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                  {perm.desc}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Security items Callout Box */}
                  {sect.isSecurity && (
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 max-w-4xl space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {sect.security.map((sec, index) => {
                          const Icon = sec.icon;
                          return (
                            <div key={index} className="space-y-2">
                              <span className="size-8 rounded-lg bg-slate-200/60 text-slate-700 flex items-center justify-center shrink-0">
                                <Icon className="size-4" />
                              </span>
                              <h4 className="font-bold text-slate-900 text-sm">
                                {sec.title}
                              </h4>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                {sec.desc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </section>
              ))}
            </div>

            {/* Doc Footer */}
            <div className="pt-8 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 max-w-4xl">
              <span>Whistle Works Technical Documentation</span>
              <span>&copy; {new Date().getFullYear()} Whistle Works</span>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default WhatsNew;
