import { z } from "@hono/zod-openapi";
import { createAreaChartBlockSchema, type AreaChartBlock } from "./chart/area";
import { createBarChartBlockSchema, type BarChartBlock } from "./chart/bar";
import { createLineChartBlockSchema, type LineChartBlock } from "./chart/line";
import {
  createStackedAreaChartBlockSchema,
  type StackedAreaChartBlock,
} from "./chart/stacked-area";
import { createBarcodeBlockSchema, type BarcodeBlock } from "./barcode/schema";
import { createBrBlockSchema, type BrBlock } from "./br/schema";
import { createImageBlockSchema, type ImageBlock } from "./image/schema";
import { createLineBlockSchema, type LineBlock } from "./line/schema";
import { createProgressBlockSchema, type ProgressBlock } from "./progress";
import { createQrCodeBlockSchema, type QrCodeBlock } from "./qrcode/schema";
import { createRowBlockSchema, type RowBlock } from "./row/schema";
import { createTextBlockSchema, type TextBlock } from "./text/schema";
import { createTokenBlockSchema, type TokenBlock } from "./token/schema";
import { packageInfo } from "../../util/package-info";

type CreatePrintBlockSchemaOptions = {
  allowRemoteImageUrls: boolean;
  maxTextCharsPerBlock: number;
};

export const createPrintBlockSchema = (
  options: CreatePrintBlockSchemaOptions,
) =>
  z.discriminatedUnion("type", [
    createAreaChartBlockSchema(options.maxTextCharsPerBlock),
    createBarChartBlockSchema(options.maxTextCharsPerBlock),
    createBarcodeBlockSchema(),
    createBrBlockSchema(),
    createImageBlockSchema({
      allowRemoteImageUrls: options.allowRemoteImageUrls,
    }),
    createLineBlockSchema(),
    createLineChartBlockSchema(options.maxTextCharsPerBlock),
    createProgressBlockSchema(options.maxTextCharsPerBlock),
    createQrCodeBlockSchema(),
    createRowBlockSchema(options.maxTextCharsPerBlock),
    createStackedAreaChartBlockSchema(options.maxTextCharsPerBlock),
    createTextBlockSchema(options.maxTextCharsPerBlock),
    createTokenBlockSchema(options.maxTextCharsPerBlock),
  ]);

export type PrintBlock =
  | AreaChartBlock
  | BarChartBlock
  | BarcodeBlock
  | BrBlock
  | ImageBlock
  | LineBlock
  | LineChartBlock
  | ProgressBlock
  | QrCodeBlock
  | RowBlock
  | StackedAreaChartBlock
  | TextBlock
  | TokenBlock;

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
              type: "areaChart",
              series: { label: "Room", values: [19, 21, 20, 22] },
              xLabels: ["08:00", "10:00", "12:00", "14:00"],
            },
            {
              type: "barChart",
              items: [
                { label: "Mon", value: 12 },
                { label: "Tue", value: 18 },
              ],
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
              type: "lineChart",
              series: [
                { label: "API", values: [120, 140, 110] },
                { label: "DB", values: [80, 90, 95] },
              ],
              xLabels: ["10:00", "10:05", "10:10"],
            },
            {
              type: "progress",
              variant: "bar",
              value: 67,
              max: 100,
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
              type: "stackedAreaChart",
              series: [
                { label: "Solar", values: [5, 8, 7] },
                { label: "Grid", values: [4, 3, 6] },
              ],
              xLabels: ["Mon", "Tue", "Wed"],
            },
            {
              type: "text",
              content: `Hello from ${packageInfo.name}`,
              align: "center",
              bold: true,
            },
            {
              type: "token",
              title: "Coupon code",
              content: "LOREM IPSUM",
            },
          ],
        }),
    })
    .strip()
    .openapi("PrintRequest");

export type PrintRequestSchema = ReturnType<typeof createPrintRequestSchema>;
export type PrintRequest = z.infer<ReturnType<typeof createPrintRequestSchema>>;
