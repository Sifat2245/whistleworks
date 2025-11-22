import { createBrowserRouter } from "react-router-dom";
import Home from "@/page/Home";
import RootLayout from "@/layout/RootLayout";
import DirectorLayout from "@/layout/DirectorLayout";
import Dashboard from "@/page/DirectorDashboard/Dashboard";
import EvolatorLayout from "@/layout/EvolatorLayout";
import EvolatorDashboard from "@/page/EvolatorDashboard/EvolatorDashboard";
import RefereeLayout from "@/layout/RefereeLayout";
import RefereeDashboard from "@/page/RefereeDashboard/RefereeDashboard";
import AuthLayout from "@/layout/AuthLayout";
import SignIn from "@/page/auth/SignIn";
import SignUp from "@/page/auth/SignUp";
import ForgetPassword from "@/page/auth/ForgetPassword";
import VerifyOtp from "@/page/auth/VerifyOtp";
import ResetPassword from "@/page/auth/ResetPassword";
import CreateNewCamp from "@/page/DirectorDashboard/CreateNewCamp";
import BuildSchedule from "@/page/DirectorDashboard/BuildSchedule";
import CreatedCourt from "@/page/DirectorDashboard/CreatedCourt";
import Ranking from "@/page/DirectorDashboard/Ranking";
import Roster from "@/page/DirectorDashboard/Roster";
import Evaluate from "@/page/DirectorDashboard/Evaluate";
import ActiveCamps from "@/page/RefereeDashboard/ActiveCamps";
import Profile from "@/components/common/Profile";
import PreviousCamps from "@/page/RefereeDashboard/PreviousCamps";
import FindCamps from "@/page/RefereeDashboard/FindCamps";
import CampDetailsPage from "@/page/RefereeDashboard/CampDetailsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
    ],
  },
  {
    path: "/director-dashboard",
    element: <DirectorLayout />,
    children: [
      {
        index: true,
        path: "/director-dashboard",
        element: <Dashboard />,
      },
      {
        path: "create-new-camp",
        element: <CreateNewCamp />,
      },
      {
        path: "build-schedule",
        element: <BuildSchedule />,
      },
      {
        path: "court-list",
        element: <CreatedCourt />,
      },
      {
        path: "ranking",
        element: <Ranking />,
      },
      {
        path: "Roster",
        element: <Roster />,
      },
      {
        path: "Evaluate",
        element: <Evaluate />,
      },
    ],
  },
  {
    path: "evolator-dashboard",
    element: <EvolatorLayout />,
    children: [
      {
        index: true,
        element: <EvolatorDashboard />,
      },
    ],
  },
  {
    path: "/referee-dashboard",
    element: <RefereeLayout />,
    children: [
      {
        index: true,
        element: <RefereeDashboard />,
      },
      {
        path: "active-camps",
        element: <ActiveCamps />,
      },
      {
        path: "camp/:id",
        element: <CampDetailsPage />,
      },
      {
        path: "previous-camps",
        element: <PreviousCamps />,
      },
      {
        path: "find-camps",
        element: <FindCamps />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "signin",
        element: <SignIn />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },
 
  {
    path: "*",
    element: () => <h1>Page Not Found</h1>,
  },
]);

export default router;
