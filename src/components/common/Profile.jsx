import { Image } from "antd";
import ActiveCmpsBackBtn from "./ActiveCmpsBackBtn";
import profile from "@/assets/dashboard/profile.png";
import { Divider } from 'antd';
import location from "@/assets/svg/location.svg";
import phone from "@/assets/svg/phone.svg";
import email from "@/assets/svg/email.svg";
import CommonContactInfo from "./CommonContactInfo";


export default function Profile() {
  return (
    <section className="container w-full px-4 mx-auto mt-5 mb-18">
        <ActiveCmpsBackBtn label="Profile" />
        <div className="max-w-xl mx-auto space-y-5">
            <div className="border border-border p-5 rounded-[10px] flex flex-col items-center">
                <Image
                  src={profile}
                  alt="Profile"
                  width={266}
                  height={261}
                  preview={false}
                  className="rounded-full"
                />
                <p className="text-[30px] font-medium mt-5 mb-3">John Anderson</p>
                <p className="text-xl font-normal text-[#666666]">Professional Referee</p>
                <Divider />
                <div className="flex items-center justify-between w-full">
                    <div className="text-center">
                        <p className="text-[#666666]">Camps</p>
                        <p className="text-2xl mt-4">12</p>
                    </div>
                    <div className="text-center">
                         <p className="text-[#666666]">Camps</p>
                        <p className="text-2xl mt-4">12</p>
                    </div>
                    <div className="text-center">
                         <p className="text-[#666666]">Rating</p>
                        <p className="text-2xl mt-4">4.9</p>
                    </div>
                </div>
            </div>
            <div className="border border-border p-5 rounded-[10px] space-y-7">
                <h4 className="text-xl font-medium">Contact Information</h4>
                <CommonContactInfo icon={location} label="Location" info="Los Angeles, CA" />
                <CommonContactInfo icon={email} label="Email" info="john.anderson@example.com" />
                <CommonContactInfo icon={phone} label="Phone" info="+1 234 567 890" />
            </div>
            <div className="border border-border p-5 rounded-[10px] space-y-7">
                <h4 className="text-xl font-medium">Conferences/Biography</h4>
                <CommonContactInfo icon={location} label="Location" info="Los Angeles, CA" />
                <CommonContactInfo icon={email} label="Email" info="john.anderson@example.com" />
                <CommonContactInfo icon={phone} label="Phone" info="+1 234 567 890" />
            </div>
        </div>
    </section>
  )
}
