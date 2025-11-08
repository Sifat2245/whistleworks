import { LuMoveLeft } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

const BackBtn = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex gap-4 items-center">
      <button type="button" className=" sm:w-10 w-8 sm:h-10 h-8 rounded-full flex justify-center items-center bg-[#E6ECF0] p-[10px] cursor-pointer" onClick={() => navigate(-1)}>
        <LuMoveLeft className="text-xl" />
      </button>
      <p className="text-[#6B6B6B]">Back</p>
    </div>
  );
};

export default BackBtn;
