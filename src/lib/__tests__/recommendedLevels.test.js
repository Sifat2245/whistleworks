import { describe, it, expect } from "vitest";
import {
  DEFAULT_LEVELS,
  resolveLevels,
  computeLevelCounts,
} from "../recommendedLevels";

describe("recommendedLevels helper", () => {
  it("resolves default levels when empty array is passed", () => {
    expect(resolveLevels([])).toEqual(DEFAULT_LEVELS);
    expect(resolveLevels(null)).toEqual(DEFAULT_LEVELS);
  });

  it("resolves levels from array of objects or strings", () => {
    const rawObjects = [
      { id: 7, name: "Large School Varsity", level: "Large School Varsity" },
      { id: 9, name: "Small School Varsity", level: "Small School Varsity" },
    ];
    expect(resolveLevels(rawObjects)).toEqual([
      "Large School Varsity",
      "Small School Varsity",
    ]);

    const rawStrings = ["HS", "NCAA D1"];
    expect(resolveLevels(rawStrings)).toEqual(["HS", "NCAA D1"]);
  });

  it("computes level counts matching the backend evaluation response format", () => {
    const levels = [
      "Large School Varsity",
      "Mid Size School Varsity",
      "Small School Varsity",
      "Junior Varsity",
      "JH/ELEM",
      "TEST 1",
      "TEST 2",
    ];

    const recommendedLevels = [
      { id: 7, name: "Large School Varsity", level: "Large School Varsity" },
      { id: 8, name: "Mid Size School Varsity", level: "Mid Size School Varsity" },
      { id: 9, name: "Small School Varsity", level: "Small School Varsity" },
      { id: 10, name: "Junior Varsity", level: "Junior Varsity" },
      { id: 11, name: "JH/ELEM", level: "JH/ELEM" },
    ];

    const refereeEvaluationItem = {
      referee_id: 76,
      referee_name: "Referee1 User",
      total_evaluations: 1,
      recommended_levels: [
        {
          sports_type_level_id: 9,
          name: "Small School Varsity",
          level: "Small School Varsity",
          count: 1,
        },
      ],
      highest_recommended_level: "Small School Varsity",
    };

    const counts = computeLevelCounts(
      refereeEvaluationItem,
      levels,
      recommendedLevels
    );

    expect(counts["Small School Varsity"]).toBe(1);
    expect(counts["Large School Varsity"]).toBe(0);
    expect(counts["Mid Size School Varsity"]).toBe(0);
  });

  it("falls back to highest_recommended_level when recommended_levels list is empty", () => {
    const levels = ["Small School Varsity", "Large School Varsity"];
    const item = {
      total_evaluations: 2,
      recommended_levels: [],
      highest_recommended_level: "Small School Varsity",
    };

    const counts = computeLevelCounts(item, levels, []);
    expect(counts["Small School Varsity"]).toBe(2);
    expect(counts["Large School Varsity"]).toBe(0);
  });

  it("matches level counts using sports_type_level_id lookup in recommendedLevels", () => {
    const levels = ["Small School Varsity", "Large School Varsity"];
    const recLevels = [
      { id: 9, name: "Small School Varsity", level: "Small School Varsity" },
    ];
    const item = {
      total_evaluations: 1,
      recommended_levels: [
        {
          sports_type_level_id: 9,
          count: 1,
        },
      ],
    };

    const counts = computeLevelCounts(item, levels, recLevels);
    expect(counts["Small School Varsity"]).toBe(1);
  });
});
