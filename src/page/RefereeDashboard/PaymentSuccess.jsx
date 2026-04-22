import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setShowContent(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="xl:container min-h-screen mx-auto 2xl:px-5 xs:px-5 px-4 xl:py-[100px] sm:py-20 xs:py-16 py-12 w-full flex flex-col gap-14 justify-center items-center">
      {/* Countdown Screen */}
      {!showContent && (
        <h1 className="text-black text-5xl font-medium">
          Showing payment details in{" "}
          <span className="font-bold">{countdown}</span> seconds...
        </h1>
      )}

      {/* Main Content After Countdown */}
      {showContent && (
        <>
          <h1 className="text-black text-6xl font-medium">Payment Succedded</h1>

          <CommonSubmitBtn
          className={'px-8'}
            variant="primary"
            onClick={() => navigate("/referee-dashboard/active-camps")}
          >
            My Camps
          </CommonSubmitBtn>
        </>
      )}
    </div>
  );
};

export default PaymentSuccess;
