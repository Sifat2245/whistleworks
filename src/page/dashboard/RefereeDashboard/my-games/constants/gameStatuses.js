export const GAME_STATUSES = [
  {
    value: "upcoming",
    label: "Upcoming",
    description: "Your scheduled games, ready for your next assignment.",
    emptyTitle: "No upcoming games",
    emptyDescription:
      "You have no upcoming assignments in this camp. Check Ongoing for games in progress or Past for completed games.",
    statisticKey: "upcoming_slots",
  },
  {
    value: "ongoing",
    label: "Ongoing",
    description:
      "Games currently in progress, as reported by the camp schedule.",
    emptyTitle: "No games in progress",
    emptyDescription:
      "None of your assigned games are ongoing. Check Upcoming to see your next assignments.",
    statisticKey: "ongoing_slots",
  },
  {
    value: "past",
    label: "Past",
    description: "Your completed assignments, kept here for reference.",
    emptyTitle: "No past games yet",
    emptyDescription:
      "Your completed assignments will appear here. Check Upcoming for games still ahead.",
    statisticKey: "completed_slots",
  },
];
