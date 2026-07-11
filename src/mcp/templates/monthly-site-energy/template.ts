import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Monthly Site Energy",
      align: "center",
      bold: true,
    },
    {
      type: "row",
      left: { content: "Site" },
      right: { content: "North Warehouse" },
    },
    {
      type: "row",
      left: { content: "Period" },
      right: { content: "May 2026" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "text",
      content: "Energy mix by week",
      align: "center",
      bold: true,
    },
    {
      type: "stackedAreaChart",
      series: [
        { label: "Solar", values: [95, 120, 135, 150, 140] },
        { label: "Grid", values: [65, 58, 52, 70, 74] },
        { label: "Battery", values: [24, 32, 36, 40, 38] },
      ],
      xLabels: ["W1", "W2", "W3", "W4", "W5"],
    },
    {
      type: "text",
      content: "Daily site load",
      align: "center",
      bold: true,
    },
    {
      type: "areaChart",
      series: {
        label: "kWh",
        values: [42, 48, 45, 52, 55, 61, 58, 60],
      },
      xLabels: ["1", "5", "9", "13", "17", "21", "25", "29"],
      yMin: 35,
      yMax: 65,
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "row",
      left: { content: "Solar" },
      right: { content: "640 kWh" },
    },
    {
      type: "row",
      left: { content: "Grid" },
      right: { content: "319 kWh" },
    },
    {
      type: "row",
      left: { content: "Battery" },
      right: { content: "170 kWh" },
    },
    {
      type: "row",
      left: { content: "Self-use" },
      right: { content: "67%" },
    },
    {
      type: "text",
      content: "Review grid peaks in W4 and W5.",
      align: "center",
    },
  ],
} as const satisfies PrintRequest;
