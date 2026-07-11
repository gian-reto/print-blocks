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
      type: z.literal("areaChart").openapi({
        description: "Discriminator for area-chart blocks.",
        example: "areaChart",
      }),
      series: createChartSeriesSchema(maxTextCharsPerBlock).openapi({
        description: "Series plotted as a filled area.",
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
