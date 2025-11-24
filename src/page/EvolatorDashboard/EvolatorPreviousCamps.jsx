import ActiveCmpsBackBtn from "@/components/common/ActiveCmpsBackBtn";
import location from "@/assets/svg/location.svg";
import calender from "/referee/calender-icon.svg";
import PreviousCampsCard from "@/components/dashboard/refereeDashboard/PreviousCampsCard";

export default function EvolatorPreviousCamps() {
    return (
      <section className="container w-full px-4 mx-auto mt-5 mb-18">
        <ActiveCmpsBackBtn label="Previous Camps" />
        <div className="space-y-3">
          {previewCamps.length > 0 ? (
            previewCamps.map((camp) => (
              <PreviousCampsCard key={camp.id} camp={camp} />
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-lg"> No previous camps found.</p>
            </div>
          )}
        </div>
      </section>
    );
}


const previewCamps = [
  {
    id: 1,
    title: "Summer Soccer Officials Academy",
    location_icon: location,
    calendar_icon: calender,
    location: "Los Angeles, CA",
    date: "Los Angeles, CA",
  },
  {
    id: 2,
    title: "Summer Soccer Officials Academy",
    location_icon: location,
    calendar_icon: calender,
    location: "Los Angeles, CA",
    date: "Los Angeles, CA",
  },
  {
    id: 3,
    title: "Summer Soccer Officials Academy",
    location_icon: location,
    calendar_icon: calender,
    location: "Los Angeles, CA",
    date: "Los Angeles, CA",
  },
];
