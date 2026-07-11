import {
  createChartSeriesSchema,
  createChartXAxisLabelsSchema,
  getSeriesValueCount,
  maxChartSeries,
  validateSeriesValueLengths,
  validateUniqueLabels,
  validateXAxisLabelCount,
  validateYAxisBounds,
  yMaxSchema,
  yMinSchema,
} from "../schema";

import { z } from "@hono/zod-openapi";

export const createLineChartBlockSchema = (maxTextCharsPerBlock: number) =>
  z
    .object({
      // Block config.
      type: z.literal("lineChart").openapi({ example: "lineChart" }),
      series: z
        .array(createChartSeriesSchema(maxTextCharsPerBlock))
        .min(1)
        .max(maxChartSeries)
        .openapi({
          example: [
            { label: "API", values: [120, 140, 110, 180] },
            { label: "DB", values: [80, 90, 95, 130] },
          ],
        }),
      xLabels: createChartXAxisLabelsSchema(maxTextCharsPerBlock),
      yMin: yMinSchema,
      yMax: yMaxSchema,
    })
    .strip()
    .superRefine((block, ctx) => {
      validateYAxisBounds(block, ctx);
      validateSeriesValueLengths(block.series, ctx);
      validateXAxisLabelCount(
        block.xLabels,
        getSeriesValueCount(block.series),
        ctx,
      );
      validateUniqueLabels(
        block.series.map((item) => item.label),
        ["series"],
        "Line chart series labels must be unique.",
        ctx,
      );
    })
    .openapi("LineChartBlock");

export type LineChartBlock = z.infer<
  ReturnType<typeof createLineChartBlockSchema>
>;
