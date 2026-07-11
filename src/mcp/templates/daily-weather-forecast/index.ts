import type { PrintTemplate } from "../types";
import instructions from "./instructions.md?raw";
import { template } from "./template";

export const printTemplate = {
  description:
    "A daily weather slip with forecast metadata, temperature trend, rain probability, and summary rows.",
  id: "daily-weather-forecast",
  instructions,
  tags: ["weather", "forecast", "lineChart", "barChart"],
  template,
  title: "Daily weather forecast",
} as const satisfies PrintTemplate;
