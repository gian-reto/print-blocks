import type { PrintRequest } from "../../../render/blocks/schema";

export const template = {
  blocks: [
    {
      type: "text",
      content: "Meeting Summary",
      align: "center",
      bold: true,
      size: { width: 2, height: 2 },
    },
    {
      type: "br",
    },
    {
      type: "row",
      left: { content: "Topic" },
      right: { content: "Website launch" },
    },
    {
      type: "row",
      left: { content: "Date" },
      right: { content: "14 Jul 2026" },
    },
    {
      type: "row",
      left: { content: "Attendees" },
      right: { content: "John, Jane, Joe" },
    },
    {
      type: "line",
      character: "-",
    },
    {
      type: "text",
      content: "Decisions",
      align: "center",
      bold: true,
    },
    {
      type: "text",
      content: "- Launch remains scheduled for Friday.",
    },
    {
      type: "text",
      content: "- Keep the current onboarding flow.",
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Action items",
      align: "center",
      bold: true,
    },
    {
      type: "timeline",
      items: [
        {
          label: "15 Jul",
          description: "John: Send the final copy for approval",
        },
        {
          label: "16 Jul",
          description: "Jane: Verify analytics events in staging",
        },
        {
          label: "18 Jul",
          description: "Joe: Publish the launch support schedule",
        },
      ],
    },
    {
      type: "br",
    },
    {
      type: "text",
      content: "Follow-up progress",
      align: "center",
      bold: true,
    },
    {
      type: "progress",
      variant: "bar",
      value: 1,
      max: 3,
    },
    {
      type: "br",
    },
    {
      type: "qrcode",
      content: "https://example.com/meetings/website-launch",
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
      content: "Scan for the complete notes and original meeting transcript.",
      align: "center",
    },
  ],
} as const satisfies PrintRequest;
