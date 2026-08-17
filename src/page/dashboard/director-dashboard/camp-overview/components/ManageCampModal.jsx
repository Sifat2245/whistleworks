import { useEffect, useMemo, useState } from "react";
import { Modal } from "antd";
import {
  FiSearch,
  FiCheck,
  FiTrash2,
  FiUserPlus,
  FiX,
  FiArrowLeft,
  FiEdit2,
} from "react-icons/fi";
import { LuShieldCheck, LuInbox, LuUsers } from "react-icons/lu";
import { useGetAllDirectors } from "@/hooks/api/director-hooks/useCamps";
import { ASSISTANT_PERMISSIONS } from "@/lib/assistantPermissions";

const parseBool = (val) => val === true || val === 1 || val === "1" || val === "true";

const AVATAR_COLORS = [
  "#0ea5e9",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#ec4899",
  "#06b6d4",
  "#f97316",
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

const colorFromName = (name = "") => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const DirectorAvatar = ({ name, size = 40 }) => (
  <div
    className="flex shrink-0 select-none items-center justify-center rounded-full font-semibold text-white"
    style={{
      width: size,
      height: size,
      background: colorFromName(name),
      fontSize: size * 0.34,
    }}
  >
    {getInitials(name)}
  </div>
);

const SectionHeading = ({ title, right }) => (
  <div className="mb-3 flex items-center justify-between gap-3">
    <h4 className="text-xs font-bold uppercase tracking-[0.14em] text-gray-400">
      {title}
    </h4>
    {right}
  </div>
);

const AssignedAssistantRow = ({ assistant, onRemove, onEdit, isSelected }) => {
  const permissionCount = assistant?.permissions?.length || 0;
  return (
    <div
      onClick={() => onEdit?.(assistant)}
      className={`group flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
        isSelected
          ? "border-primary bg-primary/[0.08] shadow-sm"
          : "border-primary/15 bg-primary/[0.03] hover:border-primary/30 hover:bg-primary/[0.06] hover:shadow-sm"
      }`}
    >
      <DirectorAvatar name={assistant.name} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-800">
          {assistant.name}
        </p>
        <p className="truncate text-xs text-gray-500">{assistant.email}</p>
      </div>

      <span
        className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
          permissionCount
            ? "bg-primary/10 text-primary"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        {permissionCount
          ? `${permissionCount} permission${permissionCount > 1 ? "s" : ""}`
          : "View only"}
      </span>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onEdit?.(assistant);
        }}
        title={`Edit permissions for ${assistant.name}`}
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-primary/10 hover:text-primary"
      >
        <FiEdit2 className="text-sm" />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove?.(assistant.id);
        }}
        title={`Remove ${assistant.name}`}
        className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
      >
        <FiTrash2 className="text-sm" />
      </button>
    </div>
  );
};

const PermissionToggle = ({ permission, checked, onChange }) => {
  const Icon = permission.icon;
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
        checked
          ? "border-primary/30 bg-primary/[0.05]"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <span
        className={`flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
          checked ? "bg-primary text-white" : "bg-gray-100 text-gray-500"
        }`}
      >
        <Icon className="text-base" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold leading-tight text-gray-800">
          {permission.label}
        </p>
        <p className="mt-0.5 text-xs leading-snug text-gray-500">
          {permission.description}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={permission.label}
        onClick={() => onChange(!checked)}
        className={`relative h-[22px] w-10 shrink-0 cursor-pointer rounded-full transition-colors duration-200 ${
          checked ? "bg-primary" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute left-[2px] top-[2px] size-[18px] rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-[18px]" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
};

const ManageCampModal = ({
  open,
  onClose,
  campName,
  campId,
  assistants = [],
  onAssign,
  onRemove,
}) => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [granted, setGranted] = useState({});

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: directorsList = [] } = useGetAllDirectors(debouncedSearch, campId);

  const formattedDirectors = useMemo(() => {
    return (directorsList || []).map((director) => ({
      id: director.id,
      name: `${director.first_name || ""} ${director.last_name || ""}`.trim() || director.email,
      email: director.email,
      phone: director.phone,
      is_assigned: director.is_assigned,
      permissions: director.permissions,
    }));
  }, [directorsList]);

  const selectedDirector =
    formattedDirectors.find((director) => director.id === selectedId) ||
    assistants.find((assistant) => assistant.id === selectedId) ||
    null;
  const assignedIds = assistants.map((assistant) => assistant.id);

  const filteredDirectors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return formattedDirectors;
    return formattedDirectors.filter(
      (director) =>
        (director.name || "").toLowerCase().includes(query) ||
        (director.email || "").toLowerCase().includes(query)
    );
  }, [search, formattedDirectors]);

  const selectDirector = (director) => {
    setSelectedId(director.id);
    
    // Determine existing permissions from either the API response or props
    const existingAssistant = assistants.find((a) => a.id === director.id);
    const existingPerms = existingAssistant?.permissions || (Array.isArray(director.permissions) ? director.permissions : []);

    const initialGranted = {};
    if (director.permissions && !Array.isArray(director.permissions)) {
      const permObj = director.permissions;
      initialGranted["manage_schedule"] = parseBool(permObj.build_schedule) || parseBool(permObj.manage_schedule);
      initialGranted["assign_referee"] = parseBool(permObj.assign_referees) || parseBool(permObj.assign_referee);
      initialGranted["publish_camp"] = parseBool(permObj.publish_camp);
      initialGranted["manage_ranking"] = parseBool(permObj.manage_ranking_reports) || parseBool(permObj.manage_ranking);
      initialGranted["manage_roster_referees"] = parseBool(permObj.manage_roster_referees);
      initialGranted["manage_roster_evaluators"] = parseBool(permObj.manage_roster_evaluators);
      initialGranted["manage_roster_crews"] = parseBool(permObj.manage_roster_crews);
      initialGranted["manage_announcement"] = parseBool(permObj.manage_announcements) || parseBool(permObj.manage_announcement);
    } else if (existingPerms.length > 0) {
      existingPerms.forEach((key) => {
        const uiKey = key === "build_schedule" ? "manage_schedule" : key;
        initialGranted[uiKey] = true;
      });
    }
    setGranted(initialGranted);
  };

  const changeDirector = () => {
    setSelectedId(null);
    setGranted({});
  };

  const handleRemove = (assistantId) => {
    if (selectedId === assistantId) {
      setSelectedId(null);
      setGranted({});
    }
    onRemove(assistantId);
  };

  const togglePermission = (key) =>
    setGranted((prev) => ({ ...prev, [key]: !prev[key] }));

  const setAllPermissions = (value) => {
    const next = {};
    if (value) ASSISTANT_PERMISSIONS.forEach((permission) => (next[permission.key] = true));
    setGranted(next);
  };

  const grantedCount = ASSISTANT_PERMISSIONS.filter(
    (permission) => granted[permission.key]
  ).length;

  const handleAssign = () => {
    if (!selectedDirector) return;
    const permissionKeys = ASSISTANT_PERMISSIONS.filter(
      (permission) => granted[permission.key]
    ).map((permission) => permission.key);

    onAssign(selectedDirector, permissionKeys);
    onClose();
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={onClose}
      footer={null}
      width={1024}
      centered
      destroyOnClose
      style={{ top: 24, maxWidth: "calc(100vw - 24px)" }}
      closeIcon={<FiX className="text-lg text-gray-400 transition-colors hover:text-gray-600" />}
      className="manage-camp-modal"
      styles={{
        body: { padding: 0, overflow: "hidden", borderRadius: 14 },
        content: { borderRadius: 14, overflow: "hidden", padding: 0 },
        mask: { backdropFilter: "blur(4px)" },
      }}
    >
      <div className="flex max-h-[min(85vh,900px)] flex-col">
        {/* ── Header ── */}
        <div className="border-b border-gray-100 bg-linear-to-r from-primary/10 to-primary/5 px-5 pb-5 pt-6 sm:px-7">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">
            Camp Settings
          </p>
          <h3 className="mt-1 text-xl font-bold text-gray-900">Manage Camp</h3>
          <p className="mt-1 text-sm text-gray-500">
            {campName
              ? `Assign an assistant director to help manage “${campName}”.`
              : "Assign an assistant director to help manage this camp."}
          </p>
        </div>

        {/* ── Scrollable content ── */}
        <div className="space-y-6 overflow-y-auto px-5 py-5 sm:px-7">
          {/* Assigned assistants */}
          <section>
            <SectionHeading
              title="Assigned Assistants"
              right={
                assistants.length > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                    <LuUsers className="text-[13px]" />
                    {assistants.length}
                  </span>
                ) : null
              }
            />

            {assistants.length > 0 ? (
              <div className="space-y-2.5">
                {assistants.map((assistant) => (
                  <AssignedAssistantRow
                    key={assistant.id}
                    assistant={assistant}
                    onRemove={handleRemove}
                    onEdit={selectDirector}
                    isSelected={selectedId === assistant.id}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50/60 px-4 py-4 text-sm text-gray-500">
                <LuInbox className="shrink-0 text-lg text-gray-400" />
                No assistant assigned yet — search below to assign one.
              </div>
            )}
          </section>

          {/* Assign a new assistant */}
          <section>
            <SectionHeading title="Assign a New Assistant" />

            <div className="grid gap-4 md:grid-cols-[1fr_1.05fr]">
              {/* Search + results */}
              <div className="rounded-2xl border border-gray-200 bg-gray-50/60 p-3">
                <div className="relative mb-3">
                  <FiSearch className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name or email..."
                    aria-label="Search directors by name or email"
                    className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                  {filteredDirectors.map((director) => {
                    const isSelected = selectedId === director.id;
                    const isAssigned = assignedIds.includes(director.id);
                    return (
                      <div
                        key={director.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={isSelected}
                        onClick={() => selectDirector(director)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            selectDirector(director);
                          }
                        }}
                        className={`group flex items-center gap-3 rounded-xl border p-3 transition-all duration-200 ${
                          isSelected
                            ? "border-primary/50 bg-primary/[0.06] shadow-sm"
                            : isAssigned
                              ? "cursor-pointer border-primary/20 bg-primary/[0.01] hover:border-primary/40 hover:shadow-sm"
                              : "cursor-pointer border-gray-200 bg-white hover:border-primary/40 hover:shadow-sm"
                        }`}
                      >
                        <DirectorAvatar name={director.name} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {director.name}
                          </p>
                          <p className="truncate text-xs text-gray-500">
                            {director.email}
                          </p>
                        </div>

                        {isSelected ? (
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                            <FiCheck className="text-sm" />
                          </span>
                        ) : isAssigned ? (
                          <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                            Assigned
                          </span>
                        ) : (
                          <FiUserPlus className="shrink-0 text-lg text-gray-300" />
                        )}
                      </div>
                    );
                  })}

                  {filteredDirectors.length === 0 && (
                    <div className="py-10 text-center">
                      <FiSearch className="mx-auto mb-2 text-2xl text-gray-300" />
                      <p className="text-sm text-gray-500">
                        No directors found for “{search}”
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Permissions */}
              <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-4">
                {selectedDirector ? (
                  <>
                    <div className="mb-3 flex items-center gap-3 rounded-xl bg-primary/[0.05] p-3">
                      <DirectorAvatar name={selectedDirector.name} size={36} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-800">
                          {selectedDirector.name}
                        </p>
                        <p className="truncate text-xs text-gray-500">
                          {selectedDirector.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={changeDirector}
                        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:border-primary hover:text-primary"
                      >
                        <FiArrowLeft className="text-[13px]" />
                        Change
                      </button>
                    </div>

                    <div className="mb-3 flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold text-gray-800">
                        Grant Permissions
                        <span className="ml-1.5 text-xs font-normal text-gray-400">
                          {grantedCount}/{ASSISTANT_PERMISSIONS.length} selected
                        </span>
                      </p>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setAllPermissions(true)}
                          className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                        >
                          Select all
                        </button>
                        <span className="text-gray-300">·</span>
                        <button
                          type="button"
                          onClick={() => setAllPermissions(false)}
                          className="cursor-pointer rounded-md px-2 py-1 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-100"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {ASSISTANT_PERMISSIONS.map((permission) => (
                        <PermissionToggle
                          key={permission.key}
                          permission={permission}
                          checked={!!granted[permission.key]}
                          onChange={() => togglePermission(permission.key)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center py-12 text-center">
                    <span className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">
                      <LuShieldCheck className="text-2xl" />
                    </span>
                    <p className="text-sm font-semibold text-gray-700">
                      Choose a director
                    </p>
                    <p className="mt-1 max-w-[240px] text-xs leading-relaxed text-gray-500">
                      Select a director from the list to set the permissions
                      they will get on this camp.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 sm:px-7">
          <p className="hidden text-xs text-gray-500 sm:block">
            {selectedDirector
              ? `${assignedIds.includes(selectedDirector.id) ? "Updating" : "Assigning"} ${selectedDirector.name} with ${grantedCount} permission${grantedCount === 1 ? "" : "s"}.`
              : "Assigned assistants get access based on the permissions you grant."}
          </p>
          <div className="ml-auto flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 cursor-pointer justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 sm:flex-none"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAssign}
              disabled={!selectedDirector}
              className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-[#0099d4] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
            >
              <LuShieldCheck className="text-base" />
              {selectedDirector && assignedIds.includes(selectedDirector.id) ? "Update Permissions" : "Assign Assistant"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ManageCampModal;
