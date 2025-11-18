import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import Rankings from "@/components/dashboard/director_dashboard/Rankings/Rankings";
import { IoSettingsOutline } from "react-icons/io5";

const Ranking = () => {
  return (
    <div className="w-full">
      <BackBtn />
      <div className="flex justify-between items-center">
        <CommonSectionTitle
          text="Ranking - Elite Officials Summer Camp 2024"
          subText="Performance rankings based on evaluation scores"
        />
        <CommonSubmitBtn variant="primary" type="button" className={"rounded-full!"}>
          <IoSettingsOutline className="h-7 w-6" />
        </CommonSubmitBtn>
      </div>

      <Rankings/>
    </div>
  );
};

export default Ranking;
