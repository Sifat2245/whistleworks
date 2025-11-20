import { FaUser, FaMapMarkerAlt, FaClock, FaDollarSign } from "react-icons/fa";
import CommonSubmitBtn from "../common/CommonSubmitBtn";

const CampCard = ({ camp }) => {
  const pathname = window.location.pathname;
  console.log(pathname);
  const {
    camp_name,
    camp_logo,
    location,
    start_date,
    end_date,
    fee,
    coach,
    total,
  } = camp || {};
  return (
    <div className="border border-gray-300 hover:border-primary rounded-xl p-5 w-full max-w-[380px] bg-white shadow-sm hover:shadow-md duration-400">
      {/* Title and Image */}
      <div className="flex justify-between items-start mb-4 gap-10">
        <h2 className="text-lg font-semibold leading-snug">{camp_name}</h2>
        <img
          src={camp_logo}
          alt="camp"
          className="h-12 w-12 rounded-full object-cover bg-gray-100"
        />
      </div>

      {/* Info */}
      <div className="space-y-2 text-gray-700 text-sm">
        <div className="flex items-center gap-2">
          <FaUser className="text-primary" />
          <span>{coach}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-primary" />
          <span>{location}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaClock className="text-primary" />
          <span>
            {start_date} to {end_date}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FaDollarSign className="text-primary" />
          <span>Camp Fee: {fee}</span>
        </div>
      </div>

      {/* Divider */}
      <hr className="my-4 border-gray-200" />

      {pathname !== "/" && <div className="flex items-center gap-2 mb-4">
        <span className="text-xl font-medium text-primary">Total : ${total}</span>
      </div>}

      {/* Button */}
      <CommonSubmitBtn variant="primary" className={"w-full"}>
        {
          pathname === "/" ? "View Details & Register" : "View Details"
        }
      </CommonSubmitBtn>
    </div>
  );
};

export default CampCard;
