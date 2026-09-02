import CommonSubmitBtn from "../../../components/common/CommonSubmitBtn";
import CommonTitle from "../../../components/common/CommonTitle";
import { FaCircleCheck, FaChevronRight } from "react-icons/fa6";

const ReadyToTrasform = ({ operationData }) => {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="relative rounded-3xl bg-linear-to-br from-slate-900 via-slate-800 to-slate-950 p-8 sm:p-12 lg:p-16 text-white overflow-hidden shadow-2xl border border-slate-700/60">
          {/* Background Glow Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center">

            <CommonTitle
              text={operationData?.title || "Ready to Elevate Your Officiating Operations?"}
              className="text-white text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
            />

            <p className="mt-5 text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed">
              {operationData?.description ||
                "Join hundreds of conference directors and referee coordinators using Whistle Works to streamline camps, schedules, and evaluations."}
            </p>

            {/* Feature Checklist */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 my-8 text-xs sm:text-sm font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <FaCircleCheck className="text-primary text-base" />
                <span>Zero Setup Fees</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCircleCheck className="text-primary text-base" />
                <span>Instant Roster Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCircleCheck className="text-primary text-base" />
                <span>24/7 Coordinator Support</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <CommonSubmitBtn
                link
                path="/auth/signup"
                variant="primary"
                className="w-full sm:w-auto min-w-[200px] py-3.5 px-8 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl bg-[#00AEEF] hover:bg-white text-white hover:text-slate-900 border border-[#00AEEF] hover:border-white transition-all flex items-center justify-center gap-2"
              >
                <span>Create Your Account</span>
                <FaChevronRight className="text-xs" />
              </CommonSubmitBtn>

              <CommonSubmitBtn
                link
                path="/all-camps"
                variant="secondary"
                className="w-full sm:w-auto min-w-[180px] py-3.5 px-6 text-base font-bold rounded-xl bg-white/10 text-white border-white/20 hover:bg-white hover:text-slate-900 hover:border-white transition-all"
              >
                Browse Public Camps
              </CommonSubmitBtn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReadyToTrasform;