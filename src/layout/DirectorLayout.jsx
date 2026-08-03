import { useState } from "react";
import NoticePopup from "@/components/shared/NoticePopup";
import NoticeTopbar from "@/components/shared/NoticeTopbar";
import DashboardHeader from "@/components/shared/DashboardHeader";
import { Outlet } from "react-router-dom";

const DirectorLayout = () => {
    const [isNoticeOpen, setIsNoticeOpen] = useState(false);

    return (
        <div className="w-full relative">
            {/* <NoticeTopbar onViewUpdate={() => setIsNoticeOpen(true)} /> */}
            <DashboardHeader />
            <main className="w-full container pt-10">
                <Outlet />
            </main>
            <NoticePopup
                isOpen={isNoticeOpen}
                onClose={() => setIsNoticeOpen(false)}
            />
        </div>
    );
};

export default DirectorLayout;