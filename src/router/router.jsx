
import { createBrowserRouter } from "react-router-dom";
import Home from "@/page/Home";
import RootLayout from "@/layout/RootLayout";
import DirectorLayout from "@/layout/DirectorLayout";
import Dashboard from "@/page/DirectorDashboard/Dashboard";
import EvolatorLayout from "@/layout/EvolatorLayout";
import EvolatorDashboard from "@/page/EvolatorDashboard/EvolatorDashboard";
import RefereeLayout from "@/layout/RefereeLayout";
import RefereeDashboard from "@/page/RefereeDashboard/RefereeDashboard";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                path: "/",
                element: <Home />
            },
        ]
    },
    {
        path: "/director-dashboard",
        element: <DirectorLayout />,
        children: [
            {
                index: true,
                element: <Dashboard/>
            }
        ]
    },
    {
        path: "evolator-dashboard",
        element: <EvolatorLayout/>,
        children: [
            {
                index: true,
                element: <EvolatorDashboard/>
            }
        ]
    },
    {
        path: "/referee-dashboard",
        element: <RefereeLayout/>,
        children: [
            {
                index: true,
                element: <RefereeDashboard/>
            }
        ]
    },
    {
        path: "*",
        element: () => <h1>Page Not Found</h1>,
    }


]);

export default router;
