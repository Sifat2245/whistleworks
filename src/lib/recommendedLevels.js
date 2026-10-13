

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

export const resolveLevels = (recommendedLevels = []) => {
  if (!recommendedLevels?.length) return DEFAULT_LEVELS;
  return recommendedLevels.map((lvl) => {
    if (typeof lvl === "object" && lvl !== null) {
      return lvl.level || lvl.name || String(lvl.id);
    }
    return String(lvl);
  });
};

export const computeLevelCounts = (item, levels = [], recommendedLevels = []) => {
  const levelCounts = {};
  levels.forEach((lvl) => {
    levelCounts[lvl] = 0;
  });

  const findCanonicalLevel = (rawLevel) => {
    if (!rawLevel) return null;
    const str = String(rawLevel).trim().toLowerCase();

    // 1. Direct match in levels array
    const exact = levels.find((l) => l.trim().toLowerCase() === str);
    if (exact) return exact;

    // 2. Match via recommendedLevels objects (by id, sports_type_level_id, or name/level)
    const byRec = recommendedLevels.find((r) => {
      if (typeof r !== "object" || !r) return false;
      return (
        String(r.id) === str ||
        String(r.sports_type_level_id) === str ||
        r.name?.trim().toLowerCase() === str ||
        r.level?.trim().toLowerCase() === str
      );
    });
    if (byRec) {
      const recName = byRec.level || byRec.name;
      const matched = levels.find(
        (l) => l.trim().toLowerCase() === recName?.trim().toLowerCase(),
      );
      if (matched) return matched;
    }

    return null;
  };

  const rawList = Array.isArray(item?.recommended_levels)
    ? item.recommended_levels
    : item?.recommended_levels && typeof item.recommended_levels === "object"
      ? Object.values(item.recommended_levels)
      : [];

  rawList.forEach((lvl) => {
    if (!lvl) return;
    const count = Number(lvl.count ?? lvl.total ?? 1) || 1;
    const key =
      lvl.level ||
      lvl.name ||
      lvl.sports_type_level_id ||
      lvl.id ||
      (typeof lvl === "string" ? lvl : null);

    const canonical = findCanonicalLevel(key);
    if (canonical) {
      levelCounts[canonical] = (levelCounts[canonical] || 0) + count;
    }
  });

  const hasAnyCounts = Object.values(levelCounts).some((c) => c > 0);
  if (!hasAnyCounts && item?.highest_recommended_level) {
    const canonical = findCanonicalLevel(item.highest_recommended_level);
    if (canonical) {
      levelCounts[canonical] = Number(item.total_evaluations) || 1;
    }
  }

  return levelCounts;
};

