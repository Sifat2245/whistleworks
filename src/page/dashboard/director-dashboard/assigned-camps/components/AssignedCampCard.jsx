import CampCard from "@/page/dashboard/director-dashboard/dashboard/components/CampCard";

const AssignedCampCard = ({ camp }) => {
  const permObj = Object.values(camp?.permissions || {})[0] || {};

  const mappedPermissions = [];
  if (permObj.build_schedule) mappedPermissions.push("build_schedule");
  if (permObj.assign_referees) mappedPermissions.push("assign_referee");
  if (permObj.publish_camp) mappedPermissions.push("publish_camp");
  if (permObj.manage_ranking_reports) mappedPermissions.push("manage_ranking");
  if (permObj.manage_roster_referees) mappedPermissions.push("manage_roster_referees");
  if (permObj.manage_roster_evaluators) mappedPermissions.push("manage_roster_evaluators");
  if (permObj.manage_roster_crews) mappedPermissions.push("manage_roster_crews");
  if (permObj.manage_announcements) mappedPermissions.push("manage_announcement");

  return (
    <div className="w-full">
      {/* Same card as "My Camps" — with an "Assigned by" badge and
          quick actions gated by the granted permissions */}
      <CampCard
        league={camp}
        assignedBy={camp.assigned_by || "Director"}
        permissions={mappedPermissions}
        skipScheduleFetch
      />
    </div>
  );
};

export default AssignedCampCard;
