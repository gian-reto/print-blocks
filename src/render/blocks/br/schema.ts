import { z } from "@hono/zod-openapi";

export const createBrBlockSchema = () =>
  z
    .object({
      type: z.literal("br").openapi({
        description: "Discriminator for line-break blocks.",
        example: "br",
      }),
    })
    .strip()
    .openapi("BrBlock");

export type BrBlock = z.infer<ReturnType<typeof createBrBlockSchema>>;
