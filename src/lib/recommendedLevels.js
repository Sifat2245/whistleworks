// Recommended-officiating levels shared by the ranking tables.
// The column set is driven by the camp's sports type (e.g. "HS Basketball"
// → Large School Varsity ... JH/ELEM) via the recommended-levels API, with
// this legacy list used as a fallback while loading or for other sports.

export const DEFAULT_LEVELS = [
  "NCAA D1",
  "NCAA D2",
  "NAIA",
  "JUCO",
  "HS",
  "JH/ELEM",
];

// Short header labels — the full level name is shown as a tooltip.
export const LEVEL_LABELS = {
  "NCAA D1": "DI",
  "NCAA D2": "D2",
  NAIA: "NAIA",
  JUCO: "JC",
  HS: "HS",
  "JH/ELEM": "JH",
  "Large School Varsity": "LS Var",
  "Mid Size School Varsity": "MS Var",
  "Small School Varsity": "SS Var",
  "Junior Varsity": "JV",
};

// Pick the level list to render: prefer the sports-type-specific list from
// the API, otherwise fall back to the legacy levels.
export const resolveLevels = (recommendedLevels = []) =>
  recommendedLevels.length ? recommendedLevels : DEFAULT_LEVELS;
