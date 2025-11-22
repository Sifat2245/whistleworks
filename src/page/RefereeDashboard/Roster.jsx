import Icon from "@/components/common/Icon";
import RosterTabs from "@/components/dashboard/refereeDashboard/roster/RosterTabs";
import singleUser from "/referee/single-user-icon.svg";

export default function Roster() {
  return (
    <section>
      <div className="flex justify-end mb-5">
        <RosterTabs />
      </div>
      <div className="border border-border rounded-xl p-5">
        <div className="flex items-center justify-between border border-border p-5 rounded-[10px]">
            <div>
                <h3 className="text-xl font-medium mb-2.5">Camp Roster</h3>
                <p className="text-[#666666]">5 Referees</p>
            </div>
            <div className="bg-primary p-3.5 rounded-full">
                <Icon src={singleUser} className="size-5 text-white" />
            </div>
        </div>
      </div>
    </section>
  );
}
