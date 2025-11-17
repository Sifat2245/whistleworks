import DirectorHome from "@/components/dashboard/director_dashboard/DirectorHome";
import DashboardHeader from "@/shared/DashboardHeader";

const Dashboard = () => {
    return (
        <div className="w-full">
            <DashboardHeader />
            <DirectorHome/>
        </div>
    );
};

export default Dashboard;