import { useParams, useNavigate } from "react-router-dom";
import { usePublicCampDetails } from "@/hooks/api/useNoAuthCamps";
import {
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiHome,
} from "react-icons/fi";
import { IoTrophyOutline } from "react-icons/io5";
import { MdOutlineSportsTennis } from "react-icons/md";
import Swal from "sweetalert2";

const CampDetailsPageForNoAuth = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    data: campDetails,
    isLoading,
    isError,
  } = usePublicCampDetails(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading camp details...</p>
        </div>
      </div>
    );
  }

  if (isError || !campDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <p className="text-red-600 text-center">
          Failed to load camp details. Please try again later.
        </p>
      </div>
    );
  }

  const handleRegisterClick = () => {
    Swal.fire({
      icon: "info",
      title: "Ready to Join the Camp?",
      html: `
        <p class="text-gray-700 mb-6">
          You need to <strong>create an account</strong> or <strong>log in</strong> to register for this camp.
        </p>
      `,
      showCancelButton: true,
      confirmButtonText: "Login",
      cancelButtonText: "Sign Up",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#10b981",
      reverseButtons: true,
      customClass: {
        confirmButton: "px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition",
        cancelButton: "px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition",
        popup: "rounded-2xl mx-4",
      },
      buttonsStyling: false,
    }).then((result) => {
      const intendedPath = `/camp/details/${id}`;

      if (result.isConfirmed) {
        navigate("/auth/signin", {
          state: { from: intendedPath },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        navigate("/auth/signup", {
          state: { from: intendedPath },
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Improved Responsiveness */}
      <div className="relative h-64 sm:h-96 md:h-120 lg:h-140 bg-linear-to-r from-primary to-sky-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full px-4">
          <div className="text-center text-white">
            <img
              src={campDetails.camp_logo}
              alt={`${campDetails.camp_name} Logo`}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6 object-contain bg-white p-3 sm:p-4 rounded-full shadow-lg"
            />
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 sm:mb-4 px-2">
              {campDetails.camp_name}
            </h1>
            <div className="flex items-center justify-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
              <MdOutlineSportsTennis className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10" />
              <span>{campDetails.sports_type_name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-12 -mt-16 sm:-mt-24 md:-mt-28 lg:-mt-36 relative z-20">
        {/* Key Info Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <FiCalendar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-primary mx-auto mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-gray-600">Dates</p>
            <p className="text-sm sm:text-base md:text-lg font-semibold mt-1">
              {campDetails.start_date} - {campDetails.end_date}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <FiMapPin className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-green-600 mx-auto mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-gray-600">Location</p>
            <p className="text-sm sm:text-base md:text-lg font-semibold mt-1">{campDetails.location}</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <FiDollarSign className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-600 mx-auto mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-gray-600">Price</p>
            <p className="text-base sm:text-lg md:text-xl font-bold mt-1">
              ${campDetails.price}
            </p>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 text-center hover:shadow-xl transition-shadow duration-300">
            <IoTrophyOutline className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-600 mx-auto mb-2 sm:mb-3" />
            <p className="text-xs sm:text-sm text-gray-600">Status</p>
            <p className="text-sm sm:text-base md:text-lg font-semibold capitalize text-primary mt-1">
              {campDetails.status}
            </p>
          </div>
        </div>

        {/* Camp Description */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-12 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">About the Camp</h2>
          <div
            className="text-gray-600 prose prose-sm sm:prose lg:prose-base max-w-none break-words"
            dangerouslySetInnerHTML={{ __html: campDetails?.camp_details || "<p>No description available.</p>" }}
          />
        </div>

        {/* Camp Director - Improved Mobile Layout */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-12 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center">Camp Director</h2>
          <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <img
              src={campDetails.director.avatar}
              alt={campDetails.director.name}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover shadow-xl border-4 border-white"
            />
            <div className="text-center md:text-left flex-1">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                {campDetails.director.name}
              </h3>
              <div className="space-y-2 sm:space-y-3 text-sm sm:text-base md:text-lg text-gray-700">
                <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start flex-wrap">
                  <FiMail className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                  <span className="break-all">{campDetails.director.email}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
                  <FiPhone className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                  <span>{campDetails.director.phone}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 justify-center md:justify-start">
                  <FiHome className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 flex-shrink-0" />
                  <span className="break-words">{campDetails.director.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action - Responsive Button */}
        <div className="mt-8 sm:mt-12 text-center px-4 sm:px-0">
          <button
            onClick={handleRegisterClick}
            className="bg-primary cursor-pointer text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-full text-base sm:text-lg md:text-xl shadow-lg transition transform hover:scale-105 hover:shadow-xl active:scale-95 w-full sm:w-auto"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampDetailsPageForNoAuth;