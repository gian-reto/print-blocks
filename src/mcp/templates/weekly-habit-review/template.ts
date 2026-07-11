import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Weekly Habit Review",
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
      right: { content: "17 Jun - 14 Jul" },
    },
    {
      type: "row",
      left: { content: "Habits tracked" },
      right: { content: "4" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "text",
      content: "Daily completions, last 4 weeks",
      align: "center",
      bold: true,
    },
    {
      type: "heatmap",
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [
        [2, 3, 4, 3, 1, 4, 3],
        [3, 4, 4, 2, 3, 4, 4],
        [4, 3, 4, 4, 2, 3, 4],
        [4, 4, 3, 4, 3, 4, 2],
      ],
    },
    {
      type: "row",
      left: { content: "Completion" },
      right: { content: "82%", bold: true },
    },
    {
      type: "row",
      left: { content: "Best streak" },
      right: { content: "9 days" },
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "This week's progress",
      align: "center",
      bold: true,
    },
    {
      type: "progress",
      variant: "steps",
      value: 24,
      max: 28,
      steps: 7,
      style: "circles",
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Completions by habit",
      align: "center",
      bold: true,
    },
    {
      type: "barChart",
      items: [
        { label: "Move", value: 7 },
        { label: "Read", value: 6 },
        { label: "Water", value: 7 },
        { label: "Sleep", value: 4 },
      ],
      yMax: 7,
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "text",
      content: "Next week: start evening routine before 22:30.",
      align: "center",
    },
  ],
} as const satisfies PrintRequest;
