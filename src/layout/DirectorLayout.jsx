import NoticePopup from "@/components/shared/NoticePopup";
import DashboardHeader from "@/components/shared/DashboardHeader";
import { Outlet } from "react-router-dom";

const DirectorLayout = () => {
    return (
        <div className="w-full relative">
            <DashboardHeader />
            <main className="w-full container pt-10">
                <Outlet />
            </main>
            <NoticePopup />
        </div>
    );
};

export default DirectorLayout;