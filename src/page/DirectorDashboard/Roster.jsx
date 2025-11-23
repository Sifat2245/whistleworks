import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import RosterTable from "@/components/dashboard/director_dashboard/Roster/RosterTable";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";

const Roster = () => {
  const [active, setActive] = useState("Evaluator"); // default active

  const btnClasses = (name) =>
    `px-4 py-2 cursor-pointer rounded-md ${
      active === name ? "bg-[#00AEEF] text-white" : "bg-transparent text-black"
    }`;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <BackBtn />

        <div className="bg-[#E8E8E8] p-2 flex gap-2">
          <button
            className={btnClasses("Evaluator")}
            onClick={() => setActive("Evaluator")}
          >
            Evaluator
          </button>
          <button
            className={btnClasses("Referees")}
            onClick={() => setActive("Referees")}
          >
            Referees
          </button>
          <button
            className={btnClasses("Crews")}
            onClick={() => setActive("Crews")}
          >
            Crews
          </button>
        </div>

        {/* announcement btn */}
        <CommonSubmitBtn type="button" variant="primary">
          Announcement
        </CommonSubmitBtn>
      </div>
      <div className="flex justify-between items-center mb-6">
        <CommonSectionTitle
          text="Roster - Elite Officials Summer Cam 2024"
          subText="View and manage referee roster for this camp"
        />
        <button className="bg-transparent text-primary border border-primary transition px-4 py-3 rounded-lg">
          5 Total Referees
        </button>
      </div>

      <div className="w-full relative">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />

        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 p-3 border bg-neutral-100 border-gray-300 rounded-lg outline-none focus:border-[#00AEEF]"
        />
      </div>

      <div className="mt-8">
        <RosterTable />
      </div>
    </div>
  );
};

export default Roster;
