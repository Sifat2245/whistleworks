import { Image, Modal, notification } from "antd";
import profile from "@/assets/dashboard/profile.png";
import Icon from "@/components/common/Icon";
import location from "@/assets/svg/location.svg";
import calender from "/referee/calender-icon.svg";
import singleUser from "/referee/single-user-icon.svg";
import facility from "@/assets/svg/facility.svg";
import { useState } from "react";
import { HiOutlineShieldCheck } from "react-icons/hi2";
import { useAuth } from "@/hooks/useAuth";

export default function CampDetails() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [api, contextHolder] = notification.useNotification();
  const { userData } = useAuth();

  const isEvaluator = userData?.role === "evaluator";

  const handleOk = (type) => {
    api[type]({
      description: (
        <span>
          You have successfully checked in to the camp. Enjoy your training!
        </span>
      ),
      placement: "topRight",
      className: "bg-white!",
    });
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="bg-red-400">{contextHolder}</div>
      <div className="space-y-3 mt-10">
        {/* !!====================== Overview ========================!! */}
        <div className="border border-border p-5 rounded-[10px]">
          <h3 className="text-xl font-medium mb-5">Overview</h3>
          <div className="flex items-center gap-1.5 mb-4">
            <Image
              src={profile}
              alt="Camp Overview"
              width={36}
              height={36}
              preview={false}
              className="rounded-full"
            />
            <p className="text-[14px] font-normal">Emily Chen</p>
          </div>
          <div className="flex gap-2 mb-3">
            <Icon src={location} className="size-5" />
            <div>
              <p className="text-[#666666]">Location</p>
              <p className="text-lg">Los Angeles, CA</p>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <Icon src={calender} className="size-5 text-primary" />
            <div>
              <p className="text-[#666666]">Dates</p>
              <p className="text-lg">Nov 1-7, 2025</p>
            </div>
          </div>
          <div className="flex gap-2 mb-3">
            <Icon src={singleUser} className="size-5 text-primary" />
            <div>
              <p className="text-[#666666]">Sport</p>
              <p className="text-lg">soccer</p>
            </div>
          </div>
        </div>
        {/* !!====================== camp description ========================!! */}
        <div className="border border-border p-5 rounded-[10px]">
          <h3 className="text-xl font-medium mb-5">Camp Description</h3>
          <p className="max-w-lg text-[#666666]">
            This intensive training camp focuses on advanced officiating
            techniques, rule interpretations, and game management skills.
            Participants will engage in classroom sessions, on-field practice,
            and receive personalized feedback from experienced instructors.
          </p>
        </div>
        {/* !!================== Venue Information ===============!!*/}
        <div className="border border-border p-5 rounded-[10px]">
          <h3 className="text-xl font-medium mb-5">Venue Information</h3>
          <div className="flex gap-2 mb-3">
            <Icon src={facility} className="size-5 text-primary" />
            <div>
              <p className="text-[#666666]">Facility</p>
              <p className="text-lg">Elite Sports Training Center</p>
            </div>
          </div>
          <div className="bg-[#F5F5F5] px-3 py-2.5 rounded-md">
            <p className="text-[14px] text-[#666666]">Address</p>
            <p className="text-lg">1234 Championship Drive</p>
            <p className="text-lg">Los Angeles, CA</p>
          </div>
        </div>
        {/* !!================== Daily Schedule ===============!!*/}
        <div className="border border-border p-5 rounded-[10px]">
          <h3 className="text-xl font-medium mb-5">Daily Schedule</h3>
          <div className="space-y-3">
            <div className="flex gap-2 bg-[#F5F5F5] px-3 py-2.5 rounded-md">
              <Icon src={location} className="size-5" />
              <div>
                <p className="text-lg font-normal">Location</p>
                <p className="text-[14px] text-[#666666]">Los Angeles, CA</p>
              </div>
            </div>
            <div className="flex gap-2 bg-[#F5F5F5] px-3 py-2.5 rounded-md">
              <Icon src={calender} className="size-5 text-primary" />
              <div>
                <p className="text-lg font-normal">Dates</p>
                <p className="text-[14px] text-[#666666]">Nov 1-7, 2025</p>
              </div>
            </div>
            <div className="flex gap-2 bg-[#F5F5F5] px-3 py-2.5 rounded-md">
              <Icon src={singleUser} className="size-5 text-primary" />
              <div>
                <p className="text-lg font-normal">Sport</p>
                <p className="text-[14px] text-[#666666]">Soccer</p>
              </div>
            </div>
          </div>
        </div>
        {/* !!================== Check In Button ===============!!*/}
        {isEvaluator ? (
          <></>
        ) : (
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white py-4 px-8 rounded-md w-full text-lg font-medium mt-3 cursor-pointer"
          >
            Check In
          </button>
        )}
      </div>
      <Modal
        title={
          <h3 className="text-xl font-semibold! mb-10">
            Camp Check In Confirmation
          </h3>
        }
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={() => handleOk("success")}
        onCancel={handleCancel}
        cancelText="Go Back"
        okText="Confirm"
        centered={true}
        width={400}
        okButtonProps={{
          className:
            "bg-primary! text-white! rounded-md! px-6! py-5! text-lg! font-medium!",
        }}
        cancelButtonProps={{
          className:
            "text-lg! font-medium! px-6! py-5! rounded-md! hover:text-primary! hover:border-primary!",
        }}
      >
        <HiOutlineShieldCheck className="text-3xl text-primary flex items-center w-full mb-10" />
        <p className="text-lg mb-8">
          I have physically arrived at camp and am ready ready to go.
        </p>
      </Modal>
    </div>
  );
}
