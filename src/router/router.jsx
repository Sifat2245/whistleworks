import { createBrowserRouter } from "react-router-dom";
import Home from "@/page/home/Home";
import RootLayout from "@/layout/RootLayout";
import DirectorLayout from "@/layout/DirectorLayout";
import Dashboard from "@/page/dashboard/director-dashboard/dashboard/Dashboard";
import EvolatorLayout from "@/layout/EvolatorLayout";
import RefereeLayout from "@/layout/RefereeLayout";
import AuthLayout from "@/layout/AuthLayout";
import SignIn from "@/page/auth/SignIn";
import SignUp from "@/page/auth/SignUp";
import ForgetPassword from "@/page/auth/ForgetPassword";
import VerifyOtp from "@/page/auth/VerifyOtp";
import ResetPassword from "@/page/auth/ResetPassword";
import CreateNewCamp from "@/page/dashboard/director-dashboard/create-new-camp/CreateNewCamp";
import BuildSchedule from "@/page/dashboard/director-dashboard/build-schedule/BuildSchedule";
import CreatedCourt from "@/page/dashboard/director-dashboard/court-list/CreatedCourt";
import Ranking from "@/page/dashboard/director-dashboard/ranking/Ranking";
import Roster from "@/page/dashboard/director-dashboard/roster/Roster";
import Evaluate from "@/page/dashboard/director-dashboard/evaluate/Evaluate";
import ActiveCamps from "@/page/dashboard/RefereeDashboard/ActiveCamps";
import Profile from "@/page/dashboard/profile/Profile";
import PreviousCamps from "@/page/dashboard/RefereeDashboard/PreviousCamps";
import FindCamps from "@/page/dashboard/RefereeDashboard/FindCamps";
import CampDetailsPage from "@/page/dashboard/campDetailsPage/CampDetailsPage";
import EvolatorFindCamp from "@/page/dashboard/EvolatorDashboard/EvolatorFindCamp";
import ActiveEvaluate from "@/page/dashboard/director-dashboard/evaluators/ActiveEvaluate";
import ActiveCrews from "@/page/dashboard/director-dashboard/crews/ActiveCrews";
import AboutUs from "@/page/about-us/AboutUs";
import RoleBasedPrivateRoute from "@/routes/RoleBasedPrivateRoute";
import ResetPasswordOtp from "@/page/auth/ResetPasswordOtp";
import CampOverview from "@/page/dashboard/director-dashboard/camp-overview/CampOverview";
import EditCampPage from "@/page/dashboard/director-dashboard/edit-camp/EditCampPage";
import PaymentSuccess from "@/page/dashboard/RefereeDashboard/PaymentSuccess";
import PaymentCancel from "@/page/dashboard/RefereeDashboard/PaymentCancel";
import MyCamps from "@/page/dashboard/EvolatorDashboard/MyCamp";
import CrewDetailsPage from "@/page/dashboard/director-dashboard/crews/crew-details/CrewDetailsPage";
import MakeAnnouncement from "@/page/dashboard/director-dashboard/make-announcement/MakeAnnouncement";
import AllCamps from "@/page/all-camps/AllCamps";
import CampDetailsPageForNoAuth from "@/page/all-camps/camp-details/CampDetailsPageForNoAuth";
import CampSchedules from "@/page/dashboard/director-dashboard/camp-schedules/CampSchedules";
import PrivacyPolicy from "@/page/privacy-policy/PrivacyPolicy";
import TermsConditions from "@/page/terms-conditions/TermsConditions";
import FAQ from "@/page/faq/FAQ";
import StripeConnectionSuccess from "@/page/dashboard/director-dashboard/strip-connection-success";
import DirectorPreviousCamps from "@/page/dashboard/director-dashboard/previous-camps/PreviousCamps";
import AssignedCamps from "@/page/dashboard/director-dashboard/assigned-camps/AssignedCamps";
import AiDirectorAssistant from "@/page/dashboard/director-dashboard/ai-assistant/AiDirectorAssistant";
import WhatsNew from "@/page/whats-new/WhatsNew";
import NotFound from "@/page/not-found/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "terms-conditions",
        element: <TermsConditions />,
      },
      {
        path: "faq",
        element: <FAQ />,
      },
      {
        path: "whats-new",
        element: <WhatsNew />,
      },
      {
        path: "all-camps",
        element: <AllCamps />,
      },
      {
        path: "all-camps/:id",
        element: <CampDetailsPageForNoAuth />,
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
        path: "previous-camps",
        element: <DirectorPreviousCamps />,
      },
      {
        path: "assigned-camps",
        element: <AssignedCamps />,
      },
      {
        path: "camp-overview/:id",
        element: <CampOverview />,
      },
      {
        path: "edit-camp/:id",
        element: <EditCampPage />,
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
      },
      {
        path: "camp-schedules/:id",
        element: <CampSchedules />,
      },
      {
        path: "ranking/:id",
        element: <Ranking />,
      },
      {
        path: "roster/:id",
        element: <Roster />,
      },
      {
        path: "make-announcement/:id",
        element: <MakeAnnouncement />,
      },
      {
        path: "evaluate/:id",
        element: <Evaluate />,
      },
      {
        path: "active-evaluate/:id",
        element: <ActiveEvaluate />,
      },
      {
        path: "active-crews/:id",
        element: <ActiveCrews />,
      },
      {
        path: "crew-details/:crewId",
        element: <CrewDetailsPage />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "stripe-connection-success",
        element: <StripeConnectionSuccess />,
      },
      {
        path: "ai-assistant",
        element: <AiDirectorAssistant />,
      },
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
        element: <MyCamps />,
      },
      {
        path: "active-camps",
        element: <MyCamps />,
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
        element: <ActiveCamps />,
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
    element: <NotFound />,
  },
]);

export default router;
