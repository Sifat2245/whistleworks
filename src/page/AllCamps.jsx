// AllCamps.jsx
import CommonText from "@/components/common/CommonText";
import CommonTitle from "@/components/common/CommonTitle";
import FilterCamps from "@/shared/FilterCamps";

const AllCamps = () => {
  return (
    <div className="container mx-auto px-4">
      <div className="mb-6 mt-28 md:mt-36 text-center max-w-4xl mx-auto">
        <CommonTitle
          text="Discover All Referee Training Camps"
          className="mb-6 text-4xl md:text-5xl font-bold text-gray-900"
        />

        <CommonText
          text="Explore our comprehensive list of upcoming referee training camps across all sports and locations. 
          Whether you're looking to develop new skills, earn certifications, or advance your officiating career, 
          find the perfect camp to elevate your game."
          className="text-sm md:text-base text-gray-600 leading-relaxed max-w-4xl mx-auto"
        />
      </div>

      <FilterCamps />
    </div>
  );
};

export default AllCamps;
