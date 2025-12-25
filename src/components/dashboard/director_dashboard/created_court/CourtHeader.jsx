import CommonSectionTitle from "../CommonSectionTitle";

const CourtHeader = ({campData}) => {

    return (
        <div className="w-full flex items-center justify-between mt-5">
            <CommonSectionTitle
                text={`Schedule - ${campData?.camp_name}`}
                subText="Manage games, locations, and referee assignments"
                wrapperClass={"w-full"}
            />

          
        </div>
    );
};
export default CourtHeader;