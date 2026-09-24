import { describe, it, expect } from "vitest";
import {
  getSportConfig,
  normalizeSportName,
} from "@/utils/sportIcons";

describe("SportIcon and sport mapping utility", () => {
  it("normalizes sport input correctly from strings and objects", () => {
    expect(normalizeSportName("  Basketball ")).toBe("basketball");
    expect(normalizeSportName({ sports_name: "Tennis" })).toBe("tennis");
    expect(normalizeSportName({ sports_type_name: "Volleyball" })).toBe("volleyball");
    expect(normalizeSportName(null)).toBe("");
  });

  it("matches basketball variations correctly", () => {
    const list = [
      "HS Basketball",
      "Small College Men's Basketball",
      "Men's/Women's College Basketball",
      "Men's College & High School Basketball Officials",
      "Women's College Basketball",
      "Basketball",
    ];
    for (const name of list) {
      const config = getSportConfig(name);
      expect(config.key).toBe("basketball");
      expect(config.label).toBe("Basketball");
    }
  });

  it("matches other specific sports accurately", () => {
    expect(getSportConfig("Volleyball").key).toBe("volleyball");
    expect(getSportConfig("Tennis").key).toBe("tennis");
    expect(getSportConfig("Pickleball").key).toBe("tennis");
    expect(getSportConfig("Cricket").key).toBe("cricket");
    expect(getSportConfig("Football").key).toBe("football");
    expect(getSportConfig("Soccer").key).toBe("soccer");
    expect(getSportConfig("Baseball").key).toBe("baseball");
    expect(getSportConfig("Softball").key).toBe("softball");
    expect(getSportConfig("Golf").key).toBe("golf");
    expect(getSportConfig("Ice Hockey").key).toBe("hockey");
    expect(getSportConfig("Swimming").key).toBe("swimming");
    expect(getSportConfig("Rugby").key).toBe("rugby");
    expect(getSportConfig("Track and Field").key).toBe("running");
  });

  it("falls back gracefully for unknown sports", () => {
    const config = getSportConfig("Underwater Quidditch");
    expect(config.key).toBe("default");
    expect(config.icon).toBeDefined();
  });
});
