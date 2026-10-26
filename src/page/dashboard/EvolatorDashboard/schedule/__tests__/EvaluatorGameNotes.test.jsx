import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthContext } from "@/context";
import Schedule from "@/page/dashboard/EvolatorDashboard/schedule/Schedule";

const api = vi.hoisted(() => ({
  roster: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}));
vi.mock("@/services/evaluator-services/evaluator-schedule.service", () => ({
  useEvaluatorScheduleService: () => ({
    getCampRosterDetails: api.roster,
    createEvaluationNote: api.create,
    updateEvaluationNote: api.update,
    deleteEvaluationNote: api.remove,
  }),
}));
vi.mock(
  "@/page/dashboard/director-dashboard/camp-schedules/components/ScheduleRefereeModal",
  () => ({ default: () => null }),
);
vi.mock(
  "@/page/dashboard/director-dashboard/camp-schedules/components/CrewDetailsModal",
  () => ({ default: () => null }),
);

const initialSlots = () => [
  {
    id: 12447,
    game_date: "2026-05-08",
    start_time: "14:16:00",
    end_time: "15:16:00",
    timezone: "America/Chicago",
    court_name: "Court 1",
    status: "available",
    address: "National University",
    evaluator_note: null,
    evaluator_note_id: null,
    assignments: [],
  },
  {
    id: 12448,
    game_date: "2026-05-08",
    start_time: "15:16:00",
    end_time: "16:16:00",
    timezone: "America/Chicago",
    court_name: "Court 2",
    status: "available",
    address: "National University",
    evaluator_note: null,
    evaluator_note_id: null,
    assignments: [],
  },
];
let slots;
const ok = () => ({ data: { success: true } });
beforeEach(() => {
  vi.clearAllMocks();
  slots = initialSlots();
  api.roster.mockImplementation(async () => ({
    data: {
      data: { camp: { schedule: { game_courts: structuredClone(slots) } } },
    },
  }));
  api.create.mockImplementation(async (body) => {
    const slot = slots.find((slot) => slot.id === body.game_slot_id);
    slot.evaluator_note = body.note;
    slot.evaluator_note_id = 91;
    return ok();
  });
  api.update.mockImplementation(async (id, body) => {
    slots.find((slot) => slot.evaluator_note_id === id).evaluator_note =
      body.note;
    return ok();
  });
  api.remove.mockImplementation(async (id) => {
    const slot = slots.find((slot) => slot.evaluator_note_id === id);
    slot.evaluator_note = null;
    slot.evaluator_note_id = null;
    return ok();
  });
});
function renderSchedule(role = "evaluator") {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <AuthContext.Provider value={{ userData: { role } }}>
      <QueryClientProvider client={client}>
        <MemoryRouter>
          <Schedule camp_id={10} />
        </MemoryRouter>
      </QueryClientProvider>
    </AuthContext.Provider>,
  );
}
async function openNote(user, existing = false, index = 0) {
  const buttons = await screen.findAllByRole("button", {
    name: new RegExp(
      `${existing ? "View or edit" : "Add"} evaluator note for Court 1`,
    ),
  });
  await user.click(buttons[index]);
  return screen.findByRole("dialog", { name: "Evaluator note" });
}

describe("Evaluator game notes", () => {
  it("creates, reloads, updates and deletes the same slot's note using its server ID", async () => {
    const user = userEvent.setup();
    renderSchedule();
    let dialog = await openNote(user);
    expect(within(dialog).getByText("2:16 PM - 3:16 PM")).toBeInTheDocument();
    expect(within(dialog).getByText("CDT")).toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: "Save note" }),
    ).toBeDisabled();
    await user.type(
      within(dialog).getByRole("textbox", { name: "Game note" }),
      "  Watch transition coverage  ",
    );
    await user.click(within(dialog).getByRole("button", { name: "Save note" }));
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Evaluator note" }),
      ).not.toBeInTheDocument(),
    );
    expect(api.create).toHaveBeenCalledWith({
      camp_id: 10,
      note: "Watch transition coverage",
      game_slot_id: 12447,
    });
    expect(api.roster).toHaveBeenCalledTimes(2);
    expect(screen.getAllByText("Watch transition coverage")).toHaveLength(2);
    expect(slots[1].evaluator_note).toBeNull();

    dialog = await openNote(user, true);
    const input = within(dialog).getByRole("textbox", { name: "Game note" });
    expect(input).toHaveValue("Watch transition coverage");
    await user.clear(input);
    await user.type(input, "Updated observation");
    await user.click(
      within(dialog).getByRole("button", { name: "Update note" }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Evaluator note" }),
      ).not.toBeInTheDocument(),
    );
    expect(api.update).toHaveBeenCalledWith(91, {
      note: "Updated observation",
    });
    expect(api.create).toHaveBeenCalledTimes(1);

    dialog = await openNote(user, true);
    await user.click(
      within(dialog).getByRole("button", { name: "Delete note" }),
    );
    expect(api.remove).not.toHaveBeenCalled();
    expect(within(dialog).getByRole("alert")).toHaveFocus();
    await user.click(within(dialog).getByRole("button", { name: "Keep note" }));
    expect(
      within(dialog).getByRole("textbox", { name: "Game note" }),
    ).toHaveValue("Updated observation");
    expect(
      within(dialog).getByRole("textbox", { name: "Game note" }),
    ).toHaveFocus();
    await user.click(
      within(dialog).getByRole("button", { name: "Delete note" }),
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Confirm delete" }),
    );
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Evaluator note" }),
      ).not.toBeInTheDocument(),
    );
    expect(api.remove).toHaveBeenCalledWith(91);
    expect(api.roster).toHaveBeenCalledTimes(4);
    expect(screen.queryByText("Updated observation")).not.toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: /Add evaluator note for Court 1/ }),
    ).toHaveLength(2);
  });
  it.each(["director", "referee"])(
    "hides note contents and controls from the %s UI",
    async (role) => {
      slots[0].evaluator_note = "Evaluator-only observation";
      slots[0].evaluator_note_id = 91;
      renderSchedule(role);
      await screen.findByText("Games Overview");
      expect(
        screen.queryByText("Evaluator-only observation"),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /evaluator note/ }),
      ).not.toBeInTheDocument();
      expect(api.create).not.toHaveBeenCalled();
    },
  );
  it("opens the same note editor from the mobile card", async () => {
    const user = userEvent.setup();
    renderSchedule();
    const dialog = await openNote(user, false, 1);
    expect(
      within(dialog).getByRole("textbox", { name: "Game note" }),
    ).toHaveValue("");
    expect(api.create).not.toHaveBeenCalled();
  });
  it("keeps the draft visible when saving fails and allows retry", async () => {
    api.create.mockRejectedValueOnce({
      response: { data: { message: "Unable to save this note" } },
    });
    const user = userEvent.setup();
    renderSchedule();
    const dialog = await openNote(user);
    await user.type(
      within(dialog).getByRole("textbox", { name: "Game note" }),
      "Keep my draft",
    );
    await user.click(within(dialog).getByRole("button", { name: "Save note" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "Unable to save this note",
    );
    expect(
      within(dialog).getByRole("textbox", { name: "Game note" }),
    ).toHaveValue("Keep my draft");
    await user.click(within(dialog).getByRole("button", { name: "Save note" }));
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Evaluator note" }),
      ).not.toBeInTheDocument(),
    );
    expect(api.create).toHaveBeenCalledTimes(2);
  });
  it("handles a success:false API response as an error", async () => {
    api.create.mockResolvedValueOnce({
      data: { success: false, message: "Evaluator access denied" },
    });
    const user = userEvent.setup();
    renderSchedule();
    const dialog = await openNote(user);
    await user.type(
      within(dialog).getByRole("textbox", { name: "Game note" }),
      "My observation",
    );
    await user.click(within(dialog).getByRole("button", { name: "Save note" }));
    expect(await within(dialog).findByRole("alert")).toHaveTextContent(
      "Evaluator access denied",
    );
    expect(api.roster).toHaveBeenCalledTimes(1);
  });
  it("disables repeat submissions and closing while a request is pending", async () => {
    let resolve;
    api.create.mockImplementationOnce(
      () =>
        new Promise((done) => {
          resolve = done;
        }),
    );
    const user = userEvent.setup();
    renderSchedule();
    const dialog = await openNote(user);
    await user.type(
      within(dialog).getByRole("textbox", { name: "Game note" }),
      "Pending note",
    );
    await user.click(within(dialog).getByRole("button", { name: "Save note" }));
    expect(
      within(dialog).getByRole("textbox", { name: "Game note" }),
    ).toBeDisabled();
    expect(
      within(dialog).getByRole("button", { name: "Cancel" }),
    ).toBeDisabled();
    await user.keyboard("{Escape}");
    expect(dialog).toBeInTheDocument();
    expect(api.create).toHaveBeenCalledTimes(1);
    await act(async () => resolve(ok()));
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Evaluator note" }),
      ).not.toBeInTheDocument(),
    );
  });
  it("retains a saved note if deletion fails", async () => {
    slots[0].evaluator_note = "Keep this saved note";
    slots[0].evaluator_note_id = 91;
    api.remove.mockRejectedValueOnce(new Error("Delete failed"));
    const user = userEvent.setup();
    renderSchedule();
    const dialog = await openNote(user, true);
    await user.click(
      within(dialog).getByRole("button", { name: "Delete note" }),
    );
    await user.click(
      within(dialog).getByRole("button", { name: "Confirm delete" }),
    );
    expect(
      await within(dialog).findByText("Delete failed"),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByRole("textbox", { name: "Game note" }),
    ).toHaveValue("Keep this saved note");
    expect(api.roster).toHaveBeenCalledTimes(1);
  });
  it("does not create a duplicate when an existing note is missing its ID", async () => {
    slots[0].evaluator_note = "Existing note without an ID";
    const user = userEvent.setup();
    renderSchedule();
    const dialog = await openNote(user, true);
    expect(within(dialog).getByRole("status")).toHaveTextContent(
      "missing its ID",
    );
    expect(
      within(dialog).getByRole("button", { name: "Save note" }),
    ).toBeDisabled();
    expect(
      within(dialog).queryByRole("button", { name: "Delete note" }),
    ).not.toBeInTheDocument();
    expect(api.create).not.toHaveBeenCalled();
  });
});
