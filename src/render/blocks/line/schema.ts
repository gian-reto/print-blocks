import { z } from "@hono/zod-openapi";

export const lineCharacterSchema = z.string().length(1).openapi({
  description:
    "Single character repeated across the printer text width. Defaults to a hyphen.",
  example: "-",
});

export const createLineBlockSchema = () =>
  z
    .object({
      type: z.literal("line").openapi({
        description: "Discriminator for line blocks.",
        example: "line",
      }),
      character: lineCharacterSchema.optional(),
    })
    .strip()
    .openapi("LineBlock");

export type LineBlock = z.infer<ReturnType<typeof createLineBlockSchema>>;
