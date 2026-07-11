import { z } from "@hono/zod-openapi";
import { createBarcodeBlockSchema, type BarcodeBlock } from "./barcode/schema";
import { createBrBlockSchema, type BrBlock } from "./br/schema";
import { createImageBlockSchema, type ImageBlock } from "./image/schema";
import { createLineBlockSchema, type LineBlock } from "./line/schema";
import { createQrCodeBlockSchema, type QrCodeBlock } from "./qrcode/schema";
import { createRowBlockSchema, type RowBlock } from "./row/schema";
import { createTextBlockSchema, type TextBlock } from "./text/schema";
import { packageInfo } from "../../util/package-info";

type CreatePrintBlockSchemaOptions = {
  allowRemoteImageUrls: boolean;
  maxTextCharsPerBlock: number;
};

export const createPrintBlockSchema = (
  options: CreatePrintBlockSchemaOptions,
) =>
  z.discriminatedUnion("type", [
    createBarcodeBlockSchema(),
    createBrBlockSchema(),
    createImageBlockSchema({
      allowRemoteImageUrls: options.allowRemoteImageUrls,
    }),
    createLineBlockSchema(),
    createQrCodeBlockSchema(),
    createRowBlockSchema(options.maxTextCharsPerBlock),
    createTextBlockSchema(options.maxTextCharsPerBlock),
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
  allowRemoteImageUrls: boolean;
  maxBlocksPerPrintJob: number;
  maxTextCharsPerBlock: number;
}) =>
  z
    .object({
      blocks: z
        .array(
          createPrintBlockSchema({
            allowRemoteImageUrls: options.allowRemoteImageUrls,
            maxTextCharsPerBlock: options.maxTextCharsPerBlock,
          }),
        )
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
              data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
              align: "center",
              maxWidth: 50,
              fit: "inside",
              withoutEnlargement: true,
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
              content: `Hello from ${packageInfo.name}`,
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
