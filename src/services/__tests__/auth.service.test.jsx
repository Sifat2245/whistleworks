import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useAuthService } from "../auth.service";

const mockAxiosPublic = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
}));

const mockAxiosSecure = vi.hoisted(() => ({
  post: vi.fn(),
  get: vi.fn(),
}));

vi.mock("@/hooks/useAxiosPublic", () => ({ default: () => mockAxiosPublic }));
vi.mock("@/hooks/useAxiosSecure", () => ({ default: () => mockAxiosSecure }));

describe("auth.service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("handles signIn and verifyEmail calls", () => {
    const { result } = renderHook(() => useAuthService());
    const credentials = { email: "test@example.com", password: "password123" };
    result.current.signIn(credentials);
    expect(mockAxiosPublic.post).toHaveBeenCalledWith("/login", credentials);

    const emailPayload = { email: "test@example.com", otp: "1234" };
    result.current.verifyEmail(emailPayload);
    expect(mockAxiosPublic.post).toHaveBeenCalledWith("/verify-email", emailPayload);
  });

  it("handles multipart auth endpoints (signUp, forgotPassword, verifyResetOtp, resetPassword)", () => {
    const { result } = renderHook(() => useAuthService());

    result.current.signUp({ email: "user@example.com" });
    expect(mockAxiosPublic.post).toHaveBeenCalledWith(
      "/register",
      { email: "user@example.com" },
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    result.current.resendOtp({ email: "user@example.com" });
    expect(mockAxiosPublic.post).toHaveBeenCalledWith("/resend-otp", {
      email: "user@example.com",
    });

    result.current.forgotPassword({ email: "user@example.com" });
    expect(mockAxiosPublic.post).toHaveBeenCalledWith(
      "/forgot-password",
      { email: "user@example.com" },
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    result.current.verifyResetOtp({ token: "123456" });
    expect(mockAxiosPublic.post).toHaveBeenCalledWith(
      "/otp-token",
      { token: "123456" },
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    result.current.resetPassword({ password: "newpassword" });
    expect(mockAxiosPublic.post).toHaveBeenCalledWith(
      "/reset-password",
      { password: "newpassword" },
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  });

  it("handles authenticated profile and avatar updates via axiosSecure", () => {
    const { result } = renderHook(() => useAuthService());

    const fakeFile = new File(["dummy"], "avatar.png", { type: "image/png" });
    result.current.updateAvatar(fakeFile);
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/update-avatar",
      expect.any(FormData),
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    result.current.updateProfile({ name: "Updated Name" });
    expect(mockAxiosSecure.post).toHaveBeenCalledWith(
      "/update-profile",
      { name: "Updated Name" },
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  });
});
