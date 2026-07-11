import {
  createChartSeriesSchema,
  createChartXAxisLabelsSchema,
  getSeriesValueCount,
  validateXAxisLabelCount,
  validateYAxisBounds,
  yMaxSchema,
  yMinSchema,
} from "../schema";

import { z } from "@hono/zod-openapi";

export const createAreaChartBlockSchema = (maxTextCharsPerBlock: number) =>
  z
    .object({
      // Block config.
      type: z.literal("areaChart").openapi({ example: "areaChart" }),
      series: createChartSeriesSchema(maxTextCharsPerBlock).openapi({
        example: { label: "Temperature", values: [18, 20, 23, 21] },
      }),
      xLabels: createChartXAxisLabelsSchema(maxTextCharsPerBlock),
      yMin: yMinSchema,
      yMax: yMaxSchema,
    })
    .strip()
    .superRefine((block, ctx) => {
      validateYAxisBounds(block, ctx);
      validateXAxisLabelCount(
        block.xLabels,
        getSeriesValueCount([block.series]),
        ctx,
      );
    })
    .openapi("AreaChartBlock");

export type AreaChartBlock = z.infer<
  ReturnType<typeof createAreaChartBlockSchema>
>;
