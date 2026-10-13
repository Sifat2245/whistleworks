const aliases = {
  area: "line",
  donut: "doughnut",
  horizontal_bar: "bar",
  horizontalbar: "bar",
  stacked_bar: "bar",
  polar: "polarArea",
  polar_area: "polarArea",
  polararea: "polarArea",
};
const supported = new Set([
  "line",
  "bar",
  "pie",
  "doughnut",
  "radar",
  "scatter",
  "bubble",
  "polarArea",
]);
const colors = [
  "#00AEEF",
  "#10B981",
  "#8B5CF6",
  "#F59E0B",
  "#F43F5E",
  "#64748B",
];
const normalizeType = (type) => aliases[String(type).toLowerCase()] || type;
const numeric = (value) =>
  value !== null &&
  value !== "" &&
  typeof value !== "boolean" &&
  Number.isFinite(Number(value))
    ? Number(value)
    : null;
const point = (value) => {
  if (value === null || typeof value !== "object") return numeric(value);
  const y = numeric(value.y);
  if (y === null) return null;
  return {
    x: typeof value.x === "string" ? value.x : numeric(value.x),
    y,
    ...(value.r !== undefined ? { r: numeric(value.r) ?? 0 } : {}),
  };
};

export const buildAiChartConfig = (payload, reduced = false) => {
  if (!payload || typeof payload !== "object") return null;
  const originalType = payload.chart_type || payload.type || "line";
  const type = normalizeType(originalType);
  const data = payload.data?.datasets ? payload.data : payload;
  if (
    !supported.has(type) ||
    !Array.isArray(data.datasets) ||
    !data.datasets.some(
      (dataset) => Array.isArray(dataset?.data) && dataset.data.length,
    )
  )
    return null;
  const datasets = data.datasets
    .filter((dataset) => Array.isArray(dataset?.data))
    .map((dataset, index) => {
      const color = colors[index % colors.length];
      const result = {
        label: dataset.label || `Series ${index + 1}`,
        data: dataset.data.map(point),
        borderColor: dataset.borderColor || color,
        backgroundColor: dataset.backgroundColor || color,
        borderWidth: dataset.borderWidth ?? 2,
        pointRadius: dataset.pointRadius ?? 3,
        tension: dataset.tension ?? 0.3,
        fill: originalType === "area" ? true : (dataset.fill ?? false),
      };
      if (supported.has(normalizeType(dataset.type)))
        result.type = normalizeType(dataset.type);
      for (const key of [
        "borderDash",
        "stack",
        "order",
        "pointStyle",
        "spanGaps",
        "stepped",
        "hidden",
      ])
        if (dataset[key] !== undefined) result[key] = dataset[key];
      if (
        ["pie", "doughnut", "polarArea"].includes(type) &&
        !dataset.backgroundColor
      )
        result.backgroundColor = dataset.data.map(
          (_, i) => colors[i % colors.length],
        );
      return result;
    });
  const axis = (value = {}, beginAtZero = false) => ({
    ...(Number.isFinite(value.min) ? { min: value.min } : {}),
    ...(Number.isFinite(value.max) ? { max: value.max } : {}),
    ...(value.title ? { title: { display: true, text: value.title } } : {}),
    beginAtZero,
    grid: { color: "#e2e8f060" },
  });
  const horizontal =
    ["horizontal_bar", "horizontalbar"].includes(
      String(originalType).toLowerCase(),
    ) || payload.options?.indexAxis === "y";
  const stacked =
    originalType === "stacked_bar" ||
    payload.stacked === true ||
    payload.options?.scales?.x?.stacked === true;
  let scales;
  if (["radar", "polarArea"].includes(type))
    scales = { r: axis(payload.y_axis, true) };
  else if (!["pie", "doughnut"].includes(type))
    scales = {
      x: { ...axis(payload.x_axis), stacked },
      y: { ...axis(payload.y_axis, true), stacked },
    };
  return {
    type,
    data: {
      labels: Array.isArray(data.labels) ? data.labels.map(String) : [],
      datasets,
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: reduced ? false : { duration: 500 },
      indexAxis: horizontal ? "y" : "x",
      plugins: {
        legend: {
          position: "bottom",
          labels: { usePointStyle: true, padding: 20 },
        },
        tooltip: { enabled: true },
      },
      ...(scales ? { scales } : {}),
    },
  };
};

export const chartDataTable = (config) => {
  const { labels, datasets } = config.data;
  const count = Math.max(
    labels.length,
    ...datasets.map((dataset) => dataset.data.length),
  );
  return {
    title: "Chart data",
    headers: ["Label", ...datasets.map((dataset) => dataset.label)],
    rows: Array.from({ length: count }, (_, index) => [
      labels[index] ?? `Point ${index + 1}`,
      ...datasets.map((dataset) => dataset.data[index] ?? null),
    ]),
  };
};
