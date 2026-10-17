import { describe, it, expect } from "vitest";
import {
  getCourtPositions,
  getPositionReferee,
  getRefereePositions,
  formatRefereePosition,
} from "../refereePositions";

describe("refereePositions utilities", () => {
  describe("getCourtPositions", () => {
    it("should return court.positions if already provided and non-empty", () => {
      const existingPositions = [{ id: 1, position: "Lead Referee" }];
      const result = getCourtPositions({ positions: existingPositions });
      expect(result).toBe(existingPositions);
    });

    it("should generate default positions array based on maxReferees", () => {
      const result = getCourtPositions(null, 3);
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({
        id: 1,
        position: "Referee Position 1",
        is_assigned: false,
        referee: null,
        game_slot_assignment_id: null,
      });
      expect(result[2].position).toBe("Referee Position 3");
    });

    it("should default to 2 positions if maxReferees is not provided", () => {
      const result = getCourtPositions({});
      expect(result).toHaveLength(2);
      expect(result[0].position).toBe("Referee Position 1");
      expect(result[1].position).toBe("Referee Position 2");
    });
  });

  describe("getPositionReferee", () => {
    it("should return null if pos is falsy", () => {
      expect(getPositionReferee(null)).toBeNull();
      expect(getPositionReferee(undefined)).toBeNull();
    });

    it("should return pos.referee directly if present", () => {
      const ref = { id: 10, name: "John Ref" };
      expect(getPositionReferee({ referee: ref })).toBe(ref);
    });

    it("should lookup referee from courtAssignments if pos is assigned by ID", () => {
      const assignments = [
        { assignment_id: 101, referee: { name: "Matched By assignment_id" } },
        { id: 102, referee: { name: "Matched By id" } },
      ];

      const pos1 = { is_assigned: true, game_slot_assignment_id: 101 };
      expect(getPositionReferee(pos1, assignments)).toEqual(assignments[0]);

      const pos2 = { is_assigned: true, game_slot_assignment_id: 102 };
      expect(getPositionReferee(pos2, assignments)).toEqual(assignments[1]);
    });

    it("should return null if no match found in courtAssignments", () => {
      const pos = { is_assigned: true, game_slot_assignment_id: 999 };
      expect(getPositionReferee(pos, [])).toBeNull();
    });
  });

  describe("getRefereePositions", () => {
    it("should return positions from court object if object passed", () => {
      const court = { positions: [{ position: "Lead" }, { position: "Trail" }] };
      expect(getRefereePositions(court)).toEqual(["Lead", "Trail"]);
    });

    it("should return sport default positions for basketball", () => {
      const result = getRefereePositions("camp-1", "Basketball", 3);
      expect(result).toEqual(["Crew Chief", "Referee", "Umpire"]);
    });

    it("should return sport default positions for soccer", () => {
      const result = getRefereePositions(1, "Soccer", 4);
      expect(result).toEqual([
        "Center Referee",
        "Assistant Referee 1",
        "Assistant Referee 2",
        "Fourth Official",
      ]);
    });

    it("should return sport default positions for volleyball", () => {
      const result = getRefereePositions(null, "Volleyball", 2);
      expect(result).toEqual(["First Referee (R1)", "Second Referee (R2)"]);
    });

    it("should fallback to generic referee position names when exceeding defaults or unknown sport", () => {
      const result = getRefereePositions(null, "UnknownSport", 3);
      expect(result).toEqual([
        "Referee Position 1",
        "Referee Position 2",
        "Referee Position 3",
      ]);
    });
  });

  describe("formatRefereePosition", () => {
    it("should return empty string for non-string or falsy input", () => {
      expect(formatRefereePosition("")).toBe("");
      expect(formatRefereePosition(null)).toBe("");
      expect(formatRefereePosition(123)).toBe("");
    });

    it("should normalize assistant referee variations", () => {
      expect(formatRefereePosition("assistent")).toBe("Assistant Referee");
      expect(formatRefereePosition("assistant")).toBe("Assistant Referee");
      expect(formatRefereePosition("assistant_referee")).toBe("Assistant Referee");
      expect(formatRefereePosition("ASSISTANT REFEREE")).toBe("Assistant Referee");
    });

    it("should normalize main referee variations", () => {
      expect(formatRefereePosition("main refeeree")).toBe("Main Referee");
      expect(formatRefereePosition("main referee")).toBe("Main Referee");
      expect(formatRefereePosition("main_referee")).toBe("Main Referee");
      expect(formatRefereePosition("mainrefeeree")).toBe("Main Referee");
    });

    it("should format snake_case and generic strings to Title Case", () => {
      expect(formatRefereePosition("crew_chief")).toBe("Crew Chief");
      expect(formatRefereePosition("line judge")).toBe("Line Judge");
    });
  });
});
