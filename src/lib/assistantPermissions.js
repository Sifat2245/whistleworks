import { CiCalendar } from "react-icons/ci";
import { PiCourtBasketball, PiMegaphone } from "react-icons/pi";
import { FiSend } from "react-icons/fi";
import { BsArrowLeftRight } from "react-icons/bs";
import { LuUsers } from "react-icons/lu";

export const ASSISTANT_PERMISSIONS = [
  {
    key: "build_schedule",
    label: "Build Schedule",
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
    key: "manage_roster",
    label: "Manage Roster",
    description: "Manage referees, evaluators & crews",
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
  evaluate: ["manage_roster"],
  ranking: ["manage_ranking"],
  roster: ["manage_roster"],
  announcement: ["manage_announcement"],
};
