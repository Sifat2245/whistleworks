import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import FilterCamps from "@/page/all-camps/components/FilterCamps";

export default function EvolatorFindCamp() {
  return (
    <section className="w-full mt-2">
      <ActiveCmpsBackBtn label="Find Camps" />
      <FilterCamps />
    </section>
  );
}
