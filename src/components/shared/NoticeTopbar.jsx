import { IoMegaphoneOutline } from "react-icons/io5";
import { FiArrowRight } from "react-icons/fi";

const NoticeTopbar = ({ onViewUpdate }) => {
  return (
    <div className="w-full bg-gradient-to-r from-[#0096D6] via-[#00AEEF] to-[#33C6F4] text-white">
      <div className="container flex items-center justify-center py-2.5 px-4">
        <div className="flex flex-wrap items-center justify-center gap-2 text-center">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/15">
            <IoMegaphoneOutline className="h-4 w-4" />
          </span>

          <p className="text-sm">
            <span className="font-semibold">New Update:</span> Get paid directly
            with Stripe.
          </p>

          <button
            type="button"
            onClick={onViewUpdate}
            className="group inline-flex items-center gap-1 text-sm font-medium underline underline-offset-4 decoration-white/70 hover:decoration-white transition-colors cursor-pointer"
          >
            Learn More
            <FiArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeTopbar;
