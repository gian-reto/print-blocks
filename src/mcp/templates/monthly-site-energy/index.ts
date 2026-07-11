import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A monthly energy report with weekly energy mix, daily load trend, totals, and an action note.",
  id: "monthly-site-energy",
  instructions,
  tags: ["energy", "site", "stackedAreaChart", "areaChart"],
  template,
  title: "Monthly site energy",
} as const satisfies PrintTemplate;
