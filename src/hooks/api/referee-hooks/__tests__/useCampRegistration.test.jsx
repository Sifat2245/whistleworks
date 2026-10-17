import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCampPrice, useApplyCoupon } from "../useCampRegistration";

const mockCampPrice = vi.fn();
const mockApplyCoupon = vi.fn();

vi.mock("@/services/referee-services/RefereeCampRegistration.service", () => ({
  useCampRegistrationService: () => ({
    campPrice: mockCampPrice,
    applyCoupon: mockApplyCoupon,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "CampRegWrapper";
  return Wrapper;
};

describe("useCampRegistration hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches camp price when campId is provided", async () => {
    mockCampPrice.mockResolvedValueOnce({
      data: { data: { price: "120.00", sports_fee: "10.00" } },
    });

    const { result } = renderHook(() => useCampPrice(15), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockCampPrice).toHaveBeenCalledWith(15);
    expect(result.current.data).toEqual({ price: "120.00", sports_fee: "10.00" });
  });

  it("calls applyCoupon mutation with campId and couponCode", async () => {
    mockApplyCoupon.mockResolvedValueOnce({
      data: { discount: "20.00" },
    });

    const { result } = renderHook(() => useApplyCoupon(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync({ campId: 15, couponCode: "SUMMER20" });
    });

    expect(mockApplyCoupon).toHaveBeenCalledWith(15, { coupon_code: "SUMMER20" });
  });
});
