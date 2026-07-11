import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A reusable goal card with overall progress, milestone completion, a weekly trend, dated milestones, and the next target.",
  id: "goal-progress",
  instructions,
  tags: ["goal", "project", "progress", "lineChart", "timeline"],
  template,
  title: "Goal or project progress",
} as const satisfies PrintTemplate;
