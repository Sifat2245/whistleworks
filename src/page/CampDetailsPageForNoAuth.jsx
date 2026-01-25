import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom"; // ← Add useNavigate
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
import Swal from "sweetalert2"; // ← Import SweetAlert2

const CampDetailsPageForNoAuth = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // ← For redirection
  const axiosInstance = useAxiosSecure();

  const {
    data: campDetails,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["camp-details", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/no-auth/camp/details/${id}`);
      return response?.data?.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading camp details...</p>
        </div>
      </div>
    );
  }

  if (isError || !campDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">
          Failed to load camp details. Please try again later.
        </p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Handle Register Button Click
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
        confirmButton:
          "px-6 py-3 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition",
        cancelButton:
          "px-6 py-3 text-lg font-medium rounded-lg shadow-md hover:shadow-lg transition",
        popup: "rounded-2xl",
      },
      buttonsStyling: false,
    }).then((result) => {
      const intendedPath = `/camp/details/${id}`; 

      if (result.isConfirmed) {
        // Login
        navigate("/auth/signin", {
          state: { from: intendedPath },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // Sign Up
        navigate("/auth/signup", {
          state: { from: intendedPath },
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-140 bg-linear-to-r from-primary to-sky-600 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white">
            <img
              src={campDetails.camp_logo}
              alt={`${campDetails.camp_name} Logo`}
              className="w-32 h-32 mx-auto mb-6 object-contain bg-white p-4 rounded-full shadow-lg"
            />
            <h1 className="text-5xl font-bold mb-4">{campDetails.camp_name}</h1>
            <div className="flex items-center justify-center gap-3 text-2xl">
              <MdOutlineSportsTennis className="w-10 h-10" />
              <span>{campDetails.sports_type_name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 -mt-36 relative z-20">
        {/* Key Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FiCalendar className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="text-gray-600">Dates</p>
            <p className="text-lg font-semibold">
              {formatDate(campDetails.start_date)} -{" "}
              {formatDate(campDetails.end_date)}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FiMapPin className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <p className="text-gray-600">Location</p>
            <p className="text-xl font-semibold">{campDetails.location}</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <FiDollarSign className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
            <p className="text-gray-600">Price</p>
            <p className="text-xl font-bold ">
              ${campDetails.price}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <IoTrophyOutline className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <p className="text-gray-600">Status</p>
            <p className="text-xl font-semibold capitalize text-primary">
              {campDetails.status}
            </p>
          </div>
        </div>

        {/* Camp Description */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6">About the Camp</h2>
          <div
          className="text-gray-600 prose prose-sm sm:prose lg:prose-base max-w-none"
          dangerouslySetInnerHTML={{ __html: campDetails?.camp_details || "<p>No description available.</p>" }}
        />
        </div>

        {/* Camp Director */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Camp Director</h2>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <img
              src={campDetails.director.avatar}
              alt={campDetails.director.name}
              className="w-48 h-48 rounded-full object-cover shadow-xl"
            />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold mb-4">
                {campDetails.director.name}
              </h3>
              <div className="space-y-4 text-lg text-gray-700">
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <FiMail className="w-6 h-6 text-primary" />
                  <span>{campDetails.director.email}</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <FiPhone className="w-6 h-6 text-green-600" />
                  <span>{campDetails.director.phone}</span>
                </div>
                <div className="flex items-center gap-3 justify-center md:justify-start">
                  <FiHome className="w-6 h-6 text-purple-600" />
                  <span>{campDetails.director.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <button
            onClick={handleRegisterClick}
            className="bg-primary cursor-pointer text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transition transform hover:scale-105"
          >
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampDetailsPageForNoAuth;
