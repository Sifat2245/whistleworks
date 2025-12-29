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
import RankingReport from "@/page/DirectorDashboard/RankingReport";
import Profile from "@/components/common/Profile";
import PreviousCamps from "@/page/RefereeDashboard/PreviousCamps";
import FindCamps from "@/page/RefereeDashboard/FindCamps";
import CampDetailsPage from "@/page/RefereeDashboard/CampDetailsPage";
import EvolatorFindCamp from "@/page/EvolatorDashboard/EvolatorFindCamp";
import ActiveEvaluate from "@/page/DirectorDashboard/ActiveEvaluate";
import ActiveCrews from "@/page/DirectorDashboard/ActiveCrews";
import AboutUs from "@/page/AboutUs";
import RoleBasedPrivateRoute from "@/routes/RoleBasedPrivateRoute";
import ResetPasswordOtp from "@/page/auth/ResetPasswordOtp";
import CampOverview from "@/page/DirectorDashboard/CampOverview";
import axiosSecureInstance from "@/hooks/axiosInstace";
import EditCampPage from "@/page/DirectorDashboard/EditCampPage";
import PaymentSuccess from "@/page/RefereeDashboard/PaymentSuccess";
import PaymentCancel from "@/page/RefereeDashboard/PaymentCancel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
    ],
  },
  //
  {
    path: "/director-dashboard",
    element: (
      <RoleBasedPrivateRoute allowedRoles={["director"]}>
        <DirectorLayout />
      </RoleBasedPrivateRoute>
    ),
    children: [
      {
        index: true,
        path: "/director-dashboard",
        element: <Dashboard />,
      },
      {
        path: "camp-overview/:id",
        element: <CampOverview />,
        loader: async ({ params }) =>
          await axiosSecureInstance.get(`/v1/camp/details/${params.id}`),
      },
      {
        path: "edit-camp/:id",
        element: <EditCampPage />,
        loader: async ({ params }) =>
          await axiosSecureInstance.get(`/v1/camp/details/${params.id}`),
      },
      {
        path: "create-new-camp",
        element: <CreateNewCamp />,
      },
      {
        path: "build-schedule/:id",
        element: <BuildSchedule />,
      },
      {
        path: "court-list/:id",
        element: <CreatedCourt />,
        loader: async ({ params }) => {
          const response = await axiosSecureInstance.get(
            `/v1/camp/details/${params.id}`
          );
          return response;
        },
      },
      {
        path: "ranking",
        element: <Ranking />,
      },
      {
        path: "ranking/:id",
        element: <RankingReport />,
      },
      {
        path: "roster/:id",
        element: <Roster />,
      },
      {
        path: "evaluate/:id",
        element: <Evaluate />,
      },
      {
        path: "active-evaluate",
        element: <ActiveEvaluate />,
      },
      {
        path: "active-crews/:id",
        element: <ActiveCrews />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      // {
      //   path: "profile/:id",
      //   element: <EditProfile />
      // }
    ],
  },

  {
    path: "/evaluator-dashboard",
    element: (
      <RoleBasedPrivateRoute allowedRoles={["evaluator"]}>
        <EvolatorLayout />
      </RoleBasedPrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <EvolatorDashboard />,
      },
      {
        path: "active-camps",
        element: <ActiveCamps />,
      },
      {
        path: "camp/:id",
        element: <CampDetailsPage />,
        loader: async ({ params }) =>
          await axiosSecureInstance.get(`/v1/camp/details/${params.id}`),
      },
      {
        path: "previous-camps",
        element: <PreviousCamps />,
      },
      {
        path: "find-camps",
        element: <EvolatorFindCamp />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/referee-dashboard",
    element: (
      <RoleBasedPrivateRoute allowedRoles={["referee"]}>
        <RefereeLayout />
      </RoleBasedPrivateRoute>
    ),
    children: [
      {
        index: true,
        path: "",
        element: <RefereeDashboard />,
      },
      {
        path: "active-camps",
        element: <ActiveCamps />,
      },
      {
        path: "camp/:id",
        element: <CampDetailsPage />,
        loader: async ({ params }) =>
          await axiosSecureInstance.get(`/v1/camp/details/${params.id}`),
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
        path: "payment-success",
        element: <PaymentSuccess />,
      },
      {
        path: "payment-cancel",
        element: <PaymentCancel />,
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
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "forget-password",
        element: <ForgetPassword />,
      },
      {
        path: "reset-password-otp",
        element: <ResetPasswordOtp />,
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
