import { LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const BackBtn = () => {
  const navigate = useNavigate();
  return (
    <div className="w-fit flex gap-4 items-center border border-[#E8E8E8] rounded-lg mb-4">
      <button type="button" className="sm:w-10 w-8 sm:h-10 h-8 rounded-full flex justify-center items-center p-2.5 cursor-pointer"  onClick={() => navigate(-1)}>
        <LuMoveLeft className="text-xl" />
      </button>
    </div>
  );
};
export default BackBtn;