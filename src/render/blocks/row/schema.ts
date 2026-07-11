import { createTextBlockSchema } from "../text/schema";
import { z } from "@hono/zod-openapi";

export const createRowTextCellSchema = (maxTextCharsPerBlock: number) =>
  createTextBlockSchema(maxTextCharsPerBlock)
    .omit({ type: true, align: true, inline: true })
    .openapi("RowTextCell");

export type RowTextCell = z.infer<ReturnType<typeof createRowTextCellSchema>>;

export const createRowBlockSchema = (maxTextCharsPerBlock: number) => {
  const rowTextCellSchema = createRowTextCellSchema(maxTextCharsPerBlock);

  return z
    .object({
      type: z.literal("row").openapi({
        description: "Discriminator for row blocks.",
        example: "row",
      }),
      left: rowTextCellSchema.openapi({
        description: "Text cell aligned to the left edge.",
      }),
      center: rowTextCellSchema.optional().openapi({
        description: "Optional text cell centered between the outer cells.",
      }),
      right: rowTextCellSchema.openapi({
        description: "Text cell aligned to the right edge.",
      }),
      gap: z
        .number()
        .int()
        .min(0)
        .openapi({
          description: "Minimum gap between row cells, in characters.",
          example: 1,
        })
        .optional(),
    })
    .strip()
    .openapi("RowBlock");
};

export type RowBlock = z.infer<ReturnType<typeof createRowBlockSchema>>;
