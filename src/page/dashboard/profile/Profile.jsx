import { Divider, Image } from "antd";
import profile from "@/assets/dashboard/profile.png";
import locationIcon from "@/assets/svg/location.svg";
import phone from "@/assets/svg/phone.svg";
import email from "@/assets/svg/email.svg";
import CommonContactInfo from "../../../components/common/CommonContactInfo";
import ActiveCmpsBackBtn from "../../../components/common/ActiveCmpsBackBtn";
import { SlCamera } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { useUpdateAvatar, useUpdateProfile } from "@/hooks/api/useAuth";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import EditProfileModal from "./components/EditProfileModal";
import ProfileSettingsModal from "../../../components/common/ProfileSettingsModal";
import { useLocation, useNavigate } from "react-router-dom";

export default function Profile() {
  const { userData } = useAuth();
  const queryClient = useQueryClient()
  const routerLocation = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const isEvaluator = userData?.role === "evaluator";

  // Note: profile settings update mutation (is_phone_show, is_address_show)
  const updateSettingsMutation = useUpdateProfile({
    onMutate: async (payload) => {
      // Cancel any outgoing refetches to avoid them overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: ["userData"] });

      // Snapshot previous value
      const previousData = queryClient.getQueryData(["userData"]);

      // Optimistically update the cache immediately — no page reload
      const key = payload.get("is_phone_show") !== null ? "is_phone_show" : "is_address_show";
      const boolValue = payload.get(key) === "1";
      queryClient.setQueryData(["userData"], (old) => ({
        ...old,
        [key]: boolValue,
      }));

      return { previousData };
    },
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Settings updated successfully!");
    },
    onError: (error, _payload, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(["userData"], context.previousData);
      }
      const errorMessage = error?.response?.data?.message || "Failed to update settings.";
      toast.error(errorMessage);
    },
  });

  const handleSettingsToggle = (key, value) => {
    // key is 'is_phone_show' or 'is_address_show'
    const payload = new FormData();
    payload.append(key, value ? "1" : "0");
    updateSettingsMutation.mutate(payload);
  };

  useEffect(() => {
    if (!routerLocation.state?.openEditProfile) return;

    setOpen(true);
    navigate(routerLocation.pathname, { replace: true, state: {} });
  }, [navigate, routerLocation.pathname, routerLocation.state]);


  // Note: profile image update mutation
  const changeProfileImageMutation = useUpdateAvatar({
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Profile update successfully!");
      queryClient.invalidateQueries({ queryKey: ["userData"], exact: true })
      // userRefetch();
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || "Profile image change failed. ";
      toast.error(errorMessage);
    },
  });

  const handleFileChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return toast.error("Something went wrong!");

    // Note: validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    };

    // Note: validate file size 5MB limit
    if (!file.size > 5 * 1024 * 1024) {
      toast.error("Image should be less than 5MB");
      return;
    }
    
    changeProfileImageMutation.mutate(file);
  };

  return (
    <section className="w-full mt-2">
      <ActiveCmpsBackBtn label="Profile" />
      <div className="mx-auto space-y-8">
        {/* image and name */}
        <div className="border border-border p-5 rounded-[10px] md:flex items-center gap-5">
          <div className="relative size-48 rounded-full shrink-0">
            <Image
              src={userData?.avatar || profile}
              alt="Profile"
              width={184}
              height={184}
              preview={false}
              className="rounded-full"
            />

            <label
              htmlFor="avatar"
              className="absolute bottom-4 right-3 w-10 h-10 bg-[#00afef7a] backdrop-blur rounded-full flex items-center justify-center cursor-pointer"
            >

              <SlCamera className="text-white text-xl" />

              <input
                type="file"
                name="avatar"
                id="avatar"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={changeProfileImageMutation.isPending}
              />
            </label>
          </div>
          <div>
            <p className="text-[30px] font-medium mb-3">{`${userData?.first_name} ${userData?.last_name}`}</p>
            <button className="text-base font-medium text-primary bg-[#E6F7FD] py-2.5 px-9 rounded-md mb-6">
              {userData?.role?.toUpperCase()}
            </button>
            <CommonContactInfo
              icon={locationIcon}
              label="Location"
              info={userData?.address || "N/A"}
            />
          </div>
        </div>

        {/* edit profile info button */}
        <div className="w-full flex justify-end items-end">
          <div className="flex items-center gap-3">
            {isEvaluator && (
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="cursor-pointer bg-[#00AEEF]/10 text-[#00AEEF] hover:bg-[#00AEEF] hover:text-white rounded-full p-3 transition-all duration-300"
                title="Profile Settings"
              >
                <IoSettingsOutline className="h-6 w-6" />
              </button>
            )}
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer bg-primary py-2 px-5 rounded-md text-white border border-primary hover:bg-transparent hover:text-primary transition-all duration-300"
            >
              Edit Profile Info
            </button>
          </div>
        </div>


        {/* Contact information */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <div className="border border-border p-5 rounded-[10px] space-y-7">
            <h4 className="text-xl font-medium">Contact Information</h4>
            <CommonContactInfo
              icon={email}
              label="Email"
              info={userData?.email || "demo@company.com"}
            />
            <Divider />
            <CommonContactInfo icon={phone} label="Number" info={userData?.phone || "N/F"} />
            <Divider />
            {/* <CommonContactInfo
              icon={book}
              label="Current Conferences"
              info={userData?.conferences || "demo@company.com"}
            /> */}
          </div>
          <div className="border border-border p-5 rounded-[10px] space-y-4">
            <h4 className="text-xl font-medium">Biography</h4>
            <p className="text-[14px] font-normal text-[#666666]">
              {userData?.biography || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* modals */}
      <EditProfileModal
        open={open}
        onClose={() => setOpen(false)}
      />
      <ProfileSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        userData={userData}
        onToggle={handleSettingsToggle}
        isUpdating={updateSettingsMutation.isPending}
      />
    </section>
  );
}
