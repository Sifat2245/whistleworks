import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ScreenLoading from "@/components/common/ScreenLoading";

const RefereePrivateRoute = ({ children }) => {
  const location = useLocation();
  const { userData, accessToken, isLoading } = useAuth();
  // First check if we're still loading authentication state
  if (isLoading) {
    return <ScreenLoading />;
  }
  // If not loading but not authenticated, redirect to login
  if (!accessToken) {
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }

  // If authenticated but userData is still undefined
  if (userData === undefined) {
    return <ScreenLoading />;
  }

  // Note: check director role
  const isReferee = userData?.role === "referee";
  if (!isReferee) {
    // Redirect to login or some "unauthorized" page
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }
  // Check if company profile is complete
  // const isProfileComplete = userData?.company_profile_complete;
  // if (!isProfileComplete) {
  //   // Redirect to company setup page
  //   return (
  //     <Navigate
  //       to="/company-account/setup"
  //       state={{ from: location }}
  //       replace
  //     />
  //   );
  // }
  // Finally, render the protected content for authenticated companies with complete profiles
  return children;
};

export default RefereePrivateRoute;