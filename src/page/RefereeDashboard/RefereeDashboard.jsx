import DashboardButton from "@/components/dashboard/refereeDashboard/DashboardButton";
import { Image } from "antd";

const RefereeDashboard = () => {
  return (
    <section className="max-w-md mx-auto w-full px-4 flex justify-center flex-col ">
      {/* header div  */}
      <div className="mx-auto w-fit space-y-3.5">
        <Image
          src="/dashboard-logo.svg"
          alt="Referee Dashboard"
          preview={false}
        />
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-normal">Referee Dashboard</h2>
          <p className="text-base">Welcome back, Referee</p>
        </div>
      </div>
      {/* button div */}
      <div className="mt-8 space-y-6">
        <DashboardButton
          label="My Camps"
          iconSrc="/referee/home-icon.svg"
          path="/referee-dashboard/active-camps"
        />
        <DashboardButton
          label="Previous Camps"
          iconSrc="/referee/calender-icon.svg"
          path="/referee-dashboard/previous-camps"
        />
        <DashboardButton
          label="Find Camps"
          iconSrc="/referee/group-user-icon.svg"
          path="/referee-dashboard/find-camps"
        />
        <DashboardButton
          label="Profile"
          iconSrc="/referee/single-user-icon.svg"
          path="/referee-dashboard/profile"
        />
      </div>
    </section>
  );
};

export default RefereeDashboard;
