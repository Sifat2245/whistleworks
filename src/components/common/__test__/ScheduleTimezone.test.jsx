import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ScheduleTimezone from "@/components/common/ScheduleTimezone";

describe("Schedule timezone labels", () => {
  it("deduplicates the actual zones returned for a time slot", () => {
    render(
      <ScheduleTimezone
        date="2026-05-08"
        time="13:16:00"
        timezones={[
          "America/Chicago",
          "America/Chicago",
          null,
          "America/New_York",
        ]}
      />,
    );
    expect(screen.getAllByText("CDT")).toHaveLength(1);
    expect(screen.getByText("EDT")).toBeInTheDocument();
    expect(screen.getByTitle("Timezone: America/Chicago")).toHaveTextContent(
      "CDT",
    );
  });
  it("renders nothing for an absent timezone", () => {
    const { container } = render(<ScheduleTimezone />);
    expect(container).toBeEmptyDOMElement();
  });
});
