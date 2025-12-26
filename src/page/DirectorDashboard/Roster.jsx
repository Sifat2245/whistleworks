import BackBtn from "@/components/common/BackBtn";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import CommonSectionTitle from "@/components/dashboard/director_dashboard/CommonSectionTitle";
import RosterTable from "@/components/dashboard/director_dashboard/Roster/RosterTable";
import { useState } from "react";
import { FiSearch } from "react-icons/fi";
import ActiveEvaluate from "./ActiveEvaluate";
import { useNavigate, useParams } from "react-router-dom";
import ActiveCrews from "./ActiveCrews";
import { ImCross } from "react-icons/im";
import { RxDropdownMenu } from "react-icons/rx";


const Roster = () => {
  // eslint-disable-next-line no-unused-vars
  const [active, setActive] = useState("active-evaluate");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const navigate = useNavigate();
  const {id} = useParams()

  // console.log(id,"camp id");

  const btnClasses = (isActive = false) =>
    `px-3 py-2 sm:px-4 sm:py-2 cursor-pointer rounded-md hover:bg-primary hover:text-white transition-all duration-300 text-sm sm:text-base ${
      isActive ? "bg-primary text-white" : "bg-transparent"
    }`;

  // Note: main ui component
  return (
    <div className="w-full">
      {/* Header Section - Stack on mobile */}
      <div className="flex flex-col md:flex-row lg:justify-between lg:items-center gap-4 mb-4">
        {/* Back button and Mobile Menu Toggle */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <BackBtn />
          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden "
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            aria-label="Toggle menu"
          >
            {showMobileMenu ? <ImCross className="text-lg" /> : <RxDropdownMenu className="text-3xl" />}
          </button>
        </div>

        {/* Navigation Tabs - Hide on mobile, show in dropdown or horizontal on larger screens */}
        <div className={`${showMobileMenu ? "block" : "hidden"} lg:block w-full lg:w-auto`}>
          <div className="w-full bg-border p-2 flex  items-center justify-center sm:flex-row gap-2 sm:gap-3">
            {/* Evaluator button */}
            <button
              className={btnClasses(active === "active-evaluate")}
              onClick={() => {
                navigate("/director-dashboard/active-evaluate");
                setShowMobileMenu(false);
              }}
            >
              Evaluator
            </button>

            {/* Referees button */}
            <button
              className={btnClasses(active === "Referees")}
              onClick={() => {
                navigate("/director-dashboard/roster");
                setShowMobileMenu(false);
              }}
            >
              Referees
            </button>

            <button
              className={btnClasses(active === "Crews")}
              onClick={() => {
                navigate("/director-dashboard/active-crews");
                setShowMobileMenu(false);
              }}
            >
              Crews
            </button>
          </div>
        </div>

        {/* Announcement Button - Full width on mobile */}
        <div className="w-full lg:w-auto">
          <CommonSubmitBtn 
            type="button" 
            variant="primary"
            className="w-full lg:w-auto justify-center"
          >
            Announcement
          </CommonSubmitBtn>
        </div>
      </div>

      {/* Title and Total Referees Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="w-full sm:w-auto">
          <CommonSectionTitle
            text="Roster - Elite Officials Summer Cam 2024"
            subText="View and manage referee roster for this camp"
          />
        </div>
        
        <button className="bg-transparent text-primary border border-primary transition px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base whitespace-nowrap w-full sm:w-auto">
          5 Total Referees
        </button>
      </div>

      {/* Search Bar */}
      <div className="w-full relative mb-6 sm:mb-8">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-lg sm:text-xl z-10" />
        <input
          type="text"
          placeholder="Search referees..."
          className="w-full pl-10 pr-4 py-2.5 sm:py-3 border bg-neutral-100 border-gray-300 rounded-lg outline-none focus:border-[#00AEEF] focus:ring-2 focus:ring-[#00AEEF]/20 text-sm sm:text-base"
        />
      </div>

      {/* Main Content Area */}
      <div className="mt-6 sm:mt-8">
        {active === "active-evaluate" && <RosterTable category="active-evaluate" />}
        {active === "Evaluator" && <ActiveEvaluate />}
        {active === "Referees" && <RosterTable category="referees" />}
        {active === "Crews" && <ActiveCrews campId={id} />}
      </div>
    </div>
  );
};
export default Roster;