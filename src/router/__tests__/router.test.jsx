import { describe, it, expect } from "vitest";
import router from "../router";

describe("Application Router Configuration", () => {
  it("should export a valid router instance", () => {
    expect(router).toBeDefined();
    expect(router.routes).toBeDefined();
    expect(Array.isArray(router.routes)).toBe(true);
  });

  it("should contain the public root route with required children", () => {
    const rootRoute = router.routes.find((r) => r.path === "/");
    expect(rootRoute).toBeDefined();
    expect(rootRoute.children).toBeDefined();

    const childPaths = rootRoute.children.map((c) => c.path || (c.index ? "index" : ""));
    expect(childPaths).toContain("index");
    expect(childPaths).toContain("about-us");
    expect(childPaths).toContain("contact-us");
    expect(childPaths).toContain("contact");
    expect(childPaths).toContain("privacy-policy");
    expect(childPaths).toContain("terms-conditions");
    expect(childPaths).toContain("faq");
    expect(childPaths).toContain("whats-new");
    expect(childPaths).toContain("all-camps");
    expect(childPaths).toContain("all-camps/:id");
  });

  it("should configure director dashboard routes", () => {
    const directorRoute = router.routes.find((r) => r.path === "/director-dashboard");
    expect(directorRoute).toBeDefined();
    expect(directorRoute.children).toBeDefined();

    const childPaths = directorRoute.children.map((c) => c.path);
    expect(childPaths).toContain("create-new-camp");
    expect(childPaths).toContain("build-schedule/:id");
    expect(childPaths).toContain("court-list/:id");
    expect(childPaths).toContain("camp-schedules/:id");
    expect(childPaths).toContain("ranking/:id");
    expect(childPaths).toContain("roster/:id");
    expect(childPaths).toContain("profile");
    expect(childPaths).toContain("ai-assistant");
  });

  it("should configure evaluator dashboard routes", () => {
    const evaluatorRoute = router.routes.find((r) => r.path === "/evaluator-dashboard");
    expect(evaluatorRoute).toBeDefined();
    expect(evaluatorRoute.children).toBeDefined();

    const childPaths = evaluatorRoute.children.map((c) => c.path);
    expect(childPaths).toContain("active-camps");
    expect(childPaths).toContain("camp/:id");
    expect(childPaths).toContain("previous-camps");
    expect(childPaths).toContain("find-camps");
    expect(childPaths).toContain("profile");
  });

  it("should configure referee dashboard routes", () => {
    const refereeRoute = router.routes.find((r) => r.path === "/referee-dashboard");
    expect(refereeRoute).toBeDefined();
    expect(refereeRoute.children).toBeDefined();

    const childPaths = refereeRoute.children.map((c) => c.path);
    expect(childPaths).toContain("active-camps");
    expect(childPaths).toContain("camp/:id");
    expect(childPaths).toContain("previous-camps");
    expect(childPaths).toContain("find-camps");
    expect(childPaths).toContain("payment-success");
    expect(childPaths).toContain("payment-cancel");
    expect(childPaths).toContain("profile");
  });

  it("should configure auth routes", () => {
    const authRoute = router.routes.find((r) => r.path === "/auth");
    expect(authRoute).toBeDefined();
    expect(authRoute.children).toBeDefined();

    const childPaths = authRoute.children.map((c) => c.path);
    expect(childPaths).toContain("signin");
    expect(childPaths).toContain("signup");
    expect(childPaths).toContain("verify-otp");
    expect(childPaths).toContain("forget-password");
    expect(childPaths).toContain("reset-password-otp");
    expect(childPaths).toContain("reset-password");
  });

  it("should configure catch-all wildcard not-found route", () => {
    const wildcardRoute = router.routes.find((r) => r.path === "*");
    expect(wildcardRoute).toBeDefined();
  });
});
