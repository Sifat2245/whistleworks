import { useEffect, useId, useRef, useState } from "react";
import { Input, Modal } from "antd";
import { LuFilePenLine, LuTrash2 } from "react-icons/lu";
import { useAuth } from "@/hooks/useAuth";
import {
  useCreateEvaluationNote,
  useDeleteEvaluationNote,
  useUpdateEvaluationNote,
} from "@/hooks/api/evaluator-hooks/useEvaluatorSchedule";
import CommonSubmitBtn from "@/components/common/CommonSubmitBtn";
import ScheduleTimezone from "@/components/common/ScheduleTimezone";

export default function EvaluatorNoteModal(props) {
  const { userData } = useAuth() || {};
  if (userData?.role !== "evaluator") return null;
  return <NoteEditor key={`${props.campId}:${props.game.id}`} {...props} />;
}

function NoteEditor({ campId, game, onClose }) {
  const inputId = useId();
  const requestInFlight = useRef(false);
  const inputRef = useRef(null);
  const deleteConfirmationRef = useRef(null);
  const [note, setNote] = useState(
    typeof game.evaluator_note === "string" ? game.evaluator_note : "",
  );
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const create = useCreateEvaluationNote(campId);
  const update = useUpdateEvaluationNote(campId);
  const remove = useDeleteEvaluationNote(campId);
  const busy = create.isPending || update.isPending || remove.isPending;
  const hasId = game.evaluator_note_id != null;
  const missingId = Boolean(game.evaluator_note) && !hasId;
  useEffect(() => {
    if (confirmDelete) deleteConfirmationRef.current?.focus();
  }, [confirmDelete]);

  const perform = async (mutation, variables) => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setError("");
    try {
      await mutation.mutateAsync(variables);
      onClose();
    } catch (failure) {
      const body = failure?.response?.data;
      const message =
        body?.errors?.note?.[0] ||
        body?.errors?.notes?.[0] ||
        body?.message ||
        failure?.message;
      setError(
        typeof message === "string"
          ? message
          : "Unable to change this note. Please try again.",
      );
    } finally {
      requestInFlight.current = false;
    }
  };

  const handleSave = (event) => {
    event.preventDefault();
    if (busy || missingId) return;
    if (!note.trim()) {
      setError("Enter a note before saving.");
      return;
    }
    perform(hasId ? update : create, {
      gameSlotId: game.id,
      noteId: game.evaluator_note_id,
      note: note.trim(),
    });
  };

  return (
    <Modal
      open
      title={
        <span className="inline-flex items-center gap-2">
          <LuFilePenLine className="text-primary" aria-hidden="true" />
          Evaluator note
        </span>
      }
      onCancel={onClose}
      footer={null}
      width={520}
      closable={!busy}
      maskClosable={!busy}
      keyboard={!busy}
    >
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 mb-4 mt-4">
        <p className="font-semibold text-slate-800">
          {game.court}{" "}
          <span className="font-normal text-slate-500">· {game.date}</span>
        </p>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <span>{game.time}</span>
          <ScheduleTimezone
            timezones={game.timezone}
            date={game.date}
            time={game.start_time}
          />
        </p>
      </div>
      <form onSubmit={handleSave} aria-busy={busy}>
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-800 mb-2"
        >
          Game note
        </label>
        <Input.TextArea
          ref={inputRef}
          id={inputId}
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setError("");
          }}
          rows={5}
          autoFocus
          disabled={busy || missingId}
          aria-invalid={Boolean(error)}
          aria-describedby={`${inputId}-help${error ? ` ${inputId}-error` : ""}`}
          placeholder="Add observations or reminders for this game slot…"
          className="!rounded-xl"
        />
        <p id={`${inputId}-help`} className="text-xs text-slate-500 mt-2">
          Evaluator notes for this game slot.
        </p>
        {missingId && (
          <p role="status" className="text-xs text-amber-800 mt-3">
            This note is missing its ID. Refresh the schedule before editing it.
          </p>
        )}
        {error && (
          <p
            id={`${inputId}-error`}
            role="alert"
            className="text-sm text-red-700 mt-3"
          >
            {error}
          </p>
        )}
        {confirmDelete && (
          <div
            ref={deleteConfirmationRef}
            tabIndex={-1}
            className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3"
            role="alert"
          >
            <p className="text-sm text-red-800">
              Delete this evaluator note? This removes it from the game slot.
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <CommonSubmitBtn
                type="button"
                variant="secondary"
                disabled={busy}
                onClick={() => {
                  setConfirmDelete(false);
                  inputRef.current?.focus();
                }}
              >
                Keep note
              </CommonSubmitBtn>
              <CommonSubmitBtn
                type="button"
                variant="danger"
                isLoading={remove.isPending}
                disabled={busy}
                onClick={() =>
                  perform(remove, { noteId: game.evaluator_note_id })
                }
              >
                Confirm delete
              </CommonSubmitBtn>
            </div>
          </div>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5 border-t border-slate-100 pt-4">
          <div>
            {hasId && !confirmDelete && (
              <CommonSubmitBtn
                type="button"
                variant="danger"
                disabled={busy}
                onClick={() => {
                  setConfirmDelete(true);
                  setError("");
                }}
                className="gap-1.5 text-xs"
              >
                <LuTrash2 aria-hidden="true" />
                Delete note
              </CommonSubmitBtn>
            )}
          </div>
          <div className="flex gap-2">
            <CommonSubmitBtn
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </CommonSubmitBtn>
            {!confirmDelete && (
              <CommonSubmitBtn
                type="submit"
                isLoading={create.isPending || update.isPending}
                disabled={busy || missingId || !note.trim()}
              >
                {hasId ? "Update note" : "Save note"}
              </CommonSubmitBtn>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
