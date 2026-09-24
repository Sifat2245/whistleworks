import {
  MdOutlineSportsBasketball,
  MdOutlineSportsTennis,
  MdOutlineSportsVolleyball,
  MdOutlineSportsCricket,
  MdOutlineSportsBaseball,
  MdOutlineSportsFootball,
  MdOutlineSportsSoccer,
  MdOutlineSportsGolf,
  MdOutlineSportsHockey,
  MdOutlineSportsRugby,
  MdOutlineSportsHandball,
  MdOutlineSportsMma,
  MdOutlineSportsGymnastics,
  MdOutlineSports,
} from "react-icons/md";
import {
  FaBaseballBatBall,
  FaPersonSwimming,
  FaPersonRunning,
} from "react-icons/fa6";

/**
 * Configuration registry for sports.
 * Ordered intentionally so more specific multi-word sports match before generic ones.
 */
export const SPORT_CONFIGS = [
  // ── Basketball ─────────────────────────────────────────
  {
    key: "basketball",
    keywords: ["basketball", "bball", "b-ball", "hoop"],
    icon: MdOutlineSportsBasketball,
    label: "Basketball",
    bgTint: "bg-orange-50 text-orange-600",
    color: "#EA580C",
  },
  // ── Volleyball ─────────────────────────────────────────
  {
    key: "volleyball",
    keywords: ["volleyball", "volley"],
    icon: MdOutlineSportsVolleyball,
    label: "Volleyball",
    bgTint: "bg-sky-50 text-sky-600",
    color: "#0284C7",
  },
  // ── Tennis & Racket Sports ─────────────────────────────
  {
    key: "tennis",
    keywords: ["tennis", "pickleball", "racquet", "racket", "padel", "badminton", "squash"],
    icon: MdOutlineSportsTennis,
    label: "Tennis",
    bgTint: "bg-lime-50 text-lime-600",
    color: "#65A30D",
  },
  // ── Cricket ────────────────────────────────────────────
  {
    key: "cricket",
    keywords: ["cricket"],
    icon: MdOutlineSportsCricket,
    label: "Cricket",
    bgTint: "bg-rose-50 text-rose-600",
    color: "#E11D48",
  },
  // ── Softball (check before baseball) ───────────────────
  {
    key: "softball",
    keywords: ["softball"],
    icon: FaBaseballBatBall,
    label: "Softball",
    bgTint: "bg-amber-50 text-amber-600",
    color: "#D97706",
  },
  // ── Baseball ───────────────────────────────────────────
  {
    key: "baseball",
    keywords: ["baseball", "hardball"],
    icon: MdOutlineSportsBaseball,
    label: "Baseball",
    bgTint: "bg-red-50 text-red-600",
    color: "#DC2626",
  },
  // ── Soccer (check before general football) ─────────────
  {
    key: "soccer",
    keywords: ["soccer", "futbol", "fútbol", "association football"],
    icon: MdOutlineSportsSoccer,
    label: "Soccer",
    bgTint: "bg-emerald-50 text-emerald-600",
    color: "#059669",
  },
  // ── American / Flag Football ───────────────────────────
  {
    key: "football",
    keywords: ["football", "flag football", "gridiron", "nfl"],
    icon: MdOutlineSportsFootball,
    label: "Football",
    bgTint: "bg-violet-50 text-violet-600",
    color: "#7C3AED",
  },
  // ── Golf ───────────────────────────────────────────────
  {
    key: "golf",
    keywords: ["golf"],
    icon: MdOutlineSportsGolf,
    label: "Golf",
    bgTint: "bg-teal-50 text-teal-600",
    color: "#0D9488",
  },
  // ── Hockey ─────────────────────────────────────────────
  {
    key: "hockey",
    keywords: ["hockey", "ice hockey", "field hockey"],
    icon: MdOutlineSportsHockey,
    label: "Hockey",
    bgTint: "bg-blue-50 text-blue-600",
    color: "#2563EB",
  },
  // ── Swimming & Aquatics ────────────────────────────────
  {
    key: "swimming",
    keywords: ["swimming", "swim", "aquatic", "water polo", "diving"],
    icon: FaPersonSwimming,
    label: "Swimming",
    bgTint: "bg-cyan-50 text-cyan-600",
    color: "#0891B2",
  },
  // ── Track & Field / Running ────────────────────────────
  {
    key: "running",
    keywords: ["track", "running", "cross country", "marathon", "athletics"],
    icon: FaPersonRunning,
    label: "Track & Field",
    bgTint: "bg-indigo-50 text-indigo-600",
    color: "#4F46E5",
  },
  // ── Rugby ──────────────────────────────────────────────
  {
    key: "rugby",
    keywords: ["rugby"],
    icon: MdOutlineSportsRugby,
    label: "Rugby",
    bgTint: "bg-yellow-50 text-yellow-700",
    color: "#CA8A04",
  },
  // ── Handball ───────────────────────────────────────────
  {
    key: "handball",
    keywords: ["handball"],
    icon: MdOutlineSportsHandball,
    label: "Handball",
    bgTint: "bg-fuchsia-50 text-fuchsia-600",
    color: "#C026D3",
  },
  // ── Combat / Wrestling / MMA ───────────────────────────
  {
    key: "combat",
    keywords: ["wrestling", "mma", "boxing", "martial arts", "judo", "karate", "taekwondo"],
    icon: MdOutlineSportsMma,
    label: "Combat Sports",
    bgTint: "bg-red-50 text-red-700",
    color: "#B91C1C",
  },
  // ── Gymnastics / Cheer / Dance ─────────────────────────
  {
    key: "gymnastics",
    keywords: ["gymnastics", "cheer", "cheerleading", "dance"],
    icon: MdOutlineSportsGymnastics,
    label: "Gymnastics",
    bgTint: "bg-pink-50 text-pink-600",
    color: "#DB2777",
  },
  
];

export const DEFAULT_SPORT_CONFIG = {
  key: "default",
  keywords: [],
  icon: MdOutlineSports,
  label: "Sport",
  bgTint: "bg-amber-50 text-amber-600",
  color: "#D97706",
};

/**
 * Extracts a normalized string from various possible sport input formats
 * (string, object with name/sports_name/sports_type, etc.)
 */
export const normalizeSportName = (sportInput) => {
  if (!sportInput) return "";
  if (typeof sportInput === "string") return sportInput.toLowerCase().trim();
  if (typeof sportInput === "object") {
    const raw =
      sportInput.sports_type_name ||
      sportInput.sports_name ||
      sportInput.name ||
      sportInput.sports_type ||
      sportInput.title ||
      "";
    return typeof raw === "string" ? raw.toLowerCase().trim() : "";
  }
  return "";
};

/**
 * Returns the matching sport configuration object including icon, tint, and color.
 *
 * @param {string|object} sportInput - Sport name string or sport object
 * @returns {object} Sport configuration object
 */
export const getSportConfig = (sportInput) => {
  const normalized = normalizeSportName(sportInput);
  if (!normalized) return DEFAULT_SPORT_CONFIG;

  for (const config of SPORT_CONFIGS) {
    if (config.keywords.some((kw) => normalized.includes(kw))) {
      return config;
    }
  }

  return DEFAULT_SPORT_CONFIG;
};

/**
 * Returns the React Icon component for the given sport.
 *
 * @param {string|object} sportInput - Sport name string or sport object
 * @param {import("react").ComponentType} [fallbackIcon] - Optional fallback component
 * @returns {import("react").ComponentType}
 */
export const getSportIconComponent = (sportInput, fallbackIcon = null) => {
  const config = getSportConfig(sportInput);
  if (config.key === "default" && fallbackIcon) {
    return fallbackIcon;
  }
  return config.icon;
};
