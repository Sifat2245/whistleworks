import FilterCamps from "@/shared/FilterCamps";
import CommonText from "../common/CommonText";
import CommonTitle from "../common/CommonTitle";

const TrainingCamps = () => {
  return (
    <div className="md:pt-16 pt-10">
      <div className="text-center px-3">
        <CommonTitle text="Available Training Camps" />
        <CommonText
          text="Browse and register for upcoming Sports referee training camps and workshops led by experienced directors."
          className={"my-5 md:my-0 md:mt-5 md:mb-12 md:w-1/2 mx-auto text-neutral-500"}
        />
      </div>
      <div>
        <FilterCamps limit={4}/>
      </div>
    </div>
  );
};
export default TrainingCamps;