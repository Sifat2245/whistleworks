import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useStripeConnectionStatus,
  useConnectStripe,
} from "../useStripConnection";

const mockConnectionStatus = vi.fn();
const mockConnectStripe = vi.fn();

vi.mock("@/services/director-services/stripeConnection.service", () => ({
  useStripeService: () => ({
    connectionStatus: mockConnectionStatus,
    connectStripe: mockConnectStripe,
  }),
}));

vi.mock("sweetalert2", () => ({
  default: {
    fire: vi.fn(),
  },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "StripeWrapper";
  return Wrapper;
};

describe("useStripConnection hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    globalThis.open = vi.fn();
  });

  it("fetches stripe connection status", async () => {
    mockConnectionStatus.mockResolvedValueOnce({
      data: { connected: true, account_id: "acct_123" },
    });

    const { result } = renderHook(() => useStripeConnectionStatus(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockConnectionStatus).toHaveBeenCalled();
    expect(result.current.data).toEqual({ connected: true, account_id: "acct_123" });
  });

  it("calls connectStripe mutation and opens onboarding link", async () => {
    mockConnectStripe.mockResolvedValueOnce({
      data: { data: { onboarding_url: "https://stripe.com/onboard" } },
    });

    const { result } = renderHook(() => useConnectStripe(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(mockConnectStripe).toHaveBeenCalled();
    expect(globalThis.open).toHaveBeenCalledWith(
      "https://stripe.com/onboard",
      "_blank"
    );
  });
});
