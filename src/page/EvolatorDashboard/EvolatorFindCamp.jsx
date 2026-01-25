import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import FilterCamps from "@/shared/FilterCamps";

export default function EvolatorFindCamp() {
  return (
    <section className="w-full container px-4 mt-5 mb-18">
      <ActiveCmpsBackBtn label="Find Camps" />
      <FilterCamps />
    </section>
  );
}
