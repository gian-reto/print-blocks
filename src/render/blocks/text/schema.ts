import { z } from "@hono/zod-openapi";

export const alignSchema = z.enum(["left", "center", "right"]).openapi({
  example: "center",
});

const textSizeValueSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
]);

export const textSizeSchema = z
  .object({
    width: textSizeValueSchema.openapi({ example: 1 }),
    height: textSizeValueSchema.openapi({ example: 1 }),
  })
  .strip()
  .openapi("TextSize");

export const createTextBlockSchema = (maxTextCharsPerBlock: number) =>
  z
    .object({
      // Block config.
      type: z.literal("text").openapi({ example: "text" }),
      content: z.string().min(1).max(maxTextCharsPerBlock).openapi({
        example: "Hello from print-blocks",
      }),

      // Component options.
      align: alignSchema.optional(),
      bold: z.boolean().optional().openapi({ example: true }),
      font: z
        .enum(["A", "B", "C", "D", "E", "special-A", "special-B"])
        .optional(),
      underline: z.enum(["1dot-thick", "2dot-thick", "none"]).optional(),
      invert: z.boolean().optional(),
      size: textSizeSchema.optional(),
      wordBreak: z.enum(["break-all", "break-word"]).optional(),
      inline: z.boolean().optional(),
    })
    .strip()
    .openapi("TextBlock");

export type TextBlock = z.infer<ReturnType<typeof createTextBlockSchema>>;
