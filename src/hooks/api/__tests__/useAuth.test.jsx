import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  useSignIn,
  useSignUp,
  useVerifyEmail,
  useResendOtp,
  useForgotPassword,
  useVerifyResetOtp,
  useResetPassword,
  useUpdateAvatar,
  useUpdateProfile,
} from "../useAuth";

const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockVerifyEmail = vi.fn();
const mockResendOtp = vi.fn();
const mockForgotPassword = vi.fn();
const mockVerifyResetOtp = vi.fn();
const mockResetPassword = vi.fn();
const mockUpdateAvatar = vi.fn();
const mockUpdateProfile = vi.fn();

vi.mock("@/services/auth.service", () => ({
  useAuthService: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
    verifyEmail: mockVerifyEmail,
    resendOtp: mockResendOtp,
    forgotPassword: mockForgotPassword,
    verifyResetOtp: mockVerifyResetOtp,
    resetPassword: mockResetPassword,
    updateAvatar: mockUpdateAvatar,
    updateProfile: mockUpdateProfile,
  }),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = "AuthQueryWrapper";
  return Wrapper;
};

describe("API Auth Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls signIn mutationFn with credentials", async () => {
    mockSignIn.mockResolvedValueOnce({ data: { token: "abc" } });
    const { result } = renderHook(() => useSignIn(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync({ email: "test@whistle.org", password: "pw" });
    });

    expect(mockSignIn.mock.calls[0][0]).toEqual({ email: "test@whistle.org", password: "pw" });
  });

  it("calls signUp mutationFn with user payload", async () => {
    mockSignUp.mockResolvedValueOnce({ data: { message: "Created" } });
    const { result } = renderHook(() => useSignUp(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.mutateAsync({ name: "Referee Mike" });
    });

    expect(mockSignUp.mock.calls[0][0]).toEqual({ name: "Referee Mike" });
  });

  it("calls verifyEmail and resendOtp mutations", async () => {
    mockVerifyEmail.mockResolvedValueOnce({ data: { verified: true } });
    mockResendOtp.mockResolvedValueOnce({ data: { sent: true } });

    const { result: verifyHook } = renderHook(() => useVerifyEmail(), { wrapper: createWrapper() });
    const { result: resendHook } = renderHook(() => useResendOtp(), { wrapper: createWrapper() });

    await act(async () => {
      await verifyHook.current.mutateAsync({ otp: "1234" });
      await resendHook.current.mutateAsync({ email: "test@whistle.org" });
    });

    expect(mockVerifyEmail.mock.calls[0][0]).toEqual({ otp: "1234" });
    expect(mockResendOtp.mock.calls[0][0]).toEqual({ email: "test@whistle.org" });
  });

  it("calls password reset mutations", async () => {
    mockForgotPassword.mockResolvedValueOnce({ data: { status: true } });
    mockVerifyResetOtp.mockResolvedValueOnce({ data: { valid: true } });
    mockResetPassword.mockResolvedValueOnce({ data: { updated: true } });

    const { result: forgotHook } = renderHook(() => useForgotPassword(), { wrapper: createWrapper() });
    const { result: otpHook } = renderHook(() => useVerifyResetOtp(), { wrapper: createWrapper() });
    const { result: resetHook } = renderHook(() => useResetPassword(), { wrapper: createWrapper() });

    await act(async () => {
      await forgotHook.current.mutateAsync({ email: "test@test.com" });
      await otpHook.current.mutateAsync({ code: "9999" });
      await resetHook.current.mutateAsync({ password: "new" });
    });

    expect(mockForgotPassword.mock.calls[0][0]).toEqual({ email: "test@test.com" });
    expect(mockVerifyResetOtp.mock.calls[0][0]).toEqual({ code: "9999" });
    expect(mockResetPassword.mock.calls[0][0]).toEqual({ password: "new" });
  });

  it("calls avatar and profile update mutations", async () => {
    mockUpdateAvatar.mockResolvedValueOnce({ data: { avatar: "url" } });
    mockUpdateProfile.mockResolvedValueOnce({ data: { success: true } });

    const { result: avatarHook } = renderHook(() => useUpdateAvatar(), { wrapper: createWrapper() });
    const { result: profileHook } = renderHook(() => useUpdateProfile(), { wrapper: createWrapper() });

    await act(async () => {
      await avatarHook.current.mutateAsync(new FormData());
      await profileHook.current.mutateAsync({ is_phone_show: true });
    });

    expect(mockUpdateAvatar).toHaveBeenCalled();
    expect(mockUpdateProfile.mock.calls[0][0]).toEqual({ is_phone_show: true });
  });
});
