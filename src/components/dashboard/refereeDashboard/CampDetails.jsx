import { Image } from "antd";
import Icon from "@/components/common/Icon";
import location from "@/assets/svg/location.svg";
import calender from "/referee/calender-icon.svg";
import singleUser from "/referee/single-user-icon.svg";
import facility from "@/assets/svg/facility.svg";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import dummyImage from "@/assets/dummyCardImg.png";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function CampDetails({ campData, onRegistrationUpdate }) {
  const [loading, setLoading] = useState(false);

  const { userData } = useAuth();
  const axiosSecure = useAxiosSecure();

  const isEvaluator = userData?.role === "evaluator";
  const isReferee = userData?.role === "referee";

  const {
    id: campId,
    camp_name = "Untitled Camp",
    camp_logo,
    director = {}, // fallback to empty object
    location: campLocation = "Location not specified",
    start_date,
    end_date,
    camp_details = "No description available.",
    sports_type_name = "Unknown Sport",
    price = "N/A",
    referee_registration_status: refereeStatus,
    evaluator_registration_status: evaluatorStatus,
  } = campData || {};

  // Destructure director info with fallbacks
  const {
    name: directorName = "Director name not available",
    avatar: directorAvatar,
    email: directorEmail = "N/A",
    phone: directorPhone = "N/A",
    address: directorAddress = "N/A",
  } = director;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // ... (handleAction, showButton, buttonText, statusBadge logic remains exactly the same)
  const handleAction = async () => {
    // unchanged — keeping your original logic
    let endpoint = "";
    let payload = {};
    let successMessage = "";
    let newStatusField = "";
    let newStatusValue = "";

    if (isEvaluator) {
      endpoint = `/evaluator/camp-registration/register`;
      payload = { camp_id: campId };
      successMessage = "Registration submitted successfully. Waiting for director approval.";
      newStatusField = "evaluator_registration_status";
      newStatusValue = "pending";
    } else if (isReferee && refereeStatus === "registered") {
      endpoint = `/v1/referee/camp/${campId}/checkin`;
      payload = {};
      successMessage = "Checked In Successfully!";
      newStatusField = "referee_registration_status";
      newStatusValue = "checked_in";
    } else if (isReferee) {
      endpoint = `/v1/referee/camp/${campId}/register`;
      payload = {};
      successMessage = "Registered Successfully!";
      newStatusField = "referee_registration_status";
      newStatusValue = "registered";
    }

    await Swal.fire({
      title: isEvaluator
        ? "Evaluator Registration Confirmation"
        : refereeStatus === "registered" && isReferee
        ? "Camp Check In Confirmation"
        : "Camp Registration Confirmation",
      html: `
        <div class="text-center">
          <p class="text-lg text-gray-700 leading-relaxed max-w-md mx-auto">
            ${
              isEvaluator
                ? "I confirm I want to register as an evaluator for this camp."
                : refereeStatus === "registered" && isReferee
                ? "I have physically arrived at camp and am ready to begin training."
                : "I confirm I want to register for this camp."
            }
          </p>
          ${
            price !== "N/A" && parseFloat(price) > 0
              ? '<p class="text-sm text-gray-500 mt-6">Note: You may be redirected to payment if required.</p>'
              : ""
          }
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: loading ? "Processing..." : "Proceed",
      cancelButtonText: "Go Back",
      width: 520,
      padding: "2.5rem",
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: "bg-[#00AEEF] hover:bg-[#0099d4] text-white font-medium rounded-lg px-8 py-3 text-lg",
        cancelButton: "bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg px-8 py-3 text-lg ml-3",
      },
      buttonsStyling: false,
      preConfirm: async () => {
        setLoading(true);
        try {
          const response = await axiosSecure.post(endpoint, payload);

          const { success, data } = response.data;

          if (success) {
            if (data?.payment_required && data?.checkout_url) {
              Swal.close();
              window.location.href = data.checkout_url;
              return;
            }

            toast.success(successMessage);

            onRegistrationUpdate?.({
              ...campData,
              [newStatusField]: newStatusValue,
            });
          }
        } catch (error) {
          const errorMsg =
            error.response?.data?.message ||
            error.response?.data?.error ||
            "Operation failed. Please try again.";

          Swal.showValidationMessage(`<i>${errorMsg}</i>`);
        } finally {
          setLoading(false);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  const currentStatus = isEvaluator ? evaluatorStatus : refereeStatus;

  const showButton = (() => {
    if (!isReferee && !isEvaluator) return false;
    if (isEvaluator) {
      return !currentStatus || currentStatus === "rejected";
    }
    if (isReferee) {
      return currentStatus !== "checked_in";
    }
    return false;
  })();

  const buttonText = (() => {
    if (isEvaluator) return "Register as Evaluator";
    if (isReferee && refereeStatus === "registered") return "Check In";
    return "Register";
  })();

  const statusBadge = (() => {
    if (!currentStatus) return null;

    if (isEvaluator) {
      if (currentStatus === "pending") return { text: "Pending Approval", color: "bg-yellow-500" };
      if (currentStatus === "approved") return { text: "Approved", color: "bg-green-600" };
      if (currentStatus === "rejected") return { text: "Rejected", color: "bg-red-600" };
    } else {
      if (currentStatus === "checked_in") return { text: "Checked In", color: "bg-green-600" };
      if (currentStatus === "registered") return { text: "Registered", color: "bg-[#00AEEF]" };
    }
    return null;
  })();

  return (
    <div className="space-y-3 mt-10">
      {/* Overview */}
      <div className="border border-border p-5 rounded-[10px]">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-xl font-medium">Overview</h3>

          {statusBadge && (
            <span
              className={`inline-block px-6 py-3 rounded-full text-white font-medium text-sm ${statusBadge.color}`}
            >
              {statusBadge.text}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mb-4">
          <Image
            src={camp_logo || dummyImage}
            alt={camp_name}
            width={36}
            height={36}
            preview={false}
            className="rounded-full object-cover"
            fallback={dummyImage}
          />
          <p className="text-[14px] font-normal">{camp_name}</p>
        </div>

        <div className="flex gap-2 mb-3">
          <Icon src={location} className="size-5" />
          <div>
            <p className="text-[#666666]">Location</p>
            <p className="text-lg">{campLocation}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <Icon src={calender} className="size-5 text-primary" />
          <div>
            <p className="text-[#666666]">Dates</p>
            <p className="text-lg">
              {formatDate(start_date)} - {formatDate(end_date)}
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          <Icon src={singleUser} className="size-5 text-primary" />
          <div>
            <p className="text-[#666666]">Sport</p>
            <p className="text-lg capitalize">{sports_type_name}</p>
          </div>
        </div>

        {price !== "N/A" && (
          <div className="flex gap-2 mb-3">
            <Icon src={singleUser} className="size-5 text-primary" />
            <div>
              <p className="text-[#666666]">Camp Fee</p>
              <p className="text-lg">${parseFloat(price).toFixed(2)}</p>
            </div>
          </div>
        )}
      </div>

      {/* Camp Description */}
      <div className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-5">Camp Description</h3>
        <p className="max-w-lg text-[#666666] leading-relaxed">{camp_details}</p>
      </div>

      {/* Venue Information */}
      <div className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-5">Venue Information</h3>
        <div className="flex gap-2 mb-3">
          <Icon src={facility} className="size-5 text-primary" />
          <div>
            <p className="text-[#666666]">Facility</p>
            <p className="text-lg">{campLocation}</p>
          </div>
        </div>
        <div className="bg-[#F5F5F5] px-3 py-2.5 rounded-md">
          <p className="text-[14px] text-[#666666]">Address</p>
          <p className="text-lg">{campLocation}</p>
        </div>
      </div>

      {/* Director Information - Properly Added */}
      <div className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-5">Director Information</h3>

        {/* Director Avatar + Name */}
        <div className="flex items-center gap-4 mb-6">
          <Image
            src={directorAvatar || dummyImage}
            alt={directorName}
            width={60}
            height={60}
            preview={false}
            className="rounded-full object-cover border-2 border-gray-200"
            fallback={dummyImage}
          />
          <div>
            <p className="text-lg font-semibold">{directorName}</p>
            <p className="text-sm text-[#666666]">Camp Director</p>
          </div>
        </div>

        {/* Director Details */}
        <div className="space-y-4">
          {directorEmail !== "N/A" && (
            <div className="flex gap-3">
              <Icon src={singleUser} className="size-5 text-primary mt-0.5" />
              <div>
                <p className="text-[#666666] text-sm">Email</p>
                <p className="text-base">{directorEmail}</p>
              </div>
            </div>
          )}

          {directorPhone !== "N/A" && (
            <div className="flex gap-3">
              <Icon src={singleUser} className="size-5 text-primary mt-0.5" />
              <div>
                <p className="text-[#666666] text-sm">Phone</p>
                <p className="text-base">{directorPhone}</p>
              </div>
            </div>
          )}

          {directorAddress !== "N/A" && (
            <div className="flex gap-3">
              <Icon src={location} className="size-5 text-primary mt-0.5" />
              <div>
                <p className="text-[#666666] text-sm">Address</p>
                <p className="text-base">{directorAddress}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Camp Dates */}
      <div className="border border-border p-5 rounded-[10px]">
        <h3 className="text-xl font-medium mb-5">Camp Dates</h3>
        <div className="space-y-3">
          <div className="flex gap-2 bg-[#F5F5F5] px-3 py-2.5 rounded-md">
            <Icon src={calender} className="size-5 text-primary" />
            <div>
              <p className="text-lg font-normal">Duration</p>
              <p className="text-[14px] text-[#666666]">
                {formatDate(start_date)} to {formatDate(end_date)}
              </p>
            </div>
          </div>
          <div className="flex gap-2 bg-[#F5F5F5] px-3 py-2.5 rounded-md">
            <Icon src={singleUser} className="size-5 text-primary" />
            <div>
              <p className="text-lg font-normal">Sport</p>
              <p className="text-[14px] text-[#666666] capitalize">{sports_type_name}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      {showButton && (
        <button
          onClick={handleAction}
          disabled={loading}
          className="bg-primary text-white py-4 px-8 rounded-md w-full text-lg font-medium mt-6 hover:opacity-90 transition disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Processing..." : buttonText}
        </button>
      )}
    </div>
  );
}