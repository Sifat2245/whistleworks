import MyCampusCart from "@/page/dashboard/director-dashboard/dashboard/components/MyCampusCart";

const AssignedCampCard = ({ camp }) => {
  const { assigned_by: assignedBy, permissions = [] } = camp || {};

  return (
    <div className="w-full">
      {/* Same card as "My Camps" — with an "Assigned by" badge and
          quick actions gated by the granted permissions */}
      <MyCampusCart
        league={camp}
        assignedBy={assignedBy}
        permissions={permissions}
        skipScheduleFetch
      />
    </div>
  );
};

export default AssignedCampCard;
