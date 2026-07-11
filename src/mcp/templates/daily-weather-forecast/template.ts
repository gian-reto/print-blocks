import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Daily Weather Forecast",
      align: "center",
      bold: true,
    },
    {
      type: "row",
      left: { content: "Location" },
      right: { content: "Zurich" },
    },
    {
      type: "row",
      left: { content: "Updated" },
      right: { content: "07:00" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "text",
      content: "Temperature",
      align: "center",
      bold: true,
    },
    {
      type: "lineChart",
      series: [{ label: "Temp", values: [7, 9, 12, 15, 14, 11, 8] }],
      xLabels: ["06", "09", "12", "15", "18", "21", "00"],
      yMin: 4,
      yMax: 18,
    },
    {
      type: "text",
      content: "Rain chance",
      align: "center",
      bold: true,
    },
    {
      type: "barChart",
      items: [
        { label: "06", value: 10 },
        { label: "09", value: 20 },
        { label: "12", value: 35 },
        { label: "15", value: 45 },
        { label: "18", value: 30 },
        { label: "21", value: 15 },
        { label: "00", value: 10 },
      ],
      yMax: 100,
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "row",
      left: { content: "High" },
      right: { content: "15 deg C" },
    },
    {
      type: "row",
      left: { content: "Low" },
      right: { content: "7 deg C" },
    },
    {
      type: "row",
      left: { content: "Wind" },
      right: { content: "12 km/h NW" },
    },
    {
      type: "text",
      content: "Pack a light rain jacket.",
      align: "center",
    },
  ],
} as const satisfies PrintRequest;
