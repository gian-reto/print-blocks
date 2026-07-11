import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A daily planning slip with one highlighted focus, a schedule, priority progress, and a practical reminder.",
  id: "daily-focus-briefing",
  instructions,
  tags: ["productivity", "briefing", "token", "timeline", "progress"],
  template,
  title: "Daily focus briefing",
} as const satisfies PrintTemplate;
