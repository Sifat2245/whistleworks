import NoticePopup from "@/components/shared/NoticePopup";
import DashboardHeader from "@/components/shared/DashboardHeader";
import { Outlet } from "react-router-dom";

const EvolatorLayout = () => {
  return (
    <div className="w-full">
      <DashboardHeader />
      <main className="w-full">
        <Outlet />
      </main>
      <NoticePopup />
    </div>
  );
};

export default EvolatorLayout;
