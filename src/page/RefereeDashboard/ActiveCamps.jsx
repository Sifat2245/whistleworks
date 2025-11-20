import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import CommonText from "@/components/common/CommonText";
import CampCard from "@/components/reusable/CampCard";
import { useQuery } from "@tanstack/react-query";
import { Spin } from "antd";
import axios from "axios";

export default function ActiveCamps() {
  const { data: camps, isLoading } = useQuery({
    queryKey: ["camps"],
    queryFn: async () => {
      const response = await axios.get("/camps.json");
      return response.data;
    },
  });
  console.log(camps);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <section className="container w-full px-4 mx-auto mt-5">
      <ActiveCmpsBackBtn />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
        {camps.length > 0 ? (
          camps.map((camp) => <CampCard key={camp.id} camp={camp} />)
        ) : (
          <div className="col-span-3 text-center py-12">
            <CommonText
              text=" No camps found matching your filters."
              className="text-lg"
            />
          </div>
        )}
      </div>
    </section>
  );
}
