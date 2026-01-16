import OtpWrapper from "@/components/auth/OtpWrapper";
import ResendCode from "@/components/auth/ResendCode";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import { useAuth } from "@/hooks/useAuth";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { maskEmail } from "@/utils/maskEmail";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const axiosPublic = useAxiosPublic();
  const get_email = sessionStorage.getItem("verify_email");
  const get_otp = sessionStorage.getItem("testing_purpose_otp");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(30);
  const [resendActive, setResendActive] = useState(false);
  const [testingOtp, setTestingOtp] = useState(get_otp)

  const {handleLogin, userRefetch} = useAuth()

  // Note: handle otp submit mutaition
  const handleOtpSubmitMutation = useMutation({
    mutationKey: ["confirmSignUpOtp"],
    mutationFn: async (data) => {
      const response = await axiosPublic.post(`/verify-email`, data);
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "OTP verification successful");
      console.log(data, 'verification data');
      handleLogin(data?.token)
      userRefetch()
      sessionStorage.removeItem("verify_email");
      sessionStorage.removeItem("testing_purpose_otp");

      // Check if user came from camp signup flow
      const intendedCampId = sessionStorage.getItem("intended_camp_id");
      const fromSignup = sessionStorage.getItem("intended_from_signup");

    }
  });

  // Note: handle otp submit
  const handleOtpSubmit = () => {
    if (otp.length !== 4) return setError(true);
    handleOtpSubmitMutation.mutate({ otp, email: get_email });
  }

  // Note: handle resend otp mutation
  const handleResendOtpMutation = useMutation({
    mutationKey: ["resend-otp"],
    mutationFn: async () => {
      const response = await axiosPublic.post(`/resend-otp`, { email: get_email });
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "OTP Resend successful. Please check your email.");
      if (data?.otp) {
        setTestingOtp(data?.otp.toString())
        sessionStorage.setItem("testing_purpose_otp", data?.otp.toString())
      } else {
        console.log("No otp found in response", data);
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Something went wrong! Please try again.");
    }
  });

  const OtpChange = (val) => {
    setOtp(val);
  };

  const handleResend = () => {
    if (!resendActive) return;
    setSeconds(30);
    setResendActive(false);
    console.log("Resend OTP clicked");
    handleResendOtpMutation.mutate();
  };

  useEffect(() => {
    let timer;
    if (seconds > 0) {
      timer = setInterval(() => setSeconds((prev) => prev - 1), 1000);
    } else {
      setResendActive(true);
    }
    return () => clearInterval(timer);
  }, [seconds]);

  // Note: main ui component
  return (
    <div className="w-full max-w-2xl mx-auto">

      <h1 className="text-2xl font-semibold mb-4 text-center">Verify OTP</h1>
      <p className="text-center text-sm text-neutral-600">
        Enter the 4-digit code sent to your email or phone
      </p>

      <div className="space-y-2 my-5 text-neutral-600">
        <p className="text-center">Please check on your email</p>
        <p className="text-sm font-medium text-center text-[#333]">{maskEmail(get_email)}</p>
      </div>

      {/* <div className="w-full flex flex-col gap-2 items-center mb-4">
        <p className="text-center text-red-400 font-semibold">This otp shown only for testing purpose. It will be remove the production version</p>

        <p className="w-fit bg-red-300 text-white font-medium py-2 px-4 rounded-sm">Using this OTP: {testingOtp}</p>
      </div> */}

      <OtpWrapper otp={otp} OtpChange={OtpChange} />
      {
        error && (
          <p className="text-sm text-red-500 text-center mt-2">
            Please enter a valid 4-digit code
          </p>
        )
      }

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
export default VerifyOtp;