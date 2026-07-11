import type {
  PrintTemplate,
  PrintTemplateInfo,
  PrintTemplateSummary,
} from "./types";

import { printTemplate as budgetAndBillsTemplate } from "./budget-and-bills";
import { printTemplate as dailyFocusBriefingTemplate } from "./daily-focus-briefing";
import { printTemplate as dailyWeatherForecastTemplate } from "./daily-weather-forecast";
import { printTemplate as goalProgressTemplate } from "./goal-progress";
import { printTemplate as guestWifiCardTemplate } from "./guest-wifi-card";
import { printTemplate as meetingSummaryTemplate } from "./meeting-summary";
import { printTemplate as monthlySiteEnergyTemplate } from "./monthly-site-energy";
import { printTemplate as pocketTripItineraryTemplate } from "./pocket-trip-itinerary";
import { printTemplate as receiptTemplate } from "./receipt";
import { printTemplate as recipeCardTemplate } from "./recipe-card";
import { printTemplate as weeklyHabitReviewTemplate } from "./weekly-habit-review";
import { unreachable } from "../../util/unreachable";

export const printTemplates = [
  budgetAndBillsTemplate,
  dailyFocusBriefingTemplate,
  dailyWeatherForecastTemplate,
  goalProgressTemplate,
  guestWifiCardTemplate,
  meetingSummaryTemplate,
  monthlySiteEnergyTemplate,
  pocketTripItineraryTemplate,
  receiptTemplate,
  recipeCardTemplate,
  weeklyHabitReviewTemplate,
];

/**
 * Returns summaries of all available print templates, which can be used for
 * listing templates without exposing the full template details.
 */
export const getPrintTemplateSummaries = (): PrintTemplateSummary[] =>
  printTemplates.map(({ id, description }) => ({
    id,
    description,
  }));

const getPrintTemplate = (id: (typeof printTemplates)[number]["id"]) => {
  switch (id) {
    case budgetAndBillsTemplate.id:
      return budgetAndBillsTemplate;
    case dailyFocusBriefingTemplate.id:
      return dailyFocusBriefingTemplate;
    case dailyWeatherForecastTemplate.id:
      return dailyWeatherForecastTemplate;
    case goalProgressTemplate.id:
      return goalProgressTemplate;
    case guestWifiCardTemplate.id:
      return guestWifiCardTemplate;
    case meetingSummaryTemplate.id:
      return meetingSummaryTemplate;
    case monthlySiteEnergyTemplate.id:
      return monthlySiteEnergyTemplate;
    case pocketTripItineraryTemplate.id:
      return pocketTripItineraryTemplate;
    case receiptTemplate.id:
      return receiptTemplate;
    case recipeCardTemplate.id:
      return recipeCardTemplate;
    case weeklyHabitReviewTemplate.id:
      return weeklyHabitReviewTemplate;
    default:
      return unreachable(id, `Unknown print template id: ${id}`);
  }
};

const createPrintTemplateMarkdown = (template: PrintTemplate) =>
  `${template.instructions.trim()}\n\n\`\`\`json\n${JSON.stringify(
    template.template,
    null,
    2,
  )}\n\`\`\``;

/**
 * Returns the complete details of a print template by its unique identifier.
 */
export const getPrintTemplateInfo = (
  id: (typeof printTemplates)[number]["id"],
): PrintTemplateInfo => {
  const template = getPrintTemplate(id);

  return {
    blockTypes: Array.from(
      new Set(template.template.blocks.map((block) => block.type)),
    ),
    description: template.description,
    id: template.id,
    markdown: createPrintTemplateMarkdown(template),
    tags: template.tags,
    title: template.title,
  };
};
