import profile from "@/assets/dashboard/profile.png";
import MyGameCard from "./MyGameCard";

export default function MyGames() {
  return (
    <section>
      {
        mygameData.map((game) => (
            <MyGameCard key={game.id} game={game} />
        ))
      }
    </section>
  );
}

const mygameData = [
  {
    id: 1,
    time: "10/25 9:15 AM",
    court: "Bixby HS - Court 2",
    refree: [
      { name: "ref 1 #5", phone: "(321) 555-7890", image: profile },
      { name: "ref 2 #7", phone: "(987) 111-2233", image: profile },
      { name: "ref 3 #9", phone: "(555) 444-6677", image: profile },
    ],
  },
  {
    id: 2,
    time: "10/26 11:30 AM",
    court: "Bixby HS - Court 1",
    refree: [
      { name: "ref 4 #12", phone: "(800) 222-4545", image: profile },
      { name: "ref 5 #3", phone: "(999) 333-1212", image: profile },
      { name: "ref 6 #11", phone: "(444) 888-9999", image: profile },
    ],
  },
  {
    id: 3,
    time: "10/27 3:00 PM",
    court: "Bixby HS - Court 3",
    refree: [
      { name: "ref 7 #2", phone: "(222) 777-8888", image: profile },
      { name: "ref 8 #4", phone: "(666) 555-1212", image: profile },
      { name: "ref 9 #6", phone: "(123) 000-4444", image: profile },
    ],
  },
];
