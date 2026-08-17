

export const DEFAULT_LEVELS = [
  "NCAA D1",
  "NCAA D2",
  "NAIA",
  "JUCO",
  "HS",
  "JH/ELEM",
];

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

export const resolveLevels = (recommendedLevels = []) =>
  recommendedLevels.length ? recommendedLevels : DEFAULT_LEVELS;
