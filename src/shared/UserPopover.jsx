import { Link, useNavigate } from "react-router-dom";

const items = [
    { id: "1", label: "Profile", path: '/evolator-dashboard/profile' },
    { id: "2", label: "Privacy", path: '' },
    { id: "3", label: "Setting", path: '' },
    { id: "4", label: "Logout", isAction: true },
];

const UserPopover = () => {
    const navigate = useNavigate();

    const baseClass =
        "w-full text-center py-2 rounded-lg flex items-center justify-center text-[rgba(48,48,48,0.80)]! text-base! font-medium hover:bg-gray-100! hover:font-semibold transition-all! duration-300!";

    // Note: main ui component
    return (
        <div className="w-[170px] flex flex-col items-center gap-2">
            {items.map((item) =>
                item.isAction ? (
                    <button
                        key={item.id}
                        onClick={() => navigate(-1)}
                        className={`${baseClass} cursor-pointer hover:bg-gray-100 text-red-400!`}
                    >
                        {item.label}
                    </button>
                ) : (
                    <Link
                        to={item.path}
                        key={item.id}
                        className={`${baseClass}`}
                    >
                        {item.label}
                    </Link>
                )
            )}
        </div>
    );
};
export default UserPopover;