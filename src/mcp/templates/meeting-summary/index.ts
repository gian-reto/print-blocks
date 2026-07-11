import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A concise meeting recap with decisions, dated action items, follow-up progress, and a link to the full notes.",
  id: "meeting-summary",
  instructions,
  tags: ["meeting", "summary", "timeline", "progress", "qrcode"],
  template,
  title: "Meeting summary and action plan",
} as const satisfies PrintTemplate;
