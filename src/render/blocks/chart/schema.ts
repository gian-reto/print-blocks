import { z } from "@hono/zod-openapi";

export const maxBarChartItems = 16;
export const maxChartLabelChars = 32;
export const maxChartPoints = 48;
export const maxChartSeries = 4;
export const minChartPoints = 2;

export type ChartYAxisBounds = {
  yMax?: number | undefined;
  yMin?: number | undefined;
};

export type ChartSeriesLike = {
  label: string;
  values: number[];
};

const nonBlankText = (message: string) =>
  z.string().refine((value) => value.trim().length > 0, {
    message,
  });

export const chartValueSchema = z.number().finite().openapi({
  example: 42,
});

export const nonNegativeChartValueSchema = chartValueSchema.min(0).openapi({
  example: 42,
});

export const createChartLabelSchema = (maxTextCharsPerBlock: number) =>
  nonBlankText("Chart label must not be blank.")
    .max(Math.min(maxTextCharsPerBlock, maxChartLabelChars))
    .openapi({
      example: "Mon",
    });

export const createChartSeriesSchema = (
  maxTextCharsPerBlock: number,
  valueSchema = chartValueSchema,
) =>
  z
    .object({
      label: createChartLabelSchema(maxTextCharsPerBlock),
      values: z
        .array(valueSchema)
        .min(minChartPoints)
        .max(maxChartPoints)
        .openapi({
          example: [12, 19, 14, 22],
        }),
    })
    .strip();

export const createChartXAxisLabelsSchema = (maxTextCharsPerBlock: number) =>
  z
    .array(createChartLabelSchema(maxTextCharsPerBlock))
    .min(minChartPoints)
    .max(maxChartPoints)
    .optional()
    .openapi({
      description:
        "Optional x-axis labels for each data point. Keep labels as short as possible.",
      example: ["Mon", "Tue", "Wed", "Thu"],
    });

export const yMinSchema = chartValueSchema.optional().openapi({
  example: 0,
});

export const yMaxSchema = chartValueSchema.optional().openapi({
  example: 100,
});

export const validateYAxisBounds = (
  block: ChartYAxisBounds,
  ctx: z.RefinementCtx,
) => {
  if (block.yMin === undefined || block.yMax === undefined) {
    return;
  }

  if (block.yMin >= block.yMax) {
    ctx.addIssue({
      code: "custom",
      message: "Chart yMin must be lower than yMax.",
      path: ["yMin"],
    });
  }
};

export const validateSeriesValueLengths = (
  series: ChartSeriesLike[],
  ctx: z.RefinementCtx,
) => {
  const [firstSeries] = series;

  if (firstSeries === undefined) {
    return;
  }

  const valueCount = firstSeries.values.length;
  const invalidIndex = series.findIndex(
    (item) => item.values.length !== valueCount,
  );

  if (invalidIndex === -1) {
    return;
  }

  ctx.addIssue({
    code: "custom",
    message: "Chart series must all contain the same number of values.",
    path: ["series", invalidIndex, "values"],
  });
};

export const validateXAxisLabelCount = (
  labels: string[] | undefined,
  valueCount: number,
  ctx: z.RefinementCtx,
) => {
  if (labels === undefined || labels.length === valueCount) {
    return;
  }

  ctx.addIssue({
    code: "custom",
    message: "Chart xLabels must contain one label per data point.",
    path: ["xLabels"],
  });
};

export const validateUniqueLabels = (
  labels: string[],
  path: (string | number)[],
  message: string,
  ctx: z.RefinementCtx,
) => {
  if (new Set(labels).size === labels.length) {
    return;
  }

  ctx.addIssue({
    code: "custom",
    message,
    path,
  });
};

export const getSeriesValueCount = (series: ChartSeriesLike[]) =>
  series[0]?.values.length ?? 0;
