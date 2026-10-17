import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import useAxiosSecure from "../useAxiosSecure";

const mockLogout = vi.fn();
const mockToastError = vi.fn();

vi.mock("../useAuth", () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

vi.mock("react-hot-toast", () => ({
  default: {
    error: (...args) => mockToastError(...args),
  },
  toast: {
    error: (...args) => mockToastError(...args),
  },
}));

describe("useAxiosSecure hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("injects Bearer token from localStorage into headers", () => {
    const tokenKey = import.meta.env.VITE_ACCESS_TOKEN;
    localStorage.setItem(tokenKey, "secure-jwt-token");

    const { result } = renderHook(() => useAxiosSecure());
    const instance = result.current;

    expect(instance.defaults.headers.Authorization).toBe("Bearer secure-jwt-token");
  });

  it("handles 401 unauthorized by displaying toast and calling logout", async () => {
    const { result } = renderHook(() => useAxiosSecure());
    const instance = result.current;
    const responseInterceptor = instance.interceptors.response.handlers[0];

    const error401 = {
      response: {
        status: 401,
        data: {},
      },
    };

    await expect(responseInterceptor.rejected(error401)).rejects.toEqual(error401);
    expect(mockToastError).toHaveBeenCalledWith("Session expired. Please log in again.");
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it("handles 500 internal server error with toast", async () => {
    const { result } = renderHook(() => useAxiosSecure());
    const instance = result.current;
    const responseInterceptor = instance.interceptors.response.handlers[0];

    const error500 = {
      response: {
        status: 500,
        data: {},
      },
    };

    await expect(responseInterceptor.rejected(error500)).rejects.toEqual(error500);
    expect(mockToastError).toHaveBeenCalledWith("Internal server error, try again.");
  });
});
