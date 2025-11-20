import { useNavigate } from "react-router-dom";
import { LuMoveLeft } from "react-icons/lu";

export default function ActiveCmpsBackBtn({ label }) {
  const navigate = useNavigate();
  return (
    <div className="w-fit flex gap-4 items-center rounded-lg mb-5">
      <button
        type="button"
        className=" rounded-full flex justify-center items-center p-2.5 cursor-pointer gap-3.5"
        onClick={() => navigate(-1)}
      >
        <LuMoveLeft className="text-xl text-black" />
        <p className="text-xl">{label}</p>
      </button>
    </div>
  );
}
