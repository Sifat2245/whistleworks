import { useMutation } from "@tanstack/react-query";
import { useAuthService } from "@/services/auth.service";

// Sign In
export const useSignIn = (options) => {
  const { signIn } = useAuthService();
  return useMutation({
    mutationKey: ["sign-in"],
    mutationFn: signIn,
    ...options,
  });
};

// Sign Up
export const useSignUp = (options) => {
  const { signUp } = useAuthService();
  return useMutation({
    mutationKey: ["sign-up"],
    mutationFn: signUp,
    ...options,
  });
};

// Verify Email OTP
export const useVerifyEmail = (options) => {
  const { verifyEmail } = useAuthService();
  return useMutation({
    mutationKey: ["verify-email"],
    mutationFn: verifyEmail,
    ...options,
  });
};

// Resend OTP
export const useResendOtp = (options) => {
  const { resendOtp } = useAuthService();
  return useMutation({
    mutationKey: ["resend-otp"],
    mutationFn: resendOtp,
    ...options,
  });
};

// Forgot Password
export const useForgotPassword = (options) => {
  const { forgotPassword } = useAuthService();
  return useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: forgotPassword,
    ...options,
  });
};

// Verify Reset OTP
export const useVerifyResetOtp = (options) => {
  const { verifyResetOtp } = useAuthService();
  return useMutation({
    mutationKey: ["confirmSignUpOtp"],
    mutationFn: verifyResetOtp,
    ...options,
  });
};

// Reset Password
export const useResetPassword = (options) => {
  const { resetPassword } = useAuthService();
  return useMutation({
    mutationKey: ["reset-password"],
    mutationFn: resetPassword,
    ...options,
  });
};

// Update Avatar (profile image)
export const useUpdateAvatar = (options) => {
  const { updateAvatar } = useAuthService();
  return useMutation({
    mutationKey: ["update-avatar"],
    mutationFn: updateAvatar,
    ...options,
  });
};

// Update Profile (settings: is_phone_show, is_address_show, etc.)
export const useUpdateProfile = (options) => {
  const { updateProfile } = useAuthService();
  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: updateProfile,
    ...options,
  });
};
