import { LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const BackBtn = () => {
  const navigate = useNavigate();

  return (
    <div className="mb-4">
      <button
        type="button"
        onClick={() => navigate('/director-dashboard')}
        className="group flex items-center gap-2 border border-border rounded-lg px-3 py-2 cursor-pointer overflow-hidden"
      >
        <LuMoveLeft className="text-xl transition-transform duration-300 group-hover:-translate-x-1" />

        <span className="max-w-0 opacity-0 overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out group-hover:max-w-[180px] group-hover:opacity-100">
          Back to dashboard
        </span>
      </button>
    </div>
  );
};

export default BackBtn;