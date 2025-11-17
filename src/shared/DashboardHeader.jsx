import Logo from "@/components/common/Logo";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import userImage from "@/assets/dashboard/userImage.png"
import { IoNotificationsOutline } from "react-icons/io5";
import UserPopover from "./UserPopover";

const DashboardHeader = () => {
    return (
        <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
            <div className="w-full container py-5 flex justify-between items-center">
                {/* Logo */}
                <Link to={"/"} className="flex items-center text-primary">
                    <Logo className={"h-9 w-14"} />
                    <h1 className="text-2xl font-semibold">WHISTLE WORKS</h1>
                </Link>

                {/* User popover */}
                <div className="flex items-center gap-4">
                    <Popover
                        className="header-popover" placement="bottomRight" trigger={"click"}
                        content={<UserPopover />}
                    >
                        <div className="flex items-center gap-4">
                            <div className="size-10 shrink-0 ring-2  ring-[#E5E4E6] rounded-full cursor-pointer">
                                <img src={userImage} alt="" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <p className="text-black font-medium text-base">{name || "Xadu"}</p>
                        </div>
                    </Popover>

                    <button className="cursor-pointer">
                        <IoNotificationsOutline className="text-xl" />
                    </button>
                </div>
            </div>
        </header>
    );
};
export default DashboardHeader;