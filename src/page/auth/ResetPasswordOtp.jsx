import OtpWrapper from "@/components/auth/OtpWrapper";
import ResendCode from "@/components/auth/ResendCode";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import { maskEmail } from "@/utils/maskEmail";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useVerifyResetOtp } from "@/hooks/api/useAuth";

const ResetPasswordOtp = () => {
  const get_email = sessionStorage.getItem("verify_email");
  const get_otp = sessionStorage.getItem("testing_purpose_otp");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [seconds, setSeconds] = useState(25);
  // eslint-disable-next-line no-unused-vars
  const [resendActive, setResendActive] = useState(false);
  const inputsRef = useRef([]);

  // Note: handle otp submit mutaition
  const handleOtpSubmitMutation = useVerifyResetOtp({
    onSuccess: (res) => {
      const token = res?.data?.token;
      const message = res?.data?.message;
      toast.success(message || "OTP verification successful");
      sessionStorage.setItem("reset_token", token);
      navigate("/auth/reset-password");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    },
  });

  // Note: handle otp submit
  const handleOtpSubmit = () => {
    if (otp.length !== 4) return setError(true);
    handleOtpSubmitMutation.mutate({ otp, email: get_email });
  };

  const OtpChange = (val) => {
    setOtp(val);
  };

  const handleResend = () => {
    // console.log("Resend OTP clicked");
    inputsRef.current[0].focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4 text-center">Verify OTP</h1>
      <p className="text-center text-sm text-neutral-600">
        Enter the 4-digit code sent to your email or phone
      </p>

      <div className="space-y-2 my-5 text-neutral-600">
        <p className="text-center">Please check on your email</p>
        <p className="text-sm font-medium text-center text-[#333]">
          {maskEmail(get_email)}
        </p>
      </div>
      {/* 
            <div className="w-full flex flex-col gap-2 items-center mb-4">
                <p className="text-center text-red-400 font-semibold">This otp shown only for testing purpose. It will be remove the production version</p>

                <p className="w-fit bg-red-300 text-white font-medium py-2 px-4 rounded-sm">Using this OTP: {get_otp}</p>
            </div> */}

      <OtpWrapper otp={otp} OtpChange={OtpChange} />
      {error && (
        <p className="text-sm text-red-500 text-center mt-2">
          Please enter a valid 4-digit code
        </p>
      )}

      {/* Submit */}
      <CommonSubmitBtn
        type="button"
        variant="primary"
        className="w-full my-8"
        disabled={handleOtpSubmitMutation.isPending}
        onClick={handleOtpSubmit}
      >
        {handleOtpSubmitMutation.isPending ? <LoaderV2 /> : "Continue"}
      </CommonSubmitBtn>

      {/* Resend OTP */}
      <ResendCode
        resendActive={resendActive}
        seconds={seconds}
        handleResend={handleResend}
      />
    </div>
  );
};
export default ResetPasswordOtp;
