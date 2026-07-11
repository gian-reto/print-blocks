import type { PrintRequest } from "../../render/blocks/schema";

/**
 * The structure each print template must conform to.
 */
export type PrintTemplate = {
  description: string;
  id: string;
  instructions: string;
  tags: string[];
  template: PrintRequest;
  title: string;
};

/**
 * A lightweight summary of a print template, containing only the `id` and
 * `description`.
 */
export type PrintTemplateSummary = Pick<PrintTemplate, "id" | "description">;

/**
 * Detailed information about a print template, including the block types used
 * and a Markdown representation of the template instructions for easy display.
 */
export type PrintTemplateInfo = Omit<
  PrintTemplate,
  "instructions" | "template"
> & {
  blockTypes: string[];
  markdown: string;
};
