import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ScreenLoading from "@/components/common/ScreenLoading";

const EvaluatorPrivateRoute = ({ children }) => {
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
  const isEvaluator = userData?.role === "evaluator";
  if (!isEvaluator) {
    // Redirect to login or some "unauthorized" page
    return (
      <Navigate
        to="/"
        state={{ from: location }}
        replace
      />
    );
  }
  return children;
};

export default EvaluatorPrivateRoute;