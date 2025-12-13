import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ScreenLoading from "@/components/common/ScreenLoading";

const RoleBasedPrivateRoute = ({ children, allowedRoles = [] }) => {
    const location = useLocation();
    const { userData, accessToken, isLoading } = useAuth();

    // Step 1: still loading state
    if (isLoading) {
        return <ScreenLoading />;
    }

    // Step 2: not logged in → go login
    if (!accessToken) {
        return (
            <Navigate
                to="/"
                state={{ from: location }}
                replace
            />
        );
    }

    // Step 3: user exists but userdata not loaded yet
    if (!userData) {
        return <ScreenLoading />;
    }

    // Step 4: role check
    const userRole = userData.role;

    if (!allowedRoles.includes(userRole)) {
        // Note: More cleaner and simpler code
        if (!allowedRoles.includes(userRole)) {
            const redirectMap = {
                director: "/director-dashboard",
                evaluator: "/evaluator-dashboard",
                referee: "/referee-dashboard",
            };

            return (
                <Navigate
                    to={redirectMap[userRole] || "/"}
                    replace
                />
            );
        }

        
        // Unauthorized → redirect to role dashboard automatically
        // let redirectPath = "/";

        // if (userRole === "director") redirectPath = "/director-dashboard";
        // if (userRole === "evaluator") redirectPath = "/evaluator-dashboard";
        // if (userRole === "referee") redirectPath = "/referee-dashboard";

        // return <Navigate to={redirectPath} replace />;
    }

    return children;
};

export default RoleBasedPrivateRoute;