import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import MyCamps from "@/page/director-dashboard/dashboard/components/MyCampus";


const DirectorHome = () => {
    return (
        <div className="w-full">
            {/* top header */}
            <div className="w-full md:flex items-center justify-between space-y-2 md:space-y-0">
                <CommonSectionTitle
                    text="Director Dashboard"
                    subText="Manage your camps and schedules"
                />
                {/* create camp button */}
                <CommonSubmitBtn variant="primary" link={true} path="/director-dashboard/create-new-camp" className={""}>Create New Camp</CommonSubmitBtn>
            </div>

            {/* My campus list */}
            <MyCamps />
        </div>
    );
};
export default DirectorHome;