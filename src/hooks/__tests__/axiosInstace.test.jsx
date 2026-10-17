import { describe, it, expect, vi, beforeEach } from "vitest";
import axiosSecureInstance from "../axiosInstace";

const mockToastError = vi.fn();
vi.mock("react-hot-toast", () => ({
  toast: {
    error: (...args) => mockToastError(...args),
  },
  default: {
    error: (...args) => mockToastError(...args),
  },
}));

describe("axiosSecureInstance", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("configures base URL and 30s timeout", () => {
    expect(axiosSecureInstance.defaults.timeout).toBe(30000);
    expect(axiosSecureInstance.defaults.baseURL).toContain("/api");
  });

  it("adds Authorization header in request interceptor if token exists", () => {
    const tokenKey = import.meta.env.VITE_ACCESS_TOKEN;
    localStorage.setItem(tokenKey, "instance-token-123");

    const requestHandler = axiosSecureInstance.interceptors.request.handlers[0];
    const config = { headers: {} };
    const modified = requestHandler.fulfilled(config);

    expect(modified.headers.Authorization).toBe("Bearer instance-token-123");
  });

  it("handles 401 error in response interceptor", async () => {
    const responseHandler = axiosSecureInstance.interceptors.response.handlers[0];
    const error401 = { response: { status: 401 } };

    await expect(responseHandler.rejected(error401)).rejects.toEqual(error401);
    expect(mockToastError).toHaveBeenCalledWith("Session expired. Please log in again.");
  });
});
