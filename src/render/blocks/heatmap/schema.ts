import { z } from "@hono/zod-openapi";

export const maxHeatmapRows = 16;
export const maxHeatmapColumns = 31;
export const maxHeatmapLabelChars = 24;
export const maxHeatmapCells = 256;

const heatmapValueSchema = z.union([
  z.number().finite().min(0).openapi({ example: 3 }),
  z.null().openapi({ example: null }),
]);

const heatmapRowSchema = z
  .array(heatmapValueSchema)
  .min(1)
  .max(maxHeatmapColumns);

const validateHeatmapShape = (
  block: { labels: string[]; values: (number | null)[][] },
  ctx: z.RefinementCtx,
) => {
  const columnCount = block.values[0]?.length;

  if (columnCount === undefined) {
    return;
  }

  block.values.forEach((row, index) => {
    if (row.length === columnCount) {
      return;
    }

    ctx.addIssue({
      code: "custom",
      message: "Heatmap rows must have the same number of columns.",
      path: ["values", index],
    });
  });

  if (block.labels.length !== columnCount) {
    ctx.addIssue({
      code: "custom",
      message: "Heatmap labels length must match the number of columns.",
      path: ["labels"],
    });
  }

  const cellCount = block.values.reduce((sum, row) => sum + row.length, 0);

  if (cellCount > maxHeatmapCells) {
    ctx.addIssue({
      code: "custom",
      message: `Heatmaps must contain at most ${maxHeatmapCells} cells.`,
      path: ["values"],
    });
  }
};

export const createHeatmapBlockSchema = (_maxTextCharsPerBlock: number) =>
  z
    .object({
      // Block config.
      type: z.literal("heatmap").openapi({ example: "heatmap" }),
      labels: z
        .array(z.string().max(maxHeatmapLabelChars).openapi({ example: "Mon" }))
        .min(1)
        .max(maxHeatmapColumns)
        .openapi({ example: ["Mon", "Tue", "Wed"] }),
      values: z
        .array(heatmapRowSchema)
        .min(1)
        .max(maxHeatmapRows)
        .openapi({
          example: [
            [null, 3, 1],
            [0, 3, 2],
          ],
        }),
    })
    .strip()
    .superRefine(validateHeatmapShape)
    .openapi("HeatmapBlock");

export type HeatmapBlock = z.infer<ReturnType<typeof createHeatmapBlockSchema>>;
