import crewImage from "@/assets/dashboard/refereeImg.png";

export const crewGroups = [
  {
    groupId: 1,
    groupNumber: 1,
    crewMembers: [
      {
        id: 1,
        image: crewImage,
        refeName: "Zobayer",
        // role: "Lead Referee",
        // status: "Active"
      },
      {
        id: 2,
        image: crewImage,
        refeName: "Alex Morgan",
        // role: "Assistant Referee",
        // status: "Active"
      },
      {
        id: 3,
        image: crewImage,
        refeName: "David Chen",
        // role: "Line Judge",
        // status: "On Break"
      },
    ],
    location: "Court A",
    match: "Semi-Final 1",
  },
  {
    groupId: 2,
    groupNumber: 2,
    crewMembers: [
      {
        id: 4,
        image: crewImage,
        refeName: "Sarah Wilson",
        // role: "Scorekeeper",
        // status: "Active"
      },
      {
        id: 5,
        image: crewImage,
        refeName: "Marcus Lee",
        // role: "Video Referee",
        // status: "Active"
      },
      {
        id: 6,
        image: crewImage,
        refeName: "Emma Rodriguez",
        // role: "Timekeeper",
        // status: "Inactive"
      },
    ],
    location: "Court B",
    match: "Semi-Final 2",
  },
  {
    groupId: 3,
    groupNumber: 3,
    crewMembers: [
      {
        id: 7,
        image: crewImage,
        refeName: "James Taylor",
        // role: "Lead Referee",
        // status: "Active"
      },
      {
        id: 8,
        image: crewImage,
        refeName: "Priya Sharma",
        // role: "Assistant Referee",
        // status: "Active"
      },
      {
        id: 9,
        image: crewImage,
        refeName: "Kenji Tanaka",
        // role: "Line Judge",
        // status: "Active"
      },
    ],
    location: "Main Arena",
    match: "Finals",
  },
  {
    groupId: 4,
    groupNumber: 4,
    crewMembers: [
      {
        id: 10,
        image: crewImage,
        refeName: "Olivia Brown",
        // role: "Scorekeeper",
        // status: "Active"
      },
      {
        id: 11,
        image: crewImage,
        refeName: "Michael Scott",
        // role: "Lead Referee",
        // status: "Active"
      },
      {
        id: 12,
        image: crewImage,
        refeName: "Lisa Ray",
        // role: "Assistant Referee",
        // status: "Active"
      },
    ],
    location: "Court C",
    match: "Qualifiers",
  },
];
