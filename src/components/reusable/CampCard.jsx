import { FaUser, FaMapMarkerAlt, FaClock, FaDollarSign } from "react-icons/fa";
import CommonSubmitBtn from "../common/CommonSubmitBtn";
import { useAuth } from "@/hooks/useAuth";
import dummyImage from "@/assets/dummyCardImg.png";
import { useLocation } from "react-router-dom";

const CampCard = ({ camp }) => {
  const location = useLocation();
  const { userData, isLoggedIn } = useAuth();

  const userRole = userData?.role?.toLowerCase();

  const {
    id: campId,
    camp_name,
    camp_logo,
    location: campLocation,
    start_date,
    end_date,
    price,
    sport,
    director,
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

  const getButtonPath = () => {
    if (!isLoggedIn) {
      return `/all-camps/${campId}`;
    }

    // Logged in → Role-based dashboard
    if (userRole === "director") {
      return `/director-dashboard/camp-overview/${campId}`;
    }
    if (userRole === "evaluator") {
      return `/evaluator-dashboard/camp/${campId}?tab=camp-details`;
    }
    if (userRole === "referee") {
      return `/referee-dashboard/camp/${campId}?tab=camp-details`;
    }

    // Fallback (shouldn't happen if isLoggedIn is true)
    return `/camp/details/${campId}`;
  };

  const buttonPath = getButtonPath();

  // Button text logic
  const getButtonText = () => {
    if (!isLoggedIn) {
      return location.pathname === "/" ? "View Details & Register" : "View Details";
    }
    return userRole === "director" ? "View Camp" : "View Details";
  };

  return (
    <div className="border border-gray-300 hover:border-primary rounded-xl p-5 w-full max-w-[380px] bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Title and Logo */}
      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold leading-snug flex-1">
            {camp_name || "Untitled Camp"}
          </h2>
          <p className="text-sm text-neutral-600">
            Director: <strong>{director?.name || "N/A"}</strong>
          </p>
        </div>
        <img
          src={camp_logo || dummyImage}
          alt={camp_name || "Camp logo"}
          className="h-18 w-18 rounded-full object-cover bg-gray-100 shrink-0"
          onError={(e) => {
            e.target.src = dummyImage;
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
          <span>{campLocation || "Location not specified"}</span>
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
      {location.pathname !== "/" && (
        <div className="mb-4">
          <span className="text-xl font-medium text-primary">
            Total: {displayPrice}
          </span>
        </div>
      )}

      {/* Action Button */}
      <CommonSubmitBtn
        variant="primary"
        className="w-full"
        link={true}
        path={buttonPath}
      >
        {getButtonText()}
      </CommonSubmitBtn>
    </div>
  );
};

export default CampCard;