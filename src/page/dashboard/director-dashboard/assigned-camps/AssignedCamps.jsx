import BackBtn from "@/components/common/BackBtn";
import CommonSectionTitle from "@/components/common/CommonSectionTitle";
import MyCampCartSkeleton from "@/page/dashboard/director-dashboard/dashboard/components/MyCampCartSkeleton";
import AssignedCampCard from "./components/AssignedCampCard";
import { useGetAssignedCamps } from "@/hooks/api/director-hooks/useCamps";
import { LuShieldCheck, LuInbox } from "react-icons/lu";

const AssignedCamps = () => {
  const page = 1;
  const { data, isLoading } = useGetAssignedCamps(page);

  const camps = data?.camp_list || [];

  return (
    <div className="w-full pb-12">
      <BackBtn />

      {/* Header */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <CommonSectionTitle
          text="My Assigned Camps"
          subText="Camps where another director assigned you as an assistant"
        />
        {!isLoading && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-violet-50 px-3.5 py-1.5 text-xs font-semibold text-violet-700 border border-violet-200">
            <LuShieldCheck className="text-sm" />
            {camps.length} assigned camp{camps.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="mt-6 space-y-5">
          {[...Array(2)].map((_, index) => (
            <MyCampCartSkeleton key={index} />
          ))}
        </div>
      ) : camps.length === 0 ? (
        <div className="mt-6 rounded-xl border border-[#E8E8E8] bg-white py-16 text-center">
          <LuInbox className="mx-auto mb-3 h-12 w-12 text-gray-300" />
          <h3 className="text-lg font-semibold text-[#333]">
            No Assigned Camps
          </h3>
          <p className="mt-1 text-sm text-[#666]">
            When a director assigns you as an assistant, the camp will appear
            here.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5">
          {camps.map((camp) => (
            <AssignedCampCard key={camp.camp_id} camp={camp} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedCamps;
