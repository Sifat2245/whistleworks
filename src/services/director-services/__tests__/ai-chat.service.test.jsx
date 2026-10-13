import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAiChatService } from "@/services/director-services/ai-chat.service";
const axios = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  patch: vi.fn(),
}));
vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => axios }));
beforeEach(() => vi.clearAllMocks());
describe("AI chat API contract", () => {
  it("posts only message for a new conversation and adds session_uuid for a follow-up", () => {
    const { result } = renderHook(() => useAiChatService());
    result.current.sendAiChat({ message: "First message" });
    expect(axios.post.mock.calls[0][0]).toBe("/v1/director/ai/chat");
    expect([...axios.post.mock.calls[0][1].entries()]).toEqual([
      ["message", "First message"],
    ]);
    result.current.sendAiChat({
      message: "Follow-up",
      session_uuid: "saved-session",
    });
    expect([...axios.post.mock.calls[1][1].entries()]).toEqual([
      ["message", "Follow-up"],
      ["session_uuid", "saved-session"],
    ]);
  });
  it("uses the supplied session list, history, and PATCH rename routes", () => {
    const { result } = renderHook(() => useAiChatService());
    const controller = new AbortController();
    result.current.getAiSessions({ page: 2 }, controller.signal);
    expect(axios.get).toHaveBeenCalledWith("/v1/director/ai/sessions", {
      params: { page: 2 },
      signal: controller.signal,
    });
    result.current.getSessionHistory("saved-session", controller.signal);
    expect(axios.get).toHaveBeenCalledWith(
      "/v1/director/ai/session/saved-session/history",
      { signal: controller.signal },
    );
    result.current.renameAiSession({
      sessionUuid: "saved-session",
      title: "New title",
    });
    expect(axios.patch).toHaveBeenCalledWith(
      "/v1/director/ai/session/rename/saved-session",
      { title: "New title" },
    );
  });
});
