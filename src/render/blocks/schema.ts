import { z } from "@hono/zod-openapi";
import { createBarcodeBlockSchema, type BarcodeBlock } from "./barcode/schema";
import { createBrBlockSchema, type BrBlock } from "./br/schema";
import { createImageBlockSchema, type ImageBlock } from "./image/schema";
import { createLineBlockSchema, type LineBlock } from "./line/schema";
import { createQrCodeBlockSchema, type QrCodeBlock } from "./qrcode/schema";
import { createRowBlockSchema, type RowBlock } from "./row/schema";
import { createTextBlockSchema, type TextBlock } from "./text/schema";

export const createPrintBlockSchema = (maxTextCharsPerBlock: number) =>
  z.discriminatedUnion("type", [
    createBarcodeBlockSchema(),
    createBrBlockSchema(),
    createImageBlockSchema(),
    createLineBlockSchema(),
    createQrCodeBlockSchema(),
    createRowBlockSchema(maxTextCharsPerBlock),
    createTextBlockSchema(maxTextCharsPerBlock),
  ]);

export type PrintBlock =
  | BarcodeBlock
  | BrBlock
  | ImageBlock
  | LineBlock
  | QrCodeBlock
  | RowBlock
  | TextBlock;

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
              type: "barcode",
              format: "CODE128",
              content: "{B1234567890",
              align: "center",
              hriPosition: "bottom",
            },
            {
              type: "br",
            },
            {
              type: "image",
              src: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
              align: "center",
              transforms: ["floydSteinberg"],
            },
            {
              type: "line",
              character: "-",
            },
            {
              type: "qrcode",
              content: "https://example.com",
              align: "center",
            },
            {
              type: "row",
              left: { content: "Total" },
              right: { content: "12.50", bold: true },
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
