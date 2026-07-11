import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Daily Focus Briefing",
      align: "center",
      bold: true,
      size: { width: 2, height: 2 },
    },
    {
      type: "br",
    },
    {
      type: "row",
      left: { content: "Date" },
      right: { content: "Tue, 14 Jul 2026" },
    },
    {
      type: "row",
      left: { content: "Mode" },
      right: { content: "Deep work" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "token",
      title: "TODAY'S FOCUS",
      content: "Finish the proposal and send it before 15:00",
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Schedule",
      align: "center",
      bold: true,
    },
    {
      type: "timeline",
      items: [
        { label: "08:30", description: "Plan the day and clear quick replies" },
        {
          label: "09:00",
          description: "Proposal focus block, notifications off",
        },
        { label: "12:30", description: "Lunch and a short walk" },
        { label: "14:00", description: "Review the proposal with Joe" },
        { label: "16:00", description: "Admin, inbox, and tomorrow's notes" },
      ],
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Priority progress",
      align: "center",
      bold: true,
    },
    {
      type: "progress",
      variant: "steps",
      value: 1,
      max: 4,
      steps: 4,
      style: "squares",
    },
    {
      type: "br",
    },
    {
      type: "row",
      left: { content: "Completed" },
      right: { content: "1 of 4" },
    },
    {
      type: "row",
      left: { content: "Next" },
      right: { content: "Review pricing" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "text",
      content: "Protect 09:00-11:00 for today's focus.",
      align: "center",
    },
  ],
} as const satisfies PrintRequest;
