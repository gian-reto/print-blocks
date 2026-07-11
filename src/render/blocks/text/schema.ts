import { packageInfo } from "../../../util/package-info";
import { z } from "@hono/zod-openapi";

export const alignSchema = z.enum(["left", "center", "right"]).openapi({
  description: "Horizontal text alignment.",
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
    width: textSizeValueSchema.openapi({
      description: "Horizontal character scale from 1 through 8.",
      example: 1,
    }),
    height: textSizeValueSchema.openapi({
      description: "Vertical character scale from 1 through 8.",
      example: 1,
    }),
  })
  .strip()
  .openapi("TextSize");

export const createTextBlockSchema = (maxTextCharsPerBlock: number) =>
  z
    .object({
      // Block config.
      type: z.literal("text").openapi({
        description: "Discriminator for text blocks.",
        example: "text",
      }),
      content: z
        .string()
        .min(1)
        .max(maxTextCharsPerBlock)
        .openapi({
          description: "Text to print.",
          example: `Hello from ${packageInfo.name}`,
        }),

      // Component options.
      align: alignSchema.optional(),
      bold: z.boolean().optional().openapi({
        description: "Print text in bold.",
        example: true,
      }),
      font: z
        .enum(["A", "B", "C", "D", "E", "special-A", "special-B"])
        .optional()
        .openapi({ description: "Printer font to use." }),
      underline: z
        .enum(["1dot-thick", "2dot-thick", "none"])
        .optional()
        .openapi({ description: "Underline style." }),
      invert: z.boolean().optional().openapi({
        description: "Print light text on a dark background.",
      }),
      size: textSizeSchema.optional().openapi({
        description: "Character width and height scaling.",
      }),
      wordBreak: z
        .enum(["break-all", "break-word"])
        .optional()
        .openapi({ description: "Text wrapping strategy." }),
      inline: z.boolean().optional().openapi({
        description: "Do not feed a line after printing this text.",
      }),
    })
    .strip()
    .openapi("TextBlock");

export type TextBlock = z.infer<ReturnType<typeof createTextBlockSchema>>;
