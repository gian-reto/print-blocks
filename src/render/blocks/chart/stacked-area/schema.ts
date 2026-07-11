import {
  createChartSeriesSchema,
  createChartXAxisLabelsSchema,
  getSeriesValueCount,
  maxChartSeries,
  nonNegativeChartValueSchema,
  validateSeriesValueLengths,
  validateUniqueLabels,
  validateXAxisLabelCount,
} from "../schema";

import { z } from "@hono/zod-openapi";

export const createStackedAreaChartBlockSchema = (
  maxTextCharsPerBlock: number,
) =>
  z
    .object({
      // Block config.
      type: z.literal("stackedAreaChart").openapi({
        description: "Discriminator for stacked-area-chart blocks.",
        example: "stackedAreaChart",
      }),
      series: z
        .array(
          createChartSeriesSchema(
            maxTextCharsPerBlock,
            nonNegativeChartValueSchema,
          ),
        )
        .min(2)
        .max(maxChartSeries)
        .openapi({
          description: "Two to four non-negative series stacked by x value.",
          example: [
            { label: "Solar", values: [5, 8, 7, 6] },
            { label: "Grid", values: [4, 3, 6, 5] },
          ],
        }),
      xLabels: createChartXAxisLabelsSchema(maxTextCharsPerBlock),
      yMax: nonNegativeChartValueSchema.optional().openapi({
        description: "Optional upper bound for stacked totals.",
        example: 100,
      }),
    })
    .strip()
    .superRefine((block, ctx) => {
      validateSeriesValueLengths(block.series, ctx);
      validateXAxisLabelCount(
        block.xLabels,
        getSeriesValueCount(block.series),
        ctx,
      );
      validateUniqueLabels(
        block.series.map((item) => item.label),
        ["series"],
        "Stacked area chart series labels must be unique.",
        ctx,
      );

      if (block.yMax === undefined) {
        return;
      }

      const pointCount = getSeriesValueCount(block.series);
      const largestTotal = Math.max(
        ...Array.from({ length: pointCount }, (_, pointIndex) =>
          block.series.reduce(
            (total, series) => total + (series.values[pointIndex] ?? 0),
            0,
          ),
        ),
      );

      if (block.yMax < largestTotal) {
        ctx.addIssue({
          code: "custom",
          message:
            "Stacked area chart yMax must be greater than or equal to every stacked total.",
          path: ["yMax"],
        });
      }
    })
    .openapi("StackedAreaChartBlock");

export type StackedAreaChartBlock = z.infer<
  ReturnType<typeof createStackedAreaChartBlockSchema>
>;
