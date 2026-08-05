import { useState } from "react";
import NoticePopup from "@/components/shared/NoticePopup";
import DashboardHeader from "@/components/shared/DashboardHeader";
import DashboardSidebar from "@/components/shared/DashboardSidebar";
import { Outlet } from "react-router-dom";
import NoticeTopbar from "@/components/shared/NoticeTopbar";

const DirectorLayout = () => {
    const [isNoticeOpen, setIsNoticeOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="w-full min-h-screen bg-neutral-50">
            <NoticeTopbar onViewUpdate={() => setIsNoticeOpen(true)} />

            <div className="w-full lg:grid lg:grid-cols-[272px_minmax(0,1fr)]">
                <DashboardSidebar
                    role="director"
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    containedDesktop
                />

                <div className="min-w-0">
                    <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />

                    <main className="w-full">
                        <div className="mx-auto w-full max-w-[1620px] px-4 pt-4 pb-10">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>

            <NoticePopup
                isOpen={isNoticeOpen}
                onClose={() => setIsNoticeOpen(false)}
            />
        </div>
    );
};

export default DirectorLayout;
