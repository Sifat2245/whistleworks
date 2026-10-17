import { describe, it, expect } from "vitest";
import { ASSISTANT_PERMISSIONS, CARD_ACTION_PERMISSIONS } from "../assistantPermissions";

describe("assistantPermissions", () => {
  describe("ASSISTANT_PERMISSIONS", () => {
    it("should be an array of permissions", () => {
      expect(Array.isArray(ASSISTANT_PERMISSIONS)).toBe(true);
      expect(ASSISTANT_PERMISSIONS.length).toBeGreaterThan(0);
    });

    it("should contain properly structured permission items", () => {
      ASSISTANT_PERMISSIONS.forEach((perm) => {
        expect(perm).toHaveProperty("key");
        expect(typeof perm.key).toBe("string");
        expect(perm).toHaveProperty("label");
        expect(typeof perm.label).toBe("string");
        expect(perm).toHaveProperty("description");
        expect(typeof perm.description).toBe("string");
        expect(perm).toHaveProperty("icon");
      });
    });

    it("should have unique permission keys", () => {
      const keys = ASSISTANT_PERMISSIONS.map((p) => p.key);
      const uniqueKeys = new Set(keys);
      expect(uniqueKeys.size).toBe(keys.length);
    });

    it("should include core permission keys", () => {
      const keys = ASSISTANT_PERMISSIONS.map((p) => p.key);
      expect(keys).toContain("manage_schedule");
      expect(keys).toContain("assign_referee");
      expect(keys).toContain("publish_camp");
      expect(keys).toContain("manage_ranking");
      expect(keys).toContain("manage_roster_referees");
      expect(keys).toContain("manage_roster_evaluators");
      expect(keys).toContain("manage_roster_crews");
      expect(keys).toContain("manage_announcement");
    });
  });

  describe("CARD_ACTION_PERMISSIONS", () => {
    it("should be an object mapping action cards to required permissions", () => {
      expect(CARD_ACTION_PERMISSIONS).toBeDefined();
      expect(typeof CARD_ACTION_PERMISSIONS).toBe("object");
    });

    it("should contain mapped permissions for all known card actions", () => {
      expect(CARD_ACTION_PERMISSIONS.schedule).toEqual(["build_schedule"]);
      expect(CARD_ACTION_PERMISSIONS.court).toEqual(["assign_referee"]);
      expect(CARD_ACTION_PERMISSIONS.evaluate).toEqual(["manage_roster_evaluators"]);
      expect(CARD_ACTION_PERMISSIONS.ranking).toEqual(["manage_ranking"]);
      expect(CARD_ACTION_PERMISSIONS.roster).toEqual([
        "manage_roster_referees",
        "manage_roster_crews",
      ]);
      expect(CARD_ACTION_PERMISSIONS.announcement).toEqual(["manage_announcement"]);
    });
  });
});
