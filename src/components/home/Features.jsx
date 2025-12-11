import trackingIcon from "@/assets/svg/tracking.png";
import campaignsIcon from "@/assets/svg/campaigns.png";
import gpsIcon from "@/assets/svg/gps.png";
import collaborationIcon from "@/assets/svg/collaboration.png";
import scheduleIcon from "@/assets/svg/schedule.png";
import managementIcon from "@/assets/svg/management.png";
import CommonTitle from "../common/CommonTitle";
import CommonText from "../common/CommonText";

const Features = () => {
  const features = [
    {
      title: "Performance Tracking",
      description: "Comprehensive evaluation system for continuous improvement",
      icon: trackingIcon,
    },
    {
      title: "Camp Registration",
      description: "Registration and camp payment made easy",
      icon: campaignsIcon,
    },
    {
      title: "GPS Integration",
      description: "Real-time location tracking and directions to game venues",
      icon: gpsIcon,
    },
    {
      title: "Team Collaboration",
      description:
        "Integrated group messaging and real-time notifications for all referees",
      icon: collaborationIcon,
    },
    {
      title: "Smart Scheduling",
      description:
        "Automated game assignments with conflict detection and balanced distribution",
      icon: scheduleIcon,
    },
    {
      title: "Multi-Camp Management",
      description:
        "Directors can manage multiple camps with custom settings and pricing.",
      icon: managementIcon,
    },
  ];

  // Note:Main ui component
  return (
    <div className="container lg:pt-16 md:pt-10 pt-6">
      <div className="text-center">
        <CommonTitle text="Powerful Features" />
        <CommonText
          text="Everything you need to manage referees, schedules, and evaluations in one modern platform"
          className={"md:w-1/2 mx-auto text-neutral-500 mt-5"}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8 lg:gap-6 md:gap-5 gap-4 lg:mt-12 md:mt-10 mt-8 md:mb-16 mb-10">
        {features?.map((feature, index) => (
          <div
            key={index}
            className="flex flex-col items-start lg:p-6  p-4 bg-white rounded-lg shadow-lg/5 border border-neutral-200 hover:border-primary duration-300"
          >
            <div className="lg:p-4 p-3 rounded-full bg-primary mb-4">
              <img
                src={feature.icon}
                alt={feature.title}
                className="lg:h-8 h-5 lg:w-8 w-5 object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-neutral-500 text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;
