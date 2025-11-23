import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import FilterCamps from "@/shared/FilterCamps";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function FindCamps() {
  const { data: camps = [], isLoading } = useQuery({
    queryKey: ["camps"],
    queryFn: async () => {
      const response = await axios.get("/camps.json");
      return response.data;
    },
  });
  return (
    <section className="w-full container px-4 mt-5 mb-18">
      <ActiveCmpsBackBtn label="Find Camps" />
      <FilterCamps camps={camps} isLoading={isLoading} />
    </section>
  );
}
