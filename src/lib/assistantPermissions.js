import { CiCalendar } from "react-icons/ci";
import { PiCourtBasketball, PiMegaphone, PiSunglassesLight } from "react-icons/pi";
import { FiSend } from "react-icons/fi";
import { BsArrowLeftRight } from "react-icons/bs";
import { LuUsers, LuUser } from "react-icons/lu";

export const ASSISTANT_PERMISSIONS = [
  {
    key: "manage_schedule",
    label: "Manage Schedules",
    description: "Create and edit the camp's game schedule",
    icon: CiCalendar,
  },
  {
    key: "assign_referee",
    label: "Assign Referees",
    description: "Assign referees & crews to court slots",
    icon: PiCourtBasketball,
  },
  {
    key: "publish_camp",
    label: "Publish Camp",
    description: "Publish the camp and its schedule live",
    icon: FiSend,
  },
  {
    key: "manage_ranking",
    label: "Manage Ranking Reports",
    description: "Create and manage ranking reports",
    icon: BsArrowLeftRight,
  },
  {
    key: "manage_roster_referees",
    label: "Manage Roster Referees",
    description: "Manage referees in the camp roster",
    icon: LuUser,
  },
  {
    key: "manage_roster_evaluators",
    label: "Manage Roster Evaluators",
    description: "Manage evaluators in the camp roster",
    icon: PiSunglassesLight,
  },
  {
    key: "manage_roster_crews",
    label: "Manage Roster Crews",
    description: "Manage referee crews in the camp roster",
    icon: LuUsers,
  },
  {
    key: "manage_announcement",
    label: "Manage Announcements",
    description: "Create and send camp announcements",
    icon: PiMegaphone,
  },
];

export const CARD_ACTION_PERMISSIONS = {
  schedule: ["build_schedule"],
  court: ["assign_referee"],
  evaluate: ["manage_roster_evaluators"],
  ranking: ["manage_ranking"],
  roster: ["manage_roster_referees", "manage_roster_crews"],
  announcement: ["manage_announcement"],
};
