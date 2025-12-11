import OtpWrapper from "@/components/auth/OtpWrapper";
import ResendCode from "@/components/auth/ResendCode";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import LoaderV2 from "@/components/common/LoaderV2";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { maskEmail } from "@/utils/maskEmail";
import { useMutation } from "@tanstack/react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const axiosPublic = useAxiosPublic();
  const get_email = sessionStorage.getItem("verify_email");
  const get_otp = sessionStorage.getItem("testing_purpose_otp");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [seconds, setSeconds] = useState(25);
  // eslint-disable-next-line no-unused-vars
  const [resendActive, setResendActive] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [resendTimer, setResendTimer] = useState(120);
  const inputsRef = useRef([]);

  // Note: handle otp submit mutaition
  const handleOtpSubmitMutation = useMutation({
    mutationKey: ["confirmSignUpOtp"],
    mutationFn: async (data) => {
      const response = await axiosPublic.post(`/verify-email`, data);
      return response?.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "OTP verification successful");
      sessionStorage.removeItem("verify_email");
      sessionStorage.removeItem("testing_purpose_otp");
      setTimeout(() => {
        // Navigate to signin and replace history
        navigate("/auth/signin", {
          replace: true,
          state: { fromVerification: true }
        });
        toast.success("Please Login Your Account.");
      }, 1500);
    }
  });
  // Note: handle otp submit
  const handleOtpSubmit = () => {
    if (otp.length !== 4) return setError(true);
    handleOtpSubmitMutation.mutate({ otp, email: get_email });
  }


  const OtpChange = (val) => {
    setOtp(val);
  };

  const handleResend = () => {
    console.log("Resend OTP clicked");
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
        <p className="text-sm font-medium text-center text-[#333]">{maskEmail(get_email)}</p>
      </div>

      <div className="w-full flex flex-col gap-2 items-center mb-4">
        <p className="text-center text-red-400 font-semibold">This otp shown only for testing purpose. It will be remove the production version</p>

        <p className="w-fit bg-red-300 text-white font-medium py-2 px-4 rounded-sm">Using this OTP: {get_otp}</p>
      </div>

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
        resendActive={handleResend}
        seconds={seconds}
      />



      {/* <div className="text-center text-sm text-neutral-600">
        {resendTimer > 0 ? (
          <span className="cursor-pointer underline">
            Resend OTP in {Math.floor(resendTimer / 60)}:
            {(resendTimer % 60).toString().padStart(2, "0")}
          </span>
        ) : (
          <button
            className="cursor-pointer underline text-primary font-medium hover:underline"
            onClick={handleResend}
          >
            Resend OTP
          </button>
        )}
      </div> */}
    </div>
  );
};
export default VerifyOtp;






/*


import OtpWrapper from "@/components/auth/OtpWrapper";
import ResendCode from "@/components/auth/ResendCode";
import CommonAuthContainer from "@/components/common/CommonAuthContainer";
import CommonAuthSubContainer from "@/components/common/CommonAuthSubContainer";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { maskEmail } from "@/utils/maskEmail";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { HiArrowNarrowRight } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";

const RegistrationConfirmOtp = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [otp, setOtp] = useState("");
    const [seconds, setSeconds] = useState(25);
    const [resendActive, setResendActive] = useState(false);
    // const [testingOtp, setTestingOtp] = useState("");
    const axiosPublic = useAxiosPublic();
    const verify_email = sessionStorage.getItem("verify_email");


    // Note: check if user came from registration page 
    useEffect(() => {
        if (location.state?.fromRegistration !== true) {
            navigate("/", { replace: true });
        }
    }, [location, navigate]);


    // Note: Initialize testing OTP from sessionStorage
    // useEffect(() => {
    //     const storedOtp = sessionStorage.getItem("testing_purpose_otp");
    //     if (storedOtp) {
    //         setTestingOtp(storedOtp);
    //     }
    // }, []);

    const OtpChange = (val) => {
        setOtp(val);
    };

    // note: confirm signup otp mutation
    const confirmSignUp = useMutation({
        mutationKey: ["confirmSignUpOtp"],
        mutationFn: async (data) => {
            const response = await axiosPublic.post("/verify-email", data);
            return response?.data;
        },
        onSuccess: (res) => {
            toast.success(res?.message || "OTP verification successful");
            sessionStorage.removeItem("verify_email");
            sessionStorage.removeItem("testing_purpose_otp");
            setTimeout(() => {
                // Navigate to signin and replace history
                navigate("/auth/signin", {
                    replace: true,
                    state: { fromVerification: true }
                });
                toast.success("Please Login Your Account.");
            }, 1500);
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        }
    });
    // Note: final otp confirm submit handler
    const handleSubmit = () => {
        if (otp.length !== 4) return toast.error("Please enter a valid 4-digit code");
        confirmSignUp.mutate({ otp, email: verify_email });
    };
    // note: resend otp mutation
    const resendOtp = useMutation({
        mutationKey: ["merchandise_resendResetOtp"],
        mutationFn: (data) => axiosPublic.post("/resend-otp", data).then(res => {
            return res.data;
        }),
        onSuccess: (res) => {
            toast.success(res?.message || "OTP resent successfully");

            // Check different response structures
            const newOtp = res.data?.otp || res.otp || res.data;
            if (newOtp) {
                // setTestingOtp(newOtp.toString());
                // sessionStorage.setItem("testing_purpose_otp", newOtp.toString());
            } else {
                // console.warn("No OTP found in response:", res);
            }
        },
        onError: (err) => {
            toast.error(err?.response?.data?.message || "Something went wrong!");
        }
    });

    const handleResend = () => {
        if (!resendActive) return;
        setSeconds(25);
        setResendActive(false);
        resendOtp.mutate({ email: verify_email });
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

    // note: main ui component start here
    return (
        <CommonAuthContainer>
            <CommonAuthSubContainer>
                <h4 className="text-primary text-2xl font-medium">Check your email</h4>
                <p>{maskEmail(verify_email)}</p>
          
                {testingOtp && (
                    <div className="bg-amber-200 text-primary p-4 rounded-lg mb-4 text-center">
                        <p className="font-bold">TESTING MODE</p>
                        <p>Current OTP: <span className="font-mono font-bold">{testingOtp}</span></p>
                        <p className="text-sm mt-1">This will not be visible in production</p>
                    </div>
                )}    
             

                <OtpWrapper otp={otp} OtpChange={OtpChange} />

                <CommonSubmitBtn
                    className={"w-full flex items-center gap-3 text-[rgba(48,48,48,0.60)]"}
                    type="button"
                    isLoading={confirmSignUp.isPending}
                    onclick={handleSubmit}
                >
                    Continue
                    <HiArrowNarrowRight />
                </CommonSubmitBtn>

                <ResendCode
                    handleResend={handleResend}
                    seconds={seconds}
                    resendActive={resendActive}
                    isLoading={resendOtp.isPending}
                />
            </CommonAuthSubContainer>
        </CommonAuthContainer>
    );
};
export default RegistrationConfirmOtp;



*/ 