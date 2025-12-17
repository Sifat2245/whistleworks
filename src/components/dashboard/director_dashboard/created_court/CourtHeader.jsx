import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "../CommonSectionTitle";

const CourtHeader = ({campData}) => {

    return (
        <div className="w-full flex items-center justify-between mt-5">
            <CommonSectionTitle
                text={`Schedule - ${campData?.camp_name}`}
                subText="Manage games, locations, and referee assignments"
                wrapperClass={"w-full"}
            />

            {/* buttons */}
            <div className="w-full flex items-center justify-end gap-10">
                <CommonSubmitBtn>Assign by crew ?</CommonSubmitBtn>
                <CommonSubmitBtn>Auto-Assign Referees</CommonSubmitBtn>
            </div>
        </div>
    );
};
export default CourtHeader;