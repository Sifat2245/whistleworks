/**
 * Normalizes court positions array from the API response or generates fallback position objects.
 */
export const getCourtPositions = (court, maxReferees = 2) => {
  if (Array.isArray(court?.positions) && court.positions.length > 0) {
    return court.positions;
  }

  const limit = maxReferees || 2;
  return Array.from({ length: limit }, (_, i) => ({
    id: i + 1,
    position: `Referee Position ${i + 1}`,
    is_assigned: false,
    referee: null,
    game_slot_assignment_id: null,
  }));
};

/**
 * Extracts assigned referee object for a position item.
 */
export const getPositionReferee = (pos, courtAssignments = []) => {
  if (!pos) return null;
  if (pos.referee) return pos.referee;
  if (pos.is_assigned && pos.game_slot_assignment_id && Array.isArray(courtAssignments)) {
    const match = courtAssignments.find(
      (a) =>
        a.assignment_id === pos.game_slot_assignment_id ||
        a.id === pos.game_slot_assignment_id,
    );
    if (match) return match;
  }
  return null;
};

/**
 * Legacy helper for extracting position names list.
 */
export const getRefereePositions = (courtOrCampId, sportName, maxReferees) => {
  if (typeof courtOrCampId === "object" && courtOrCampId !== null) {
    const positions = getCourtPositions(courtOrCampId, maxReferees);
    return positions.map((p) => p.position);
  }

  // Fallback defaults
  const defaults = [];
  const lowerSport = String(sportName || "").toLowerCase();
  if (lowerSport.includes("basketball")) {
    defaults.push("Crew Chief", "Referee", "Umpire");
  } else if (
    lowerSport.includes("soccer") ||
    lowerSport.includes("football") ||
    lowerSport.includes("scocer")
  ) {
    defaults.push(
      "Center Referee",
      "Assistant Referee 1",
      "Assistant Referee 2",
      "Fourth Official",
    );
  } else if (
    lowerSport.includes("volleyball") ||
    lowerSport.includes("volyball")
  ) {
    defaults.push(
      "First Referee (R1)",
      "Second Referee (R2)",
      "Line Judge 1",
      "Line Judge 2",
    );
  }

  const limit = maxReferees || 2;
  const result = [];
  for (let i = 0; i < limit; i++) {
    if (defaults[i]) {
      result.push(defaults[i]);
    } else {
      result.push(`Referee Position ${i + 1}`);
    }
  }
  return result;
};

/**
 * Formats a position string (e.g. "assistent", "main refeeree") into a clean display title.
 */
export const formatRefereePosition = (pos) => {
  if (!pos || typeof pos !== "string") return "";
  const cleaned = pos.trim().toLowerCase();

  if (
    cleaned === "assistent" ||
    cleaned === "assistant" ||
    cleaned === "assistant_referee" ||
    cleaned === "assistant referee"
  ) {
    return "Assistant Referee";
  }
  if (
    cleaned === "main refeeree" ||
    cleaned === "main referee" ||
    cleaned === "main_referee" ||
    cleaned === "mainrefeeree"
  ) {
    return "Main Referee";
  }

  return pos
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

