import { FaUser, FaMapMarkerAlt, FaClock, FaDollarSign } from "react-icons/fa";
import CommonSubmitBtn from "../common/CommonSubmitBtn";
import { useAuth } from "@/hooks/useAuth";

const CampCard = ({ camp }) => {
  const pathname = window.location.pathname;
  const { userData } = useAuth();

  const userRole = userData?.role?.toLowerCase();

  // Define navigation paths based on user role
  const getDashboardPath = () => {
    if (userRole === "director") {
      return `/director-dashboard/camp-overview/${camp?.id}`;
    }
    if (userRole === "evaluator") {
      return `/evaluator-dashboard/camp/${camp?.id}?tab=camp-details`;
    }
    if (userRole === "referee") {
      return `/referee-dashboard/camp/${camp?.id}?tab=camp-details`;
    }
    return `/auth/signin`;
  };

  const dashboardPath = getDashboardPath();

  const {
    camp_name,
    camp_logo,
    location,
    start_date,
    end_date,
    price,
    sport,
  } = camp || {};

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const coachName = sport?.sports_name || "Various Coaches";
  const displayPrice = price ? `$${parseFloat(price).toFixed(2)}` : "Free";

  return (
    <div className="border border-gray-300 hover:border-primary rounded-xl p-5 w-full max-w-[380px] bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Title and Logo */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <h2 className="text-lg font-semibold leading-snug flex-1">
          {camp_name || "Untitled Camp"}
        </h2>
        <img
          src={camp_logo || "https://via.placeholder.com/72?text=Camp"}
          alt={camp_name || "Camp logo"}
          className="h-18 w-18 rounded-full object-cover bg-gray-100 shrink-0"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/72?text=Camp";
          }}
        />
      </div>

      {/* Info Rows */}
      <div className="space-y-3 text-gray-700 text-sm">
        <div className="flex items-center gap-2">
          <FaUser className="text-primary shrink-0" />
          <span>{coachName}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaMapMarkerAlt className="text-primary shrink-0" />
          <span>{location || "Location not specified"}</span>
        </div>

        <div className="flex items-center gap-2">
          <FaClock className="text-primary shrink-0" />
          <span>
            {formatDate(start_date)} to {formatDate(end_date)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FaDollarSign className="text-primary shrink-0" />
          <span>Camp Fee: {displayPrice}</span>
        </div>
      </div>

      <hr className="my-4 border-gray-200" />

      {/* Total Price - only show on dashboard pages */}
      {pathname !== "/" && (
        <div className="mb-4">
          <span className="text-xl font-medium text-primary">
            Total: {displayPrice}
          </span>
        </div>
      )}

      {/* Action Button - Dynamic path based on role */}
      <CommonSubmitBtn
        variant="primary"
        className="w-full"
        link={true}
        path={dashboardPath}
      >
        {userRole === "director" ? "View Camp" : pathname === "/" ? "View Details & Register" : "View Details"}
      </CommonSubmitBtn>
    </div>
  );
};

export default CampCard;