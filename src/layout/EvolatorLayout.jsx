import DashboardHeader from "@/shared/DashboardHeader";
import { Outlet } from "react-router-dom";

const EvolatorLayout = () => {
  return (
    <div className="w-full">
      <DashboardHeader />
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default EvolatorLayout;