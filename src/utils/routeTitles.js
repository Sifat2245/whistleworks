/**
 * Mapping of static route paths to document titles.
 */
export const ROUTE_TITLES = {
  // ── Public Pages ───────────────────────────────────────
  "/": "WhistleWorks - Official Referee Camp Management & Scheduling",
  "/about-us": "About Us | WhistleWorks",
  "/all-camps": "Explore Camps | WhistleWorks",
  "/faq": "FAQ | WhistleWorks",
  "/whats-new": "What's New | WhistleWorks",
  "/privacy-policy": "Privacy Policy | WhistleWorks",
  "/terms-conditions": "Terms & Conditions | WhistleWorks",

  // ── Authentication ─────────────────────────────────────
  "/auth/signin": "Sign In | WhistleWorks",
  "/auth/signup": "Sign Up | WhistleWorks",
  "/auth/forget-password": "Forgot Password | WhistleWorks",
  "/auth/reset-password": "Reset Password | WhistleWorks",
  "/auth/reset-password-otp": "Reset Password Verification | WhistleWorks",
  "/auth/verify-otp": "Verify Email | WhistleWorks",

  // ── Director Dashboard ─────────────────────────────────
  "/director-dashboard": "Director Dashboard | WhistleWorks",
  "/director-dashboard/create-new-camp": "Create New Camp | WhistleWorks",
  "/director-dashboard/previous-camps": "Previous Camps | WhistleWorks",
  "/director-dashboard/assigned-camps": "Assigned Camps | WhistleWorks",
  "/director-dashboard/profile": "Profile Settings | WhistleWorks",
  "/director-dashboard/stripe-connection-success": "Stripe Connected | WhistleWorks",

  // ── Evaluator Dashboard ────────────────────────────────
  "/evaluator-dashboard": "Evaluator Dashboard | WhistleWorks",
  "/evaluator-dashboard/active-camps": "My Active Camps | WhistleWorks",
  "/evaluator-dashboard/find-camps": "Find Camps | WhistleWorks",
  "/evaluator-dashboard/previous-camps": "Previous Camps | WhistleWorks",
  "/evaluator-dashboard/profile": "Profile Settings | WhistleWorks",

  // ── Referee Dashboard ──────────────────────────────────
  "/referee-dashboard": "Referee Dashboard | WhistleWorks",
  "/referee-dashboard/active-camps": "My Camps | WhistleWorks",
  "/referee-dashboard/find-camps": "Find Camps | WhistleWorks",
  "/referee-dashboard/previous-camps": "Previous Camps | WhistleWorks",
  "/referee-dashboard/payment-success": "Payment Successful | WhistleWorks",
  "/referee-dashboard/payment-cancel": "Payment Cancelled | WhistleWorks",
  "/referee-dashboard/profile": "Profile Settings | WhistleWorks",
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
  return `${trimmed} | WhistleWorks`;
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
    return "Camp Details | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/camp-overview/")) {
    return "Camp Overview | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/edit-camp/")) {
    return "Edit Camp | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/build-schedule/")) {
    return "Build Schedule | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/court-list/")) {
    return "Court List | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/camp-schedules/")) {
    return "Camp Schedules | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/ranking/")) {
    return "Camp Rankings | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/roster/")) {
    return "Camp Roster | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/make-announcement/")) {
    return "Make Announcement | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/evaluate/")) {
    return "Evaluate Referees | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/active-evaluate/")) {
    return "Active Evaluations | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/active-crews/")) {
    return "Officiating Crews | WhistleWorks";
  }
  if (normalized.startsWith("/director-dashboard/crew-details/")) {
    return "Crew Details | WhistleWorks";
  }
  if (
    normalized.startsWith("/evaluator-dashboard/camp/") ||
    normalized.startsWith("/referee-dashboard/camp/") ||
    normalized.startsWith("/camp/details/")
  ) {
    return "Camp Details | WhistleWorks";
  }

  return DEFAULT_DOCUMENT_TITLE;
};
