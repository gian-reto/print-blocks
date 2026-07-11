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
      type: z.literal("row").openapi({ example: "row" }),
      left: rowTextCellSchema,
      center: rowTextCellSchema.optional(),
      right: rowTextCellSchema,
      gap: z.number().int().min(0).openapi({ example: 1 }).optional(),
    })
    .strip()
    .openapi("RowBlock");
};

export type RowBlock = z.infer<ReturnType<typeof createRowBlockSchema>>;
