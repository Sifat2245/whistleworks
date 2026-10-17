import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useHomeCms, useAboutCms } from "../useCms";

const mockGetHomeCms = vi.fn();
const mockGetAboutCms = vi.fn();

vi.mock("@/services/cms.service", () => ({
  useCMSService: () => ({
    getHomeCms: mockGetHomeCms,
    getAboutCms: mockGetAboutCms,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "CmsQueryWrapper";
  return Wrapper;
};

describe("CMS API Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches home CMS content successfully", async () => {
    mockGetHomeCms.mockResolvedValueOnce({
      data: { message: { hero_title: "Welcome to WhistleWorks" } },
    });

    const { result } = renderHook(() => useHomeCms(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ hero_title: "Welcome to WhistleWorks" });
  });

  it("fetches about CMS content successfully", async () => {
    mockGetAboutCms.mockResolvedValueOnce({
      data: { data: { mission: "Empower Officials" } },
    });

    const { result } = renderHook(() => useAboutCms(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual({ mission: "Empower Officials" });
  });
});
