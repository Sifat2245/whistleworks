import { formatRefereePosition } from "@/utils/refereePositions";
import { useState } from "react";
import { format } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import { LuCalendar, LuMapPin, LuMessageSquare, LuUserCheck, LuClock } from "react-icons/lu";
import RefereeDetailsPopup from "./RefereeDetailsPopup";

export default function MyGameCard({ game, camp }) {
  const [selectedReferee, setSelectedReferee] = useState(null);

  const gameDateUTC = game?.game_details?.date;
  const tz = camp?.timezone || "UTC";

  const startTimeStr = game.game_details.start_time;
  const endTimeStr = game.game_details.end_time;

  const startLocalStr = `${format(gameDateUTC, "yyyy-MM-dd")}T${startTimeStr}`;
  const endLocalStr = `${format(gameDateUTC, "yyyy-MM-dd")}T${endTimeStr}`;

  const startDateInTz = fromZonedTime(startLocalStr, tz);
  const endDateInTz = fromZonedTime(endLocalStr, tz);

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

    if (phoneNumbers.length > 1) {
      if (isIOS) {
        window.location.href = `sms://open?addresses=${phoneNumbers.join(",")}`;
        return;
      } else if (isAndroid) {
        window.location.href = `sms:${phoneNumbers.join(";")}`;
        setTimeout(() => {
          if (document.hasFocus()) {
            const shouldCopy = confirm(
              `Multiple recipients (${phoneNumbers.length}) may not be supported.\n\n` +
              `Would you like to copy all numbers to clipboard instead?\n\n` +
              `${phoneNumbers.join(", ")}`
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

    window.location.href = `sms:${phoneNumbers.join(",")}`;
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E8E8E8] shadow-xs hover:shadow-md hover:border-[#00AEEF]/40 transition-all duration-300 overflow-hidden flex flex-col justify-between font-sans">
        {/* ── Top Cover Banner ────────────────────────────────── */}
        <div className="relative h-44 bg-slate-900 overflow-hidden">
          {camp?.logo ? (
            <img
              src={camp.logo}
              alt={camp?.name || "Camp"}
              className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center text-slate-600 font-bold text-xl">
              WhistleWorks Camp
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-4 flex flex-col justify-between">
            <div className="flex justify-end">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
                {game.game_details.status || "Scheduled"}
              </span>
            </div>
            <div>
              <h4 className="text-white text-lg font-bold truncate drop-shadow-xs">
                {camp?.name || "Camp Name"}
              </h4>
              <p className="text-slate-300 text-xs truncate flex items-center gap-1 mt-0.5">
                <LuMapPin className="text-[#00AEEF] text-xs shrink-0" />
                <span>{game.location?.name || "Venue Location"}</span>
              </p>
            </div>
          </div>
        </div>

        {/* ── Body Details ────────────────────────────────────── */}
        <div className="p-4 sm:p-5 space-y-4 flex-1">
          {/* Date & Time Bar */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-slate-800 text-xs sm:text-sm font-semibold">
              <LuCalendar className="text-[#00AEEF] text-base shrink-0" />
              <span>{format(new Date(gameDateUTC), "EEEE, MMM d, yyyy")}</span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-[#00AEEF] shadow-2xs">
              <LuClock className="text-xs" />
              <span>{startTimeFormatted} – {endTimeFormatted}</span>
            </div>
          </div>

          {/* Court & My Position Pill */}
          <div className="border border-blue-100 bg-blue-50/50 rounded-xl p-3.5 text-center space-y-2">
            <p className="text-sm font-bold text-slate-900">
              {game.game_details.court_name}
            </p>

            {game?.my_position && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-blue-200 shadow-2xs">
                <span className="text-xs text-slate-500 font-medium">My Position:</span>
                <span className="text-xs font-bold text-[#00AEEF]">
                  {formatRefereePosition(game.my_position)}
                </span>
              </div>
            )}
          </div>

          {/* Assigned Referees Crew */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              <span>Assigned Crew</span>
              <span>{game.assigned_referees.total} Referees</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {game.assigned_referees.referees.map((ref) => (
                <div
                  key={ref.id}
                  onClick={() => handleRefereeClick(ref)}
                  className={`flex flex-col items-center p-2 rounded-xl border transition-all ${ref.is_me
                      ? "bg-emerald-50/60 border-emerald-200"
                      : "bg-slate-50 border-slate-200/80 hover:bg-white hover:border-[#00AEEF]/50 cursor-pointer"
                    }`}
                  style={{ minWidth: "90px" }}
                >
                  <div className="relative">
                    <img
                      src={ref.avatar || "/default-avatar.png"}
                      alt={ref.name}
                      className={`w-12 h-12 rounded-full object-cover border-2 ${ref.is_me ? "border-emerald-500 shadow-sm" : "border-slate-200"
                        }`}
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                    {ref.is_me && (
                      <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 text-[9px] font-bold shadow-xs">
                        <LuUserCheck />
                      </div>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-slate-900 mt-1.5 truncate max-w-[85px] text-center">
                    {ref.name}
                  </p>

                  {ref.position && (
                    <span className="text-[10px] font-semibold text-[#00AEEF] bg-white px-2 py-0.5 rounded-md border border-slate-200 mt-1 text-center truncate max-w-[85px]">
                      {formatRefereePosition(ref.position)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer Actions ──────────────────────────────────── */}
        <div className="p-4 bg-slate-50 border-t border-[#E8E8E8] flex items-center justify-between gap-3">
          <button
            onClick={handleViewLocation}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-[#00AEEF] transition-all cursor-pointer shadow-2xs"
          >
            <LuMapPin className="text-slate-400 text-sm" />
            <span>Location</span>
          </button>

          <button
            onClick={handleMessageReferees}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-[#00AEEF] hover:bg-[#0099d4] rounded-lg transition-all cursor-pointer shadow-xs"
          >
            <LuMessageSquare className="text-sm" />
            <span>Message Crew</span>
          </button>
        </div>
      </div>

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
