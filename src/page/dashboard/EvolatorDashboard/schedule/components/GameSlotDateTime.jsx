import { LuClock, LuFilePenLine } from "react-icons/lu";
import ScheduleTimezone from "@/components/common/ScheduleTimezone";

export default function GameSlotDateTime({ game, onNoteClick, children }) {
  const note =
    typeof game.evaluator_note === "string" ? game.evaluator_note : "";
  const hasNote = Boolean(note.trim()) || game.evaluator_note_id != null;
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium text-[#333]">{game.date}</span>
        {children}
        {onNoteClick && (
          <button
            type="button"
            onClick={() => onNoteClick(game)}
            aria-label={`${hasNote ? "View or edit" : "Add"} evaluator note for ${game.court} on ${game.date} at ${game.time}`}
            title={
              hasNote ? "View or edit evaluator note" : "Add evaluator note"
            }
            className={`inline-flex min-h-7 items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${hasNote ? "border-primary/25 bg-primary/10 text-sky-700 hover:bg-primary/20" : "border-slate-200 bg-white text-slate-500 hover:border-primary/40 hover:text-sky-700"}`}
          >
            <LuFilePenLine className="size-3.5" aria-hidden="true" /> Note
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-[#666] mt-1">
        <LuClock
          size={14}
          className="text-[#999] shrink-0"
          aria-hidden="true"
        />
        <span>{game.time}</span>
        <ScheduleTimezone
          timezones={game.timezone}
          date={game.date}
          time={game.start_time}
        />
      </div>
      {onNoteClick && note.trim() && (
        <p className="mt-2 text-xs leading-relaxed text-slate-500 whitespace-pre-wrap break-words line-clamp-2">
          {note}
        </p>
      )}
    </div>
  );
}
