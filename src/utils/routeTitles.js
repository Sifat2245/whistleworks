/**
 * Mapping of static route paths to document titles.
 */
export const ROUTE_TITLES = {
  // ── Public Pages ───────────────────────────────────────
  "/": "WhistleWorks - Official Referee Camp Management & Scheduling",
  "/about-us": "About Us",
  "/all-camps": "Explore Camps",
  "/faq": "FAQ",
  "/whats-new": "What's New",
  "/privacy-policy": "Privacy Policy",
  "/terms-conditions": "Terms & Conditions",

  // ── Authentication ─────────────────────────────────────
  "/auth/signin": "Sign In",
  "/auth/signup": "Sign Up",
  "/auth/forget-password": "Forgot Password",
  "/auth/reset-password": "Reset Password",
  "/auth/reset-password-otp": "Reset Password Verification",
  "/auth/verify-otp": "Verify Email",

  // ── Director Dashboard ─────────────────────────────────
  "/director-dashboard": "Director Dashboard",
  "/director-dashboard/create-new-camp": "Create New Camp",
  "/director-dashboard/previous-camps": "Previous Camps",
  "/director-dashboard/assigned-camps": "Assigned Camps",
  "/director-dashboard/profile": "Profile Settings",
  "/director-dashboard/stripe-connection-success": "Stripe Connected",
  "/director-dashboard/ai-assistant": "AI Director Assistant",

  // ── Evaluator Dashboard ────────────────────────────────
  "/evaluator-dashboard": "Evaluator Dashboard",
  "/evaluator-dashboard/active-camps": "My Active Camps",
  "/evaluator-dashboard/find-camps": "Find Camps",
  "/evaluator-dashboard/previous-camps": "Previous Camps",
  "/evaluator-dashboard/profile": "Profile Settings",

  // ── Referee Dashboard ──────────────────────────────────
  "/referee-dashboard": "Referee Dashboard",
  "/referee-dashboard/active-camps": "My Camps",
  "/referee-dashboard/find-camps": "Find Camps",
  "/referee-dashboard/previous-camps": "Previous Camps",
  "/referee-dashboard/payment-success": "Payment Successful",
  "/referee-dashboard/payment-cancel": "Payment Cancelled",
  "/referee-dashboard/profile": "Profile Settings",
};

export const DEFAULT_DOCUMENT_TITLE = "WhistleWorks - Official Referee Camp Management";

/**
 * Formats a given title string with the brand suffix if not already present.
 */
export const formatTitle = (title) => {
  if (!title) return DEFAULT_DOCUMENT_TITLE;
  const trimmed = title.trim();
  if (trimmed.toLowerCase().includes("whistleworks") || trimmed.toLowerCase().includes("whistle works")) {
    return trimmed;
  }
  return `${trimmed}`;
};

/**
 * Resolves a title from a pathname string, handling both static and parameterized dynamic routes.
 */
export const getTitleForPathname = (pathname = "") => {
  const normalized =
    pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

  if (ROUTE_TITLES[normalized]) {
    return ROUTE_TITLES[normalized];
  }

  // Dynamic parameterized routes
  if (normalized.startsWith("/all-camps/")) {
    return "Camp Details";
  }
  if (normalized.startsWith("/director-dashboard/camp-overview/")) {
    return "Camp Overview";
  }
  if (normalized.startsWith("/director-dashboard/edit-camp/")) {
    return "Edit Camp";
  }
  if (normalized.startsWith("/director-dashboard/build-schedule/")) {
    return "Build Schedule";
  }
  if (normalized.startsWith("/director-dashboard/court-list/")) {
    return "Court List";
  }
  if (normalized.startsWith("/director-dashboard/camp-schedules/")) {
    return "Camp Schedules";
  }
  if (normalized.startsWith("/director-dashboard/ranking/")) {
    return "Camp Rankings";
  }
  if (normalized.startsWith("/director-dashboard/roster/")) {
    return "Camp Roster";
  }
  if (normalized.startsWith("/director-dashboard/make-announcement/")) {
    return "Make Announcement";
  }
  if (normalized.startsWith("/director-dashboard/evaluate/")) {
    return "Evaluate Referees";
  }
  if (normalized.startsWith("/director-dashboard/evaluation/")) {
    return "Camp Evaluations";
  }
  if (normalized.startsWith("/director-dashboard/active-evaluate/")) {
    return "Active Evaluations";
  }
  if (normalized.startsWith("/director-dashboard/active-crews/")) {
    return "Officiating Crews";
  }
  if (normalized.startsWith("/director-dashboard/crew-details/")) {
    return "Crew Details";
  }
  if (
    normalized.startsWith("/evaluator-dashboard/camp/") ||
    normalized.startsWith("/referee-dashboard/camp/") ||
    normalized.startsWith("/camp/details/")
  ) {
    return "Camp Details";
  }

  return DEFAULT_DOCUMENT_TITLE;
};
