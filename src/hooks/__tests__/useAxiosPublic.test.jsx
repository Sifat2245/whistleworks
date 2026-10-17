import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useAxiosPublic from "../useAxiosPublic";
import toast from "react-hot-toast";

vi.mock("react-hot-toast", () => ({
  default: {
    error: vi.fn(),
  },
}));

describe("useAxiosPublic hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates an axios instance with base URL and timeout", () => {
    const { result } = renderHook(() => useAxiosPublic());
    const instance = result.current;

    expect(instance.defaults.timeout).toBe(30000);
    expect(instance.defaults.baseURL).toContain("/api");
  });

  it("handles response interceptor on success", () => {
    const { result } = renderHook(() => useAxiosPublic());
    const instance = result.current;
    const responseInterceptor = instance.interceptors.response.handlers[0];

    const mockResponse = { data: { success: true } };
    expect(responseInterceptor.fulfilled(mockResponse)).toBe(mockResponse);
  });

  it("triggers toast error on 500 server error in interceptor", async () => {
    const { result } = renderHook(() => useAxiosPublic());
    const instance = result.current;
    const responseInterceptor = instance.interceptors.response.handlers[0];

    const serverError = {
      response: {
        status: 500,
        data: { message: "Internal crash" },
      },
    };

    await expect(responseInterceptor.rejected(serverError)).rejects.toEqual(serverError);
    expect(toast.error).toHaveBeenCalledWith("Internal crash");
  });

  it("triggers toast on network connection issue", async () => {
    const { result } = renderHook(() => useAxiosPublic());
    const instance = result.current;
    const responseInterceptor = instance.interceptors.response.handlers[0];

    const networkError = {
      request: {},
    };

    await expect(responseInterceptor.rejected(networkError)).rejects.toEqual(networkError);
    expect(toast.error).toHaveBeenCalledWith(
      "Network connection issue. Please check your internet."
    );
  });
});
