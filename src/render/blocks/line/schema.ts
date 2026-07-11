import { z } from "@hono/zod-openapi";

export const lineCharacterSchema = z.string().length(1).openapi({
  example: "-",
});

export const createLineBlockSchema = () =>
  z
    .object({
      type: z.literal("line").openapi({ example: "line" }),
      character: lineCharacterSchema.optional(),
    })
    .strip()
    .openapi("LineBlock");

export type LineBlock = z.infer<ReturnType<typeof createLineBlockSchema>>;
