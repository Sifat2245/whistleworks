export const getRefereePositions = (campId, sportName, maxReferees) => {
  try {
    const stored = localStorage.getItem(`referee_positions_${campId}`);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const result = [...parsed];
        while (result.length < maxReferees) {
          result.push(`Referee Position ${result.length + 1}`);
        }
        return result.slice(0, maxReferees);
      }
    }
  } catch (e) {
    console.error("Failed to parse referee positions from local storage", e);
  }

  // Fallback defaults
  const defaults = [];
  const lowerSport = String(sportName || "").toLowerCase();
  if (lowerSport.includes("basketball")) {
    defaults.push("Crew Chief", "Referee", "Umpire");
  } else if (lowerSport.includes("soccer") || lowerSport.includes("football") || lowerSport.includes("scocer")) {
    defaults.push("Center Referee", "Assistant Referee 1", "Assistant Referee 2", "Fourth Official");
  } else if (lowerSport.includes("volleyball") || lowerSport.includes("volyball")) {
    defaults.push("First Referee (R1)", "Second Referee (R2)", "Line Judge 1", "Line Judge 2");
  }

  const result = [];
  for (let i = 0; i < maxReferees; i++) {
    if (defaults[i]) {
      result.push(defaults[i]);
    } else {
      result.push(`Referee Position ${i + 1}`);
    }
  }
  return result;
};
