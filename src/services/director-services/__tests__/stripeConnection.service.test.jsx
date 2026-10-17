import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useStripeService } from "../stripeConnection.service";

const mockAxiosSecure = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("stripeConnection.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls connectStripe endpoint", async () => {
    const { result } = renderHook(() => useStripeService());

    mockAxiosSecure.post.mockResolvedValueOnce({ data: { url: "https://stripe.com" } });
    const res = await result.current.connectStripe();
    expect(mockAxiosSecure.post).toHaveBeenCalledWith("/v1/director/stripe/connect");
    expect(res).toEqual({ data: { url: "https://stripe.com" } });
  });

  it("calls connectionStatus and returns unwrapped response.data", async () => {
    const { result } = renderHook(() => useStripeService());

    mockAxiosSecure.get.mockResolvedValueOnce({ data: { is_connected: true } });
    const data = await result.current.connectionStatus();
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/director/stripe/status");
    expect(data).toEqual({ is_connected: true });
  });

  it("calls stripeDashboardRedirection and returns unwrapped response.data", async () => {
    const { result } = renderHook(() => useStripeService());

    mockAxiosSecure.get.mockResolvedValueOnce({ data: { url: "https://dashboard.stripe.com" } });
    const data = await result.current.stripeDashboardRedirection();
    expect(mockAxiosSecure.get).toHaveBeenCalledWith("/v1/director/stripe/dashboard");
    expect(data).toEqual({ url: "https://dashboard.stripe.com" });
  });
});
