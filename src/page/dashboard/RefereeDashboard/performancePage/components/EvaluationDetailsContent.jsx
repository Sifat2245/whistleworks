import { format, isValid, parseISO } from "date-fns";
import { LuCalendar, LuMessageSquareQuote } from "react-icons/lu";

const CRITERIA_LABELS = {
  call_accuracy: "Call / No Call Accuracy",
  communication_skills: "Communication Skills",
  consistency_of_calls: "Consistency of Calls",
  court_position_mechanics: "Court Position & Mechanics",
  fitness_mobility: "Fitness & Mobility",
  game_awareness: "Game Awareness",
};

const numericValue = (value) =>
  value != null && value !== "" && Number.isFinite(Number(value))
    ? Number(value)
    : null;

const displayNumber = (value, minimumFractionDigits = 0) => {
  const number = numericValue(value);
  return number == null
    ? "—"
    : number.toLocaleString("en-US", {
        minimumFractionDigits,
        maximumFractionDigits: 3,
      });
};

function displayDate(value) {
  if (!value || typeof value !== "string") return "—";
  // Keep the API's calendar date without a browser timezone shift.
  const date = parseISO(value.slice(0, 10));
  return isValid(date) ? format(date, "MMM d, yyyy") : value;
}

export default function EvaluationDetailsContent({ evaluation }) {
  const { camp } = evaluation;
  const scores = evaluation.scores || {};
  const criteria = evaluation.performance_criteria || {};
  const submittedDate =
    evaluation.submitted_at_formatted || displayDate(evaluation.submitted_at);
  const submittedTime =
    typeof evaluation.submitted_at === "string"
      ? evaluation.submitted_at.match(/(?:T|\s)(\d{2}:\d{2}:\d{2})/)?.[1]
      : null;

  return (
    <div className="space-y-6 py-2 font-sans">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          {camp?.sports_type?.name && (
            <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-sky-700">
              {camp.sports_type.name}
            </span>
          )}
          {evaluation.status && (
            <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold capitalize text-emerald-800">
              {String(evaluation.status).replaceAll("_", " ")}
            </span>
          )}
        </div>
        {camp?.name && (
          <h3 className="break-words text-lg font-semibold leading-snug text-slate-900 sm:text-xl">
            {camp.name}
          </h3>
        )}
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
          <LuCalendar aria-hidden="true" />
          Submitted {submittedDate}
          {submittedTime && <span>· {submittedTime}</span>}
        </p>
      </header>

      <section
        aria-label="Score summary"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
      >
        <dl className="rounded-xl border border-sky-200 bg-primary/10 p-4">
          <dt className="text-xs font-medium text-sky-800">Average score</dt>
          <dd className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {displayNumber(scores.average_score, 3)}
          </dd>
          {scores.rating && (
            <dd className="mt-1 text-xs font-semibold text-sky-800">
              {scores.rating}
            </dd>
          )}
        </dl>
        <dl className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <dt className="text-xs font-medium text-slate-500">Total score</dt>
          <dd className="mt-2 text-xl font-semibold text-slate-900">
            {displayNumber(scores.total_score)}
            {scores.max_total_score != null && (
              <span className="text-sm font-normal text-slate-500">
                {" "}
                / {displayNumber(scores.max_total_score)}
              </span>
            )}
          </dd>
        </dl>
        <dl className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <dt className="text-xs font-medium text-slate-500">Percentage</dt>
          <dd className="mt-2 text-xl font-semibold text-slate-900">
            {displayNumber(scores.percentage)}
            {numericValue(scores.percentage) != null ? "%" : ""}
          </dd>
        </dl>
        <dl className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <dt className="text-xs font-medium text-slate-500">
            Highest recommendation
          </dt>
          <dd className="mt-2 break-words text-xl font-semibold text-slate-900">
            {evaluation.highest_recommended_level || "—"}
          </dd>
        </dl>
      </section>

      <section aria-label="Performance criteria">
        <h3 className="mb-3 text-sm font-semibold text-slate-900">
          Performance criteria
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {Object.entries(criteria || {}).map(([key, criterion]) => {
            const label = CRITERIA_LABELS[key] || key.replaceAll("_", " ");
            const score = numericValue(criterion?.score);
            const max = numericValue(criterion?.max_score);
            const progress =
              score != null && max > 0
                ? Math.min(100, Math.max(0, (score / max) * 100))
                : null;
            return (
              <div
                key={key}
                className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-medium leading-relaxed text-slate-700">
                    {label}
                  </p>
                  <p className="shrink-0 text-sm font-bold tabular-nums text-slate-900">
                    {displayNumber(score)}
                    <span className="text-xs font-normal text-slate-500">
                      {" "}
                      / {displayNumber(max)}
                    </span>
                  </p>
                </div>
                {progress != null && (
                  <div
                    role="meter"
                    aria-label={label}
                    aria-valuemin={0}
                    aria-valuemax={max}
                    aria-valuenow={Math.min(max, Math.max(0, score))}
                    aria-valuetext={score + " out of " + max}
                    className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"
                  >
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: progress + "%" }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {Object.keys(criteria || {}).length === 0 && (
          <p className="text-sm text-slate-500">No criteria scores provided.</p>
        )}
      </section>

      <section
        aria-label="Written feedback"
        className="rounded-xl border border-slate-200 border-l-4 border-l-primary bg-slate-50 p-4 sm:p-5"
      >
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
          <LuMessageSquareQuote aria-hidden="true" className="text-sky-700" />
          Written feedback
        </h3>
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-700">
          {evaluation.referee_feedback || "No written feedback provided."}
        </p>
      </section>
    </div>
  );
}
