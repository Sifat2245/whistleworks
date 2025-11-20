import DashboardHeader from "@/shared/DashboardHeader";
import { Outlet } from "react-router-dom";

const RefereeLayout = () => {
  const pathname = window.location.pathname;
  console.log("Current Pathname:", pathname);
  return (
    <div className="w-full">
      <div >
        <DashboardHeader />
      </div>
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default RefereeLayout;