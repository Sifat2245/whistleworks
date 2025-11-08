import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import ScreenLoading from "@/components/common/ScreenLoading";

const PrivateRoutes = ({ children }) => {
    const location = useLocation();
    const { userData, isAuthenticated, userRole, isLoading } = useAuth();
    // First check if we're still loading authentication state
    if (isLoading) {
        return <ScreenLoading />;
    }
    // If not loading but not authenticated, redirect to login
    if (!isAuthenticated) {
        return (
            <Navigate
                to="/hype-music/auth/signin"
                state={{ from: location }}
                replace
            />
        );
    }
    // If authenticated but userData is still undefined
    if (userData === undefined) {
        return <ScreenLoading />;
    }
    // Check artist role
    const isArtist = userRole === "artist";
    if (!isArtist) {
        // Redirect to login or some "unauthorized" page for artist
        return (
            <Navigate
                to="/hype-music/auth/signin"
                state={{ from: location }}
                replace
            />
        );
    }
    // Finally, render the protected content for authenticated sellers
    return children;
};

export default PrivateRoutes;