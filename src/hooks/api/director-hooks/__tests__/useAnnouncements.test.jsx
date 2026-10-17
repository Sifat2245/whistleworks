import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSendAnnouncement } from "../useAnnouncements";

const mockSendAnnouncement = vi.fn();

vi.mock("@/services/director-services/announcement.service", () => ({
  useAnnouncementService: () => ({
    sendAnnouncement: mockSendAnnouncement,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "AnnouncementWrapper";
  return Wrapper;
};

describe("useAnnouncements hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sends announcement with callbacks", async () => {
    const onSuccess = vi.fn();
    const mockResponse = { data: { message: "Announcement sent" } };
    mockSendAnnouncement.mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(
      () => useSendAnnouncement({ onSuccess }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      await result.current.mutateAsync({
        camp_id: 1,
        title: "Meeting",
        message: "Be on time",
      });
    });

    expect(mockSendAnnouncement).toHaveBeenCalledWith({
      camp_id: 1,
      title: "Meeting",
      message: "Be on time",
    });
    expect(onSuccess).toHaveBeenCalledWith(mockResponse, expect.anything(), undefined);
  });
});
