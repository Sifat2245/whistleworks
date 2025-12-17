import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const UserPopover = () => {
  const { userData, handleLogout } = useAuth();
  const userRole = userData?.role;
  // Dynamic profile path based on role
  const profilePath =
    {
      director: "/director-dashboard/profile",
      evaluator: "/evaluator-dashboard/profile",
      referee: "/referee-dashboard/profile",
    }[userRole] || "/";

  const dashboardPath =
    {
      director: "/director-dashboard",
      evaluator: "/evaluator-dashboard",
      referee: "/referee-dashboard",
    }[userRole] || "/";

  // Note: menu items
  const items = [
    { id: "1", label: "Dashboard", path: dashboardPath },
    { id: "1", label: "Profile", path: profilePath },
    { id: "2", label: "Privacy", path: "" },
    { id: "3", label: "Setting", path: "" },
    { id: "4", label: "Logout", isAction: true },
  ];

  const baseClass =
    "w-full text-center py-2 rounded-lg flex items-center justify-center text-[rgba(48,48,48,0.80)]! text-base! font-medium hover:bg-gray-100! hover:font-semibold transition-all! duration-300!";

  // Note: main ui component
  return (
    <div className="w-[170px] flex flex-col items-center gap-2">
      {items.map((item) =>
        item.isAction ? (
          <button
            key={item.id}
            onClick={handleLogout}
            className={`${baseClass} cursor-pointer hover:bg-gray-100 text-red-400!`}
          >
            {item.label}
          </button>
        ) : (
          <Link to={item.path} key={item.id} className={`${baseClass}`}>
            {item.label}
          </Link>
        )
      )}
    </div>
  );
};
export default UserPopover;
