import { Divider, Image } from "antd";
import profile from "@/assets/dashboard/profile.png";
import location from "@/assets/svg/location.svg";
import phone from "@/assets/svg/phone.svg";
import email from "@/assets/svg/email.svg";
import CommonContactInfo from "./CommonContactInfo";
import book from "@/assets/svg/book.svg";
import ActiveCmpsBackBtn from "./ActiveCmpsBackBtn";
import { SlCamera } from "react-icons/sl";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Profile() {
  const axiosInstance = useAxiosSecure();
  const [avatarFile, setAvatarFile] = useState(null);
  const { userData } = useAuth();

  // Note: profile image update mutation
  const updateProfileAvatar = useMutation({
    mutationKey: ["update-avatar"],
    mutationFn: async (formData) => {
      const response = await axiosInstance.post(`/update-avatar`, formData, {
        headers: {
          "Content-Type": "mulitpart/form-data"
        }
      })
      return response?.data
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Profile update successfully!")
      console.log("first")
    },
    onError: (err) => {
      console.log("first");
      toast.error(err?.response?.data?.message || "Something went wrong!");
    }
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const formData = new FormData();
      formData.append("avatar", file);
      updateProfileAvatar.mutate(formData);
    }
  };

  // Note: main ui component
  return (
    <section className="container w-full px-4 mx-auto mt-10 mb-18">
      <ActiveCmpsBackBtn label="Profile" />
      <div className=" mx-auto space-y-8">
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
                onSubmit={handleFileChange}
              />
            </label>
          </div>
          <div>
            <p className="text-[30px] font-medium mb-3">John Anderson</p>
            <button className="text-base font-medium text-primary bg-[#E6F7FD] py-2.5 px-9 rounded-md mb-6">
              {userData?.role?.toUpperCase()}
            </button>
            <CommonContactInfo
              icon={location}
              label="Location"
              info={userData?.address || "N/A"}
            />
          </div>
        </div>
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
            <CommonContactInfo
              icon={book}
              label="Current Conferences"
              info={userData?.conferences || "demo@company.com"}
            />
          </div>
          <div className="border border-border p-5 rounded-[10px] space-y-4">
            <h4 className="text-xl font-medium">Biography</h4>
            <p className="text-[14px] font-normal text-[#666666]">
              {userData?.biography || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}