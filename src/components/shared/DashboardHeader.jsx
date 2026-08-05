import Logo from "@/components/common/Logo";
import { Popover } from "antd";
import { Link } from "react-router-dom";
import userImage from "@/assets/dashboard/userImage.png"
import UserPopover from "./UserPopover";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "./NotificationBell";
import { FiMenu } from "react-icons/fi";

const roleConfig = {
    director: { label: "Director", badge: "bg-purple-100 text-purple-700" },
    evaluator: { label: "Evaluator", badge: "bg-blue-100 text-blue-700" },
    referee: { label: "Referee", badge: "bg-emerald-100 text-emerald-700" },
};

const DashboardHeader = ({ onOpenSidebar }) => {
    const { userData } = useAuth();
    const userRole = userData?.role;
    const role = roleConfig[userRole];

    // Note: main ui component
    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40 w-full">
            <div className="mx-auto flex h-[72px] w-full max-w-[1620px] items-center justify-between gap-3 px-4">
                    {/* Left: hamburger + logo + welcome text */}
                    <div className="flex items-center gap-3 min-w-0">
                        {onOpenSidebar && (
                            <button
                                type="button"
                                onClick={onOpenSidebar}
                                aria-label="Open menu"
                                className="flex size-10 shrink-0 items-center justify-center rounded-full text-gray-600 transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 active:scale-95 lg:hidden"
                            >
                                <FiMenu className="text-[22px]" />
                            </button>
                        )}

                        {/* Logo (hidden on desktop when the sidebar shows its own) */}
                        <Link
                            to={"/"}
                            className={`flex items-center text-primary ${onOpenSidebar ? "lg:hidden" : ""}`}
                        >
                            <Logo className={"size-8 sm:size-10 shrink-0"} />
                            <h1 className="text-base sm:text-xl xl:text-2xl font-semibold">
                                WHISTLE WORKS
                            </h1>
                        </Link>

                        {/* Welcome text (desktop only) */}
                        <div className="hidden lg:flex flex-col items-start pl-4 ml-1 border-l border-gray-200 select-none">
                            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                                Welcome back
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-800 truncate max-w-[160px]">
                                    {userData?.first_name || "there"}
                                </p>
                                {role && (
                                    <span className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${role.badge}`}>
                                        {role.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: user + notifications */}
                    <div className="flex items-center md:gap-4 gap-1.5">
                        <Popover
                            className="header-popover" placement="bottomRight" trigger={"click"}
                            content={<UserPopover />}
                        >
                            <div className="flex items-center md:gap-4 gap-1.5">
                                <div className="md:size-10 size-7 shrink-0 ring-2  ring-[#E5E4E6] rounded-full cursor-pointer">
                                    <img src={userData?.avatar || userImage} alt="" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <p className="text-black font-medium text-base hidden sm:block">{userData?.first_name || "Xadu"}</p>
                            </div>
                        </Popover>

                        <NotificationBell />
                    </div>
            </div>
        </header>
    );
};
export default DashboardHeader;