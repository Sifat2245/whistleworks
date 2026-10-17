import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useCMSService } from "../cms.service";

const mockAxiosPublic = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosPublic", () => ({ default: () => mockAxiosPublic }));

describe("cms.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches home and about CMS data", () => {
    const { result } = renderHook(() => useCMSService());

    result.current.getHomeCms();
    expect(mockAxiosPublic.get).toHaveBeenCalledWith("/cms/home");

    result.current.getAboutCms();
    expect(mockAxiosPublic.get).toHaveBeenCalledWith("/cms/about");
  });
});
