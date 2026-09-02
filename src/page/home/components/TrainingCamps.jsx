import FilterCamps from "@/page/all-camps/components/FilterCamps";
import CommonTitle from "../../../components/common/CommonTitle";
import CommonSubmitBtn from "../../../components/common/CommonSubmitBtn";
import { FaArrowRight } from "react-icons/fa6";

const TrainingCamps = ({ trainingCampData }) => {
  return (
    <section className="py-16 md:py-24 bg-slate-50/70 border-b border-slate-200/60">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">

          <CommonTitle
            text={trainingCampData?.title || "Featured Officiating Camps"}
            className="text-slate-900 text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight"
          />

          <p className="mt-4 text-slate-600 text-base sm:text-lg leading-relaxed">
            {trainingCampData?.description ||
              "Browse and register for upcoming referee training clinics led by veteran conference coordinators and elite evaluators."}
          </p>
        </div>

        {/* Camp Cards Grid */}
        <div className="mb-12">
          <FilterCamps limit={4} />
        </div>

        {/* View All CTA */}
        <div className="text-center">
          <CommonSubmitBtn
            variant="primary"
            type="button"
            link={true}
            path="/all-camps"
            className="group py-3 px-6 text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2"
          >
            <span>Explore All Camps</span>
            <FaArrowRight className="text-xs group-hover:translate-x-1 transition-transform" />
          </CommonSubmitBtn>
        </div>
      </div>
    </section>
  );
};

export default TrainingCamps;
