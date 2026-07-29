// MyGameCard.jsx
import { useState } from "react";
import locationIcon from "@/assets/svg/location.svg";
import messageIcon from "@/assets/svg/message.svg";
import Icon from "@/components/common/Icon";
import { Avatar, Card, Divider, Tag, Tooltip } from "antd";
import { format } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { SlCalender } from "react-icons/sl";
import RefereeDetailsPopup from "./RefereeDetailsPopup";

export default function MyGameCard({ game, camp }) {
  const [selectedReferee, setSelectedReferee] = useState(null);
  // Parse the date part from ISO string (midnight UTC)
  const gameDateUTC = game?.game_details?.date;
  // console.log(game, 'game');

  // Timezone from camp (fallback to UTC)
  const tz = camp?.timezone || "UTC";

  // Local time strings (already in camp timezone)
  const startTimeStr = game.game_details.start_time;
  const endTimeStr = game.game_details.end_time;

  // Build local date-time strings in camp's timezone (no timezone suffix)
  const startLocalStr = `${format(gameDateUTC, "yyyy-MM-dd")}T${startTimeStr}`;
  const endLocalStr = `${format(gameDateUTC, "yyyy-MM-dd")}T${endTimeStr}`;

  // Convert local strings → UTC Date objects using camp timezone
  const startDateInTz = fromZonedTime(startLocalStr, tz);
  const endDateInTz = fromZonedTime(endLocalStr, tz);

  // Format back in camp timezone with short abbreviation (CST/CDT auto-handled)
  const startTimeFormatted = formatInTimeZone(startDateInTz, tz, "h:mm a z");
  const endTimeFormatted = formatInTimeZone(endDateInTz, tz, "h:mm a z");

  const latitude = game.location.latitude;
  const longitude = game.location.longitude;

  const handleViewLocation = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(mapUrl, "_blank");
  };

  const handleRefereeClick = (ref) => {
    if (!ref.is_me) {
      setSelectedReferee(ref);
    }
  };

  const handleMessageReferees = () => {
    const referees = game?.assigned_referees?.referees || [];
    const phoneNumbers = referees
      .filter((ref) => !ref.is_me)
      .map((ref) => ref.phone)
      .filter(Boolean);

    if (phoneNumbers.length === 0) {
      alert("No other referees to message");
      return;
    }

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);

    // For multiple recipients
    if (phoneNumbers.length > 1) {
      if (isIOS) {
        // iOS working format
        const smsUrl = `sms://open?addresses=${phoneNumbers.join(",")}`;
        window.location.href = smsUrl;
        return;
      } else if (isAndroid) {
        // Try Android format
        const smsUrl = `sms:${phoneNumbers.join(";")}`;
        window.location.href = smsUrl;

        // Give user option if it doesn't work
        setTimeout(() => {
          if (document.hasFocus()) {
            const shouldCopy = confirm(
              `Multiple recipients (${phoneNumbers.length}) may not be supported.\n\n` +
                `Would you like to copy all numbers to clipboard instead?\n\n` +
                `${phoneNumbers.join(", ")}`,
            );
            if (shouldCopy) {
              navigator.clipboard.writeText(phoneNumbers.join(", "));
              alert("Numbers copied! Paste into your messaging app.");
            } else {
              window.location.href = `sms:${phoneNumbers[0]}`;
            }
          }
        }, 500);
        return;
      }
    }

    // Single recipient or desktop fallback
    window.location.href = `sms:${phoneNumbers.join(",")}`;
  };

  return (
    <>
      <Card
        className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-t-4 border-[#00AEEF]"
        cover={
          <div className="relative">
            <img
              src={camp?.logo || ""}
              alt={camp?.name || "Camp"}
              className="h-62 w-full object-cover rounded-t-xl"
            />
            <div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent p-5">
              <h3 className="text-white text-xl font-bold">
                {camp?.name || "Camp Name"}
              </h3>
              <p className="text-white/90 text-sm">
                {game.location?.name || "—"}
              </p>
            </div>
          </div>
        }
      >
        <div className="space-y-5 -mt-2">
          {/* Date & Time */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-primary">
              <SlCalender />
              <span className="font-semibold">{gameDateUTC}</span>
            </div>
            <Tag color="blue" className="text-sm font-medium px-4 py-1">
              {startTimeFormatted} – {endTimeFormatted}
            </Tag>
          </div>

          {/* Court Info */}
          <div className="text-center py-4 bg-linear-to-r from-blue-50 to-[#E6F7FD] rounded-xl">
            <p className="text-xl font-bold text-gray-800">
              {game.location?.address}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {game.game_details.court_name} •{" "}
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
                  <div
                    className={`text-center ${
                      !ref.is_me
                        ? "cursor-pointer hover:opacity-80 transition-opacity"
                        : ""
                    }`}
                    onClick={() => handleRefereeClick(ref)}
                  >
                    <Avatar
                      src={ref.avatar}
                      size={70}
                      className={`border-4 shadow-md ${
                        ref.is_me
                          ? "border-green-500"
                          : "border-gray-300 hover:border-[#00AEEF]"
                      }`}
                    >
                      {ref.name.charAt(0).toUpperCase()}
                    </Avatar>
                    {ref.is_me && (
                      <div className="mt-2 text-xs font-bold text-green-600">
                        YOU
                      </div>
                    )}
                    {!ref.is_me && (
                      <div className="mt-2 text-xs font-medium text-[#00AEEF]">
                        View Details
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

            {/* Message button commented out as before */}
            <button
              onClick={handleMessageReferees}
              className="flex items-center gap-2 text-primary cursor-pointer font-medium"
            >
              <Icon src={messageIcon} className="size-5" />
              Message Referees
            </button>
          </div>
        </div>
      </Card>

      {/* Referee Details Popup */}
      {selectedReferee && (
        <RefereeDetailsPopup
          isOpen={!!selectedReferee}
          onClose={() => setSelectedReferee(null)}
          campId={camp?.id}
          referee={selectedReferee}
        />
      )}
    </>
  );
}
