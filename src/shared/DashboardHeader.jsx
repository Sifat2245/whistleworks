import Logo from "@/components/common/Logo";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import userImage from "@/assets/dashboard/userImage.png"
import UserPopover from "./UserPopover";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "./NotificationBell";

const DashboardHeader = () => {
    const { userData } = useAuth();

    // Note: main ui component
    return (
        <header className="bg-white shadow-md sticky top-0 left-0 w-full z-50">
            <div className="w-full container py-5 flex justify-between items-center">
                {/* Logo */}
                <Link to={"/"} className="flex items-center text-primary">
                    <Logo className={"size-8 sm:size-12 shrink-0"} />
                    <h1 className="text-base sm:text-xl xl:text-2xl font-semibold">WHISTLE WORKS</h1>
                </Link>

                {/* User popover */}
                <div className="flex items-center md:gap-4 gap-1.5">
                    <Popover
                        className="header-popover" placement="bottomRight" trigger={"click"}
                        content={<UserPopover />}
                    >
                        <div className="flex items-center md:gap-4 gap-1.5">
                            <div className="md:size-10 size-7 shrink-0 ring-2  ring-[#E5E4E6] rounded-full cursor-pointer">
                                <img src={userData?.avatar || userImage} alt="" className="w-full h-full object-cover rounded-full" />
                            </div>
                            <p className="text-black font-medium text-base">{userData?.first_name || "Xadu"}</p>
                        </div>
                    </Popover>

                    <NotificationBell />
                </div>
            </div>
        </header>
    );
};
export default DashboardHeader;