import { useState, useEffect } from "react";
import { Popover, Modal } from "antd";
import {
  LuPencil,
  LuFileText,
  LuTrash2,
  LuCheck,
  LuX,
  LuLoaderCircle,
} from "react-icons/lu";
import {
  useUpdateRefereeNote,
  useDeleteRefereeNote,
} from "@/hooks/api/director-hooks/useDirectorNote";
import { cn } from "@/lib/utils";

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const updateSize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [breakpoint]);

  return isMobile;
}

function getRefereeNotes(referee) {
  if (referee?.notes !== undefined && referee?.notes !== null) {
    return String(referee.notes).trim();
  }
  if (referee?.note) {
    return String(referee.note).trim();
  }
  return "";
}

function ResponsivePopupWrapper({
  isMobile,
  isOpen,
  onOpenChange,
  triggerButton,
  content,
  placement = "bottomLeft",
}) {
  if (isMobile) {
    return (
      <>
        {triggerButton}
        <Modal
          open={isOpen}
          onCancel={() => onOpenChange(false)}
          footer={null}
          centered
          destroyOnHidden
          closable={false}
          zIndex={1200}
          width="min(92vw, 360px)"
          styles={{
            mask: {
              background: "rgba(15, 23, 42, 0.45)",
              backdropFilter: "blur(2px)",
            },
            content: {
              borderRadius: "16px",
              padding: "16px",
              maxWidth: "92vw",
              margin: "0 auto",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          {content}
        </Modal>
      </>
    );
  }

  return (
    <Popover
      content={content}
      trigger="click"
      open={isOpen}
      onOpenChange={onOpenChange}
      placement={placement}
      arrow={false}
      overlayStyle={{ maxWidth: "calc(100vw - 24px)" }}
    >
      {triggerButton}
    </Popover>
  );
}

function ReadOnlyRefereeNotePopover({
  referee,
  placement = "bottomLeft",
  className,
}) {
  const currentNotes = getRefereeNotes(referee);
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  // If no note exists, do not show button
  if (!currentNotes) {
    return null;
  }

  const handleOpenChange = (visible) => {
    setIsOpen(visible);
  };

  const handleTriggerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile) {
      handleOpenChange(!isOpen);
    }
  };

  const popoverContent = (
    <div
      className="w-full sm:w-80 p-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm text-gray-800 min-w-0 pr-2">
          <LuFileText className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">Note for {referee?.name || "Referee"}</span>
        </div>
        <button
          type="button"
          onClick={() => handleOpenChange(false)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded transition cursor-pointer shrink-0"
          aria-label="Close"
        >
          <LuX className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2.5">
        <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2.5 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
          {currentNotes}
        </p>
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  const triggerButton = (
    <button
      type="button"
      onClick={handleTriggerClick}
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition cursor-pointer shrink-0 shadow-2xs",
        className
      )}
      title="View referee note"
      aria-label="View referee note"
    >
      <LuPencil className="w-3 h-3 text-amber-600" />
      <span>Note</span>
    </button>
  );

  return (
    <ResponsivePopupWrapper
      isMobile={isMobile}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      triggerButton={triggerButton}
      content={popoverContent}
      placement={placement}
    />
  );
}

function EditableRefereeNotePopover({
  campId,
  referee,
  placement = "bottomLeft",
  className,
}) {
  const currentNotes = getRefereeNotes(referee);
  const hasNotes = Boolean(currentNotes);
  const refereeId = referee?.id || referee?.referee_id;
  const isMobile = useIsMobile();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(!hasNotes);
  const [noteInput, setNoteInput] = useState(currentNotes);

  useEffect(() => {
    setNoteInput(currentNotes);
    if (!hasNotes) {
      setIsEditing(true);
    }
  }, [currentNotes, hasNotes]);

  const updateMutation = useUpdateRefereeNote(campId);
  const deleteMutation = useDeleteRefereeNote(campId);

  const isSaving = updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;

  const handleOpenChange = (visible) => {
    setIsOpen(visible);
    if (!visible) {
      setIsEditing(!hasNotes);
      setNoteInput(currentNotes);
    }
  };

  const handleTriggerClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isMobile) {
      handleOpenChange(!isOpen);
    }
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    const trimmed = noteInput.trim();
    if (!trimmed || !refereeId) return;

    try {
      await updateMutation.mutateAsync({
        refereeId,
        notes: trimmed,
      });
      setIsEditing(false);
      handleOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  const handleDelete = async (e) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!refereeId) return;

    try {
      await deleteMutation.mutateAsync(refereeId);
      setIsEditing(true);
      setNoteInput("");
      handleOpenChange(false);
    } catch {
      // Error handled by mutation
    }
  };

  const popoverContent = (
    <div
      className="w-full sm:w-80 p-0.5"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-gray-100">
        <div className="flex items-center gap-1.5 font-semibold text-xs sm:text-sm text-gray-800 min-w-0 pr-2">
          <LuFileText className="w-4 h-4 text-primary shrink-0" />
          <span className="truncate">Note for {referee?.name || "Referee"}</span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {hasNotes && !isEditing && (
            <>
              <button
                type="button"
                onClick={() => {
                  setNoteInput(currentNotes);
                  setIsEditing(true);
                }}
                className="p-1 text-gray-500 hover:text-primary hover:bg-gray-100 rounded transition cursor-pointer"
                title="Edit Note"
                aria-label="Edit Note"
              >
                <LuPencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer disabled:opacity-50"
                title="Delete Note"
                aria-label="Delete Note"
              >
                {isDeleting ? (
                  <LuLoaderCircle className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <LuTrash2 className="w-3.5 h-3.5" />
                )}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded transition cursor-pointer"
            aria-label="Close"
          >
            <LuX className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {hasNotes && !isEditing ? (
        <div className="space-y-2.5">
          <p className="text-xs sm:text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg p-2.5 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
            {currentNotes}
          </p>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => {
                setNoteInput(currentNotes);
                setIsEditing(true);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-primary hover:bg-primary/10 rounded-md transition cursor-pointer"
            >
              <LuPencil className="w-3 h-3" />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              className="px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 rounded-md transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-2.5">
          <textarea
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                handleSave(e);
              }
            }}
            placeholder="Add note for this referee (e.g. preferred court, strengths, evaluation notes)..."
            rows={3}
            autoFocus={!isMobile}
            className="w-full text-xs sm:text-sm p-2.5 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition"
          />

          <div className="flex items-center justify-between pt-0.5">
            <span className="hidden sm:inline text-[10px] text-gray-400">Ctrl+Enter to save</span>
            <div className="flex items-center gap-1.5 ml-auto">
              <button
                type="button"
                onClick={() => {
                  if (hasNotes) {
                    setIsEditing(false);
                    setNoteInput(currentNotes);
                  } else {
                    handleOpenChange(false);
                  }
                }}
                className="px-2.5 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition cursor-pointer flex items-center gap-1"
              >
                <LuX className="w-3 h-3" />
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={isSaving || !noteInput.trim()}
                className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-md hover:bg-primary/90 transition disabled:opacity-50 cursor-pointer shadow-xs"
              >
                {isSaving ? (
                  <>
                    <LuLoaderCircle className="w-3 h-3 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <LuCheck className="w-3 h-3" />
                    <span>{hasNotes ? "Update" : "Add Note"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );

  const triggerButton = (
    <button
      type="button"
      onClick={handleTriggerClick}
      className={cn(
        "inline-flex items-center justify-center transition cursor-pointer shrink-0 min-w-[28px] min-h-[28px]",
        hasNotes
          ? "p-1 rounded-md text-primary bg-primary/10 border border-primary/20 hover:bg-primary/20 shadow-2xs"
          : "p-1 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 border border-transparent hover:border-gray-200",
        className
      )}
      title={hasNotes ? "View/edit referee note" : "Add referee note"}
      aria-label={hasNotes ? "View/edit referee note" : "Add referee note"}
    >
      <LuPencil className="w-3.5 h-3.5" />
    </button>
  );

  return (
    <ResponsivePopupWrapper
      isMobile={isMobile}
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      triggerButton={triggerButton}
      content={popoverContent}
      placement={placement}
    />
  );
}

export default function RefereeNotePopover(props) {
  if (props.readOnly) {
    return <ReadOnlyRefereeNotePopover {...props} />;
  }
  return <EditableRefereeNotePopover {...props} />;
}
