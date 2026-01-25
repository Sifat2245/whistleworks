import DashboardHeader from "@/shared/DashboardHeader";
import { Outlet } from "react-router-dom";

const DirectorLayout = () => {
    return (
        <div className="w-full">
            <DashboardHeader />
            <main className="w-full container pt-10">
                <Outlet />
            </main>
        </div>
    );
};
export default DirectorLayout;