import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Goal Progress",
      align: "center",
      bold: true,
      size: { width: 2, height: 2 },
    },
    {
      type: "br",
    },
    {
      type: "row",
      left: { content: "Goal" },
      right: { content: "Launch portfolio" },
    },
    {
      type: "row",
      left: { content: "Target" },
      right: { content: "31 Aug 2026" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "token",
      title: "NEXT MILESTONE",
      content: "Publish the first draft",
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Overall progress",
      align: "center",
      bold: true,
    },
    {
      type: "progress",
      variant: "bar",
      value: 62,
      max: 100,
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Milestones completed",
      align: "center",
      bold: true,
    },
    {
      type: "progress",
      variant: "steps",
      value: 3,
      max: 5,
      steps: 5,
      style: "circles",
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Progress by week",
      align: "center",
      bold: true,
    },
    {
      type: "lineChart",
      series: [{ label: "Complete", values: [18, 30, 39, 48, 56, 62] }],
      xLabels: ["W1", "W2", "W3", "W4", "W5", "W6"],
      yMin: 0,
      yMax: 100,
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Recent and next milestones",
      align: "center",
      bold: true,
    },
    {
      type: "timeline",
      items: [
        { label: "02 Jul", description: "Selected the final case studies" },
        { label: "10 Jul", description: "Completed the visual assets" },
        {
          label: "18 Jul",
          description: "Write the remaining project summaries",
        },
        {
          label: "25 Jul",
          description: "Review on mobile and publish the draft",
        },
      ],
    },
    {
      type: "br",
    },
    {
      type: "qrcode",
      content: "https://example.com/goals/portfolio",
      align: "center",
      model: "model2",
      cellSize: 4,
      correction: "M",
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Scan for the complete plan and working files.",
      align: "center",
    },
  ],
} as const satisfies PrintRequest;
