import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import OtpWrapper from "@/page/auth/components/OtpWrapper";
import ResendCode from "@/page/auth/components/ResendCode";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import { useAuth } from "@/hooks/useAuth";
import { maskEmail } from "@/utils/maskEmail";
import { useVerifyEmail, useResendOtp } from "@/hooks/api/useAuth";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { handleLogin, userRefetch } = useAuth();

  const email = sessionStorage.getItem("verify_email") || "";
  const [otp, setOtp] = useState("");
  const [showOtpError, setShowOtpError] = useState(false);

  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const verifyMutation = useVerifyEmail({
    onSuccess: (res) => {
      const data = res?.data;
      toast.success(data?.message || "OTP verification successful");

      const token = data?.token;
      const role = data?.data?.role;

      handleLogin(token);
      userRefetch();

      sessionStorage.removeItem("verify_email");
      sessionStorage.removeItem("testing_purpose_otp");

      const intendedCampId = sessionStorage.getItem("intended_camp_id");
      sessionStorage.removeItem("intended_camp_id");
      sessionStorage.removeItem("intended_from_signup");

      setTimeout(() => {
        redirectAfterVerification(role, intendedCampId);
      }, 900);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Verification failed");
    },
  });

  const resendMutation = useResendOtp({
    onSuccess: (res) => {
      const data = res?.data;
      toast.success(data?.message || "New OTP sent. Check your email.");
      setCountdown(30);
      setCanResend(false);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Failed to resend OTP");
    },
  });

  const redirectAfterVerification = (role, campId) => {
    const userRole = (role || "").toLowerCase();

    // Came from camp registration / details page
    if (campId) {
      if (userRole === "evaluator") {
        navigate(`/evaluator-dashboard/camp/${campId}?tab=camp-details`, {
          replace: true,
        });
        return;
      }
      if (userRole === "referee") {
        navigate(`/referee-dashboard/camp/${campId}?tab=camp-details`, {
          replace: true,
        });
        return;
      }
      if (userRole === "director") {
        navigate(`/director-dashboard/camp-overview/${campId}`, {
          replace: true,
        });
        return;
      }

      navigate(`/camp/details/${campId}`, { replace: true });
      return;
    }

    // Default dashboard by role
    if (userRole === "director") {
      navigate("/director-dashboard", { replace: true });
    } else if (userRole === "evaluator") {
      navigate("/evaluator-dashboard", { replace: true });
    } else if (userRole === "referee") {
      navigate("/referee-dashboard", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleVerify = () => {
    if (otp.length !== 4) {
      setShowOtpError(true);
      return;
    }

    setShowOtpError(false);
    verifyMutation.mutate({ email, otp });
  };

  const handleResendClick = () => {
    if (!canResend) return;
    resendMutation.mutate();
  };

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <h1 className="text-2xl font-semibold text-center mb-4">Verify OTP</h1>

      <p className="text-center text-sm text-neutral-600 mb-6">
        Enter the 4-digit code sent to your email
      </p>

      <div className="text-center space-y-1 mb-8">
        <p className="text-neutral-600">Sent to</p>
        <p className="font-medium text-[#222]">
          {maskEmail(email) || "your email"}
        </p>
      </div>

      <p className="text-center text-sm text-gray-500 mb-8 italic">
        Didn&apos;t receive the code? Check your <strong>spam</strong> or{" "}
        <strong>junk</strong> folder.
      </p>

      <OtpWrapper otp={otp} OtpChange={setOtp} />

      {showOtpError && (
        <p className="text-sm text-red-500 text-center mt-2">
          Please enter a valid 4-digit code
        </p>
      )}

      <CommonSubmitBtn
        variant="primary"
        className="w-full my-8"
        disabled={verifyMutation.isPending || !email}
        onClick={handleVerify}
      >
        {verifyMutation.isPending ? <LoaderV2 /> : "Continue"}
      </CommonSubmitBtn>

      <ResendCode
        resendActive={canResend}
        seconds={countdown}
        handleResend={handleResendClick}
      />
    </div>
  );
};

export default VerifyOtp;
