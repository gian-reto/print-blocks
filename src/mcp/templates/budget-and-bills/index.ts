import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A monthly finance snapshot with budget consumption, category spending, upcoming bills, and a practical spending note.",
  id: "budget-and-bills",
  instructions,
  tags: ["budget", "bills", "progress", "barChart", "timeline"],
  template,
  title: "Budget and upcoming bills",
} as const satisfies PrintTemplate;
