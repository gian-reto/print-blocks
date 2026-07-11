import {
  createChartLabelSchema,
  maxBarChartItems,
  nonNegativeChartValueSchema,
  validateUniqueLabels,
} from "../schema";

import { z } from "@hono/zod-openapi";

const createBarChartItemSchema = (maxTextCharsPerBlock: number) =>
  z
    .object({
      label: createChartLabelSchema(maxTextCharsPerBlock),
      value: nonNegativeChartValueSchema,
    })
    .strip();

export const createBarChartBlockSchema = (maxTextCharsPerBlock: number) =>
  z
    .object({
      // Block config.
      type: z.literal("barChart").openapi({ example: "barChart" }),
      items: z
        .array(createBarChartItemSchema(maxTextCharsPerBlock))
        .min(1)
        .max(maxBarChartItems)
        .openapi({
          example: [
            { label: "Mon", value: 12 },
            { label: "Tue", value: 18 },
          ],
        }),
      yMax: nonNegativeChartValueSchema.optional().openapi({ example: 100 }),
    })
    .strip()
    .superRefine((block, ctx) => {
      validateUniqueLabels(
        block.items.map((item) => item.label),
        ["items"],
        "Bar chart item labels must be unique.",
        ctx,
      );

      if (block.yMax === undefined) {
        return;
      }

      const largestValue = Math.max(...block.items.map((item) => item.value));

      if (block.yMax < largestValue) {
        ctx.addIssue({
          code: "custom",
          message:
            "Bar chart yMax must be greater than or equal to every item value.",
          path: ["yMax"],
        });
      }
    })
    .openapi("BarChartBlock");

export type BarChartBlock = z.infer<
  ReturnType<typeof createBarChartBlockSchema>
>;
