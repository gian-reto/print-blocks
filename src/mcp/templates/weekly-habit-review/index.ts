import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A four-week habit review with an activity heatmap, weekly progress, habit totals, streaks, and a next-week focus.",
  id: "weekly-habit-review",
  instructions,
  tags: ["habits", "wellness", "heatmap", "progress", "barChart"],
  template,
  title: "Weekly habit and wellness review",
} as const satisfies PrintTemplate;
