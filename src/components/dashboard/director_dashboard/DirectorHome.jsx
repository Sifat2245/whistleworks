import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "./CommonSectionTitle";
import MyCampus from "./MyCampus";

const DirectorHome = () => {
    return (
        <div className="w-full pt-24 container">
            {/* top header */}
            <div className="w-full flex items-center justify-between">
                <CommonSectionTitle
                    text="Director Dashboard"
                    subText="Manage your camps and schedules"
                />

                {/* create camp button */}
                <CommonSubmitBtn className={""}>Create New Camp</CommonSubmitBtn>
            </div>

            {/* My campus list */}
            <MyCampus />

        </div>
    );
};
export default DirectorHome;