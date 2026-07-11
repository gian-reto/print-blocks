import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A kitchen-friendly recipe card with timing, ingredients, sequential preparation steps, and a link to extended notes.",
  id: "recipe-card",
  instructions,
  tags: ["recipe", "cooking", "token", "timeline", "qrcode"],
  template,
  title: "Recipe and kitchen prep card",
} as const satisfies PrintTemplate;
