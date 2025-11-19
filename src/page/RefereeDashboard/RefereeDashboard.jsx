import DashboardButton from "@/components/dashboard/director_dashboard/refereeDashboard/DashboardButton";
import { Image } from "antd";

const RefereeDashboard = () => {
  return (
    <section className="max-w-md mx-auto w-full px-4 min-h-screen flex justify-center flex-col ">
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
          label="Active Camps"
          iconSrc="/referee/home-icon.svg"
          onClick={() => {
            console.log("Active Camps clicked");
          }}
        />
        <DashboardButton
          label="Previous Camps"
          iconSrc="/referee/calender-icon.svg"
          onClick={() => {
            console.log("Previous Camps clicked");
          }}
        />
        <DashboardButton
          label="Find Camps"
          iconSrc="/referee/group-user-icon.svg"
          onClick={() => {
            console.log("Find Camps clicked");
          }}
        />
        <DashboardButton
          label="Profile"
          iconSrc="/referee/single-user-icon.svg"
          onClick={() => {
            console.log("Profile clicked");
          }}
        />
      </div>
    </section>
  );
};

export default RefereeDashboard;
