import { useMemo } from "react";
import { Tooltip } from "react-tooltip";
import CalendarHeatmap from "react-calendar-heatmap";

function UserProgress({ allSubmission }) {
  const getCurrentYearStart = () => {
    const now = new Date();
    return new Date(now.getFullYear(), 0, 1);
  };

  const getCurrentYearEnd = () => {
    const now = new Date();
    return new Date(now.getFullYear(), 12, 31);
  };

  const generateFullYearHeatmapData = () => {
    const start = getCurrentYearStart();
    const end = getCurrentYearEnd();
    const data = {};

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().split("T")[0];
      data[key] = 0;
    }

    allSubmission.forEach((sub) => {
      const date = new Date(sub.createdAt).toISOString().split("T")[0];
      if (data[date] !== undefined) {
        data[date] += 1;
      }
    });

    return Object.entries(data).map(([date, count]) => ({ date, count }));
  };

  const heatmapData = useMemo(
    () => generateFullYearHeatmapData(),
    [allSubmission]
  );
  return (
    <div className="w-full h-[200px]">
      <CalendarHeatmap
        startDate={new Date("2025-01-01")}
        endDate={new Date("2026-01-01")}
        values={heatmapData}
        showWeekdayLabels={true}
        classForValue={(value) => {
          if (!value || !value.date || value.count === 0) return "color-empty";
          if (value.count >= 5) return "color-github-4";
          if (value.count >= 3) return "color-github-3";
          if (value.count >= 2) return "color-github-2";
          return "color-github-1";
        }}
        tooltipDataAttrs={(value) => {
          const date = value?.date ? new Date(value.date) : null;
          if (!date || isNaN(date.getTime())) return {};

          const formattedDate = date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });

          return {
            "data-tooltip-id": "heatmap-tooltip",
            "data-tooltip-content": value.count
              ? `${value.count} submission${
                  value.count > 1 ? "s" : ""
                } on ${formattedDate}`
              : `No submissions on ${formattedDate}`,
          };
        }}
      />

      <Tooltip id="heatmap-tooltip" place="top" />
    </div>
  );
}

export default UserProgress;
