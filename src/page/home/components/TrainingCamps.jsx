import FilterCamps from "@/page/all-camps/components/FilterCamps";
import CommonText from "../../../components/common/CommonText";
import CommonTitle from "../../../components/common/CommonTitle";
import CommonSubmitBtn from "../../../components/common/CommonSubmitBtn";

const TrainingCamps = ({ trainingCampData }) => {
  return (
    <div className="md:pt-16 pt-10">
      <div className="text-center px-3">
        <CommonTitle
          text={`${trainingCampData?.title || "Available Training Camps"}`}
        />
        {trainingCampData?.description ? (
          <CommonText
            text={`${trainingCampData?.description}`}
            className={
              "my-5 md:my-0 md:mt-5 md:mb-12 md:w-1/2 mx-auto text-neutral-500"
            }
          />
        ) : (
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-neutral-500 text-center px-3">
            Browse and register for upcoming sports referee training camps and led by experienced conference coordinators.
          </p>
        )}
      </div>
      <div className="my-12 container">
        <FilterCamps limit={4} />
      </div>
      <div className="text-center mb-12">
        <CommonSubmitBtn
          variant="primary"
          type="button"
          link={true}
          path="/all-camps"
        >
          View All Camps
        </CommonSubmitBtn>
      </div>
    </div>
  );
};
export default TrainingCamps;
