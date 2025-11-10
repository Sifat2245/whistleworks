import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { useEffect, useRef, useState } from "react";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(120);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }
    const timer = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]$/.test(value)) {
      return;
    }
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        if (index > 0) {
          newOtp[index - 1] = "";
          inputsRef.current[index - 1].focus();
        }
      } else {
        newOtp[index] = "";
      }
      setOtp(newOtp);
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("Text").slice(0, 4);
    if (!/^\d+$/.test(pasteData)) {
      return;
    }
    const newOtp = pasteData.split("");
    while (newOtp.length < 4) {
      newOtp.push("");
    }
    setOtp(newOtp);
    inputsRef.current[Math.min(3, newOtp.length - 1)].focus();
  };

  const handleSubmit = () => {
    console.log("Entered OTP:", otp.join(""));
    // TODO: verify OTP backend integration
  };

  const handleResend = () => {
    console.log("Resend OTP clicked");
    setResendTimer(120);
    setOtp(["", "", "", ""]);
    inputsRef.current[0].focus();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-12">
        <h1 className="text-2xl font-semibold mb-4 text-center">Verify OTP</h1>
        <p className="text-center text-sm text-neutral-600">
          Enter the 4-digit code sent to your email or phone
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-14 mb-6">
        {otp.map((digit, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            value={digit}
            ref={(el) => (inputsRef.current[index] = el)}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleBackspace(e, index)}
            onPaste={handlePaste}
            className="w-30 h-24 text-center text-xl border border-black/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        ))}
      </div>

      {/* Submit */}
      <CommonSubmitBtn
        type="button"
        variant="primary"
        className="w-full mb-8"
        onClick={handleSubmit}
      >
        Continue
      </CommonSubmitBtn>

      {/* Resend OTP */}
      <div className="text-center text-sm text-neutral-600">
        {resendTimer > 0 ? (
          <span>
            Resend OTP in {Math.floor(resendTimer / 60)}:
            {(resendTimer % 60).toString().padStart(2, "0")}
          </span>
        ) : (
          <button
            className="text-primary font-medium hover:underline"
            onClick={handleResend}
          >
            Resend OTP
          </button>
        )}
      </div>
    </div>
  );
};

export default VerifyOtp;
