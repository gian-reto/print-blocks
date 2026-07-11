import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Budget & Bills",
      align: "center",
      bold: true,
      size: { width: 2, height: 2 },
    },
    {
      type: "br",
    },
    {
      type: "row",
      left: { content: "Period" },
      right: { content: "July 2026" },
    },
    {
      type: "row",
      left: { content: "Monthly budget" },
      right: { content: "CHF 3,200" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "text",
      content: "Budget used",
      align: "center",
      bold: true,
    },
    {
      type: "progress",
      variant: "bar",
      value: 2140,
      max: 3200,
    },
    {
      type: "br",
    },
    {
      type: "row",
      left: { content: "Spent" },
      right: { content: "CHF 2,140" },
    },
    {
      type: "row",
      left: { content: "Remaining", bold: true },
      right: { content: "CHF 1,060", bold: true },
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Spending by category",
      align: "center",
      bold: true,
    },
    {
      type: "barChart",
      items: [
        { label: "Housing", value: 1200 },
        { label: "Food", value: 410 },
        { label: "Travel", value: 210 },
        { label: "Utilities", value: 190 },
        { label: "Other", value: 130 },
      ],
      yMax: 1200,
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Upcoming bills",
      align: "center",
      bold: true,
    },
    {
      type: "timeline",
      items: [
        {
          label: "18 Jul",
          description: "Internet (CHF 59, automatic payment)",
        },
        {
          label: "22 Jul",
          description: "Insurance (CHF 180, review before payment)",
        },
        { label: "28 Jul", description: "Electricity (CHF 95, estimated)" },
      ],
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "text",
      content:
        "Keep discretionary spending below CHF 250 for the rest of the month.",
      align: "center",
    },
  ],
} as const satisfies PrintRequest;
