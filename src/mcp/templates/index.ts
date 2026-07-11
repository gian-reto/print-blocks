import type {
  PrintTemplate,
  PrintTemplateInfo,
  PrintTemplateSummary,
} from "./types";

import { printTemplate as dailyWeatherForecastTemplate } from "./daily-weather-forecast";
import { printTemplate as monthlySiteEnergyTemplate } from "./monthly-site-energy";
import { printTemplate as receiptTemplate } from "./receipt";
import { unreachable } from "../../util/unreachable";

export const printTemplates = [
  dailyWeatherForecastTemplate,
  monthlySiteEnergyTemplate,
  receiptTemplate,
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
    case dailyWeatherForecastTemplate.id:
      return dailyWeatherForecastTemplate;
    case monthlySiteEnergyTemplate.id:
      return monthlySiteEnergyTemplate;
    case receiptTemplate.id:
      return receiptTemplate;
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
