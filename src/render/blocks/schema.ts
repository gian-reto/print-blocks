import { z } from "@hono/zod-openapi";
import { createBrBlockSchema, type BrBlock } from "./br/schema";
import { createTextBlockSchema, type TextBlock } from "./text/schema";

export const createPrintBlockSchema = (maxTextCharsPerBlock: number) =>
  z.discriminatedUnion("type", [
    createBrBlockSchema(),
    createTextBlockSchema(maxTextCharsPerBlock),
  ]);

export type PrintBlock = BrBlock | TextBlock;

export const createPrintRequestSchema = (options: {
  maxBlocksPerPrintJob: number;
  maxTextCharsPerBlock: number;
}) =>
  z
    .object({
      blocks: z
        .array(createPrintBlockSchema(options.maxTextCharsPerBlock))
        .min(1)
        .max(options.maxBlocksPerPrintJob)
        .openapi({
          example: [
            {
              type: "br",
            },
            {
              type: "text",
              content: "Hello from print-blocks",
              align: "center",
              bold: true,
            },
          ],
        }),
    })
    .strip()
    .openapi("PrintRequest");

export type PrintRequestSchema = ReturnType<typeof createPrintRequestSchema>;
export type PrintRequest = z.infer<ReturnType<typeof createPrintRequestSchema>>;
