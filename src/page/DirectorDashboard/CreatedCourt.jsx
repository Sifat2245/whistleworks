import BackBtn from "@/components/common/BackBtn";
import CourtHeader from "@/components/dashboard/director_dashboard/created_court/CourtHeader";
import CourtLists from "@/components/dashboard/director_dashboard/created_court/CourtLists";

const CreatedCourt = () => {
    return (
        <div className="w-full">
            <BackBtn />
            <CourtHeader />
            <CourtLists />
        </div>
    );
};
export default CreatedCourt;