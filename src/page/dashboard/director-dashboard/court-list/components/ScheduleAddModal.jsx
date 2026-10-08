import RefereeAssignModal from "./RefereeAssignModal";
import CrewAssignModal from "./CrewAssignModal";

/**
 * ScheduleAddModal — Dispatcher component that renders RefereeAssignModal
 * for individual referee assignments or CrewAssignModal for crew assignments.
 */
const ScheduleAddModal = (props) => {
  const isCrewMode =
    props.assignmentType === "crew" || props.assignmentType === "crews";

  if (isCrewMode) {
    return <CrewAssignModal {...props} />;
  }

  return <RefereeAssignModal {...props} />;
};

export default ScheduleAddModal;
