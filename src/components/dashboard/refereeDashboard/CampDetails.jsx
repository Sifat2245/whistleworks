import { Image, Modal, notification, Spin } from "antd";
import Icon from "@/components/common/Icon";
import location from "@/assets/svg/location.svg";
import calender from "/referee/calender-icon.svg";
import singleUser from "/referee/single-user-icon.svg";
import facility from "@/assets/svg/facility.svg";
import { useState } from "react";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { useAuth } from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import dummyImage from "@/assets/dummyCardImg.png"

export default function CampDetails({ campData }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const { userData } = useAuth();
  const axiosSecure = useAxiosSecure();

  const isEvaluator = userData?.role === "evaluator";

  // Note: Destructure camp data
  const {
    id: campId,
    camp_name = "Untitled Camp",
    camp_logo,
    location: campLocation = "Location not specified",
    start_date,
    end_date,
    camp_details = "No description available.",
    sports_type_name = "Unknown Sport",
    price = "N/A",
  } = campData || {};

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleCheckIn = async () => {
    setLoading(true);

    try {
      const response = await axiosSecure.post(
        `/v1/referee/camp/${campId}/checkin`
      );

      const { success, message, data } = response.data;

      if (success && data?.payment_required && data?.checkout_url) {
        // Redirect to Stripe Checkout
        window.location.href = data.checkout_url;
      } else {
        // Already paid or free camp
        api.success({
          message: "Check-in Successful!",
          description:
            message ||
            "You have successfully checked in to the camp. Enjoy your training!",
          placement: "topRight",
        });
        setIsModalOpen(false);
      }
    } catch (error) {
      // Robust error message extraction
      const fallback = "Check-in failed. Please try again.";

      const getErrorString = (obj) => {
        if (typeof obj === "string") return obj;
        if (obj && typeof obj === "object") {
          return (
            obj.message ||
            obj.details ||
            obj.error ||
            obj.description ||
            JSON.stringify(obj)
          );
        }
        return fallback;
      };

      const errorMsg =
        getErrorString(error.response?.data?.message) ||
        getErrorString(error.response?.data) ||
        fallback;

      api.error({
        message: "Check-in Failed",
        description: errorMsg,
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      {contextHolder}

      <div className="space-y-3 mt-10">
        {/* Overview */}
        <div className="border border-border p-5 rounded-[10px]">
          <h3 className="text-xl font-medium mb-5">Overview</h3>

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
          <p className="max-w-lg text-[#666666] leading-relaxed">
            {camp_details}
          </p>
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
                <p className="text-[14px] text-[#666666] capitalize">
                  {sports_type_name}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Check In Button - Only for referees */}
        {!isEvaluator && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white py-4 px-8 rounded-md w-full text-lg font-medium mt-6 cursor-pointer hover:opacity-90 transition"
          >
            Register
          </button>
        )}
      </div>

      {/* Check-in Confirmation Modal */}
      <Modal
        title={
          <h3 className="text-xl font-semibold mb-10">
            Camp Check In Confirmation
          </h3>
        }
        open={isModalOpen}
        onOk={handleCheckIn}
        onCancel={handleCancel}
        confirmLoading={loading}
        cancelText="Go Back"
        okText={loading ? "Processing..." : "Proceed Please.."}
        centered
        width={420}
        okButtonProps={{
          disabled: loading,
          className:
            "bg-primary text-white rounded-md px-6 py-5 text-lg font-medium",
        }}
        cancelButtonProps={{
          className:
            "text-lg font-medium px-6 py-5 rounded-md hover:text-primary hover:border-primary",
        }}
      >
        <div className="flex flex-col items-center text-center">
          {loading ? (
            <Spin size="large" className="my-8" />
          ) : (
            <HiOutlineShieldCheck className="text-5xl text-primary mb-6" />
          )}
          <p className="text-lg mb-8 text-gray-700">
            I have physically arrived at camp and am ready to begin training.
          </p>
          {price !== "N/A" && parseFloat(price) > 0 && (
            <p className="text-sm text-gray-500">
              Note: You will be redirected to Stripe to complete payment if
              required.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
