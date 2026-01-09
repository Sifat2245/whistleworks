// MyGameCard.jsx
import locationIcon from "@/assets/svg/location.svg";
import messageIcon from "@/assets/svg/message.svg";
import Icon from "@/components/common/Icon";
import { Avatar, Card, Divider, Tag, Tooltip } from "antd";
import { format, parseISO } from "date-fns";
import Swal from "sweetalert2";

export default function MyGameCard({ game, camp }) {
  // Extract clean date (without time) from the ISO string
  const gameDate = parseISO(game.game_details.date);
  const formattedDate = format(gameDate, "MMM d, yyyy");

  const handleMessageClick = () => {
    Swal.fire({
      title: "Coming Soon!!!",
      text: "This feature is currently not available. Please check back later.",
      icon: "info",
      confirmButtonText: "OK",
    });
  };

  console.log(game, "gane");

  // Combine date with start/end time correctly
  const startDateTime = new Date(
    `${format(gameDate, "yyyy-MM-dd")}T${game.game_details.start_time}`
  );
  const endDateTime = new Date(
    `${format(gameDate, "yyyy-MM-dd")}T${game.game_details.end_time}`
  );

  const startTime = format(startDateTime, "h:mm a");
  const endTime = format(endDateTime, "h:mm a");

  const latitude = game.location.latitude;
  const longitude = game.location.longitude;

  const handleViewLocation = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(mapUrl, "_blank"); // Opens in new tab
    // Alternative: window.location.href = mapUrl; for same tab redirect
  };

  return (
    <Card
      className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#00AEEF]"
      cover={
        <div className="relative">
          <img
            src={camp?.logo || ""} // ← Use camp.logo
            alt={camp?.name || "Camp"}
            className="h-62 w-full object-cover rounded-t-xl"
          />
          <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-5">
            <h3 className="text-white text-xl font-bold">
              {camp?.name || "Camp Name"}
            </h3>
            <p className="text-white/90 text-sm">
              {game.location?.name || "—"} • {camp?.location || "—"}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-5 -mt-2">
        {/* Date & Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-gray-700">
            <Icon src={locationIcon} className="size-5 text-[#00AEEF]" />
            <span className="font-semibold">{formattedDate}</span>
          </div>
          <Tag color="blue" className="text-sm font-medium px-4 py-1">
            {startTime} – {endTime}
          </Tag>
        </div>

        {/* Court Info */}
        <div className="text-center py-4 bg-linear-to-r from-blue-50 to-[#E6F7FD] rounded-xl">
          <p className="text-xl font-bold text-gray-800">
            {game.game_details.court_name}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Court {game.game_details.court_number} •{" "}
            <Tag color="green" className="ml-1">
              {game.game_details.status.toUpperCase()}
            </Tag>
          </p>
        </div>

        <Divider className="my-4 border-black/15" />

        {/* Assigned Referees */}
        <div>
          <h4 className="font-semibold text-gray-800 mb-4 text-center md:text-left">
            Assigned With ({game.assigned_referees.total} Referee
            {game.assigned_referees.total !== 1 ? "s" : ""})
          </h4>
          <div className="flex flex-wrap justify-center md:justify-start gap-5">
            {game.assigned_referees.referees.map((ref) => (
              <Tooltip
                key={ref.id}
                title={
                  <div className="text-center">
                    <p className="font-medium">{ref.name}</p>
                    <p className="text-xs text-gray-300">{ref.phone}</p>
                    {ref.is_me && (
                      <Tag color="green" className="mt-2">
                        YOU
                      </Tag>
                    )}
                  </div>
                }
              >
                <div className="text-center">
                  <Avatar
                    src={ref.avatar}
                    size={70}
                    className={`border-4 shadow-md ${
                      ref.is_me ? "border-green-500" : "border-gray-300"
                    }`}
                  >
                    {ref.name.charAt(0).toUpperCase()}
                  </Avatar>
                  {ref.is_me && (
                    <div className="mt-2 text-xs font-bold text-green-600">
                      YOU
                    </div>
                  )}
                </div>
              </Tooltip>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-black/15">
          <button
            onClick={handleViewLocation}
            className="flex items-center gap-2 text-primary cursor-pointer font-medium"
          >
            <Icon src={locationIcon} className="size-5" />
            View Location
          </button>

          <button
            onClick={handleMessageClick}
            className="bg-[#00AEEF] text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center gap-3 font-medium shadow-md"
          >
            <Icon src={messageIcon} className="size-5" />
            Message
          </button>
        </div>
      </div>
    </Card>
  );
}
