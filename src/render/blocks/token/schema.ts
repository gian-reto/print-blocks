import { z } from "@hono/zod-openapi";

export const maxTokenTitleChars = 64;

const nonBlankString = (message: string) =>
  z.string().refine((value) => value.trim().length > 0, {
    message,
  });

export const createTokenBlockSchema = (maxTextCharsPerBlock: number) =>
  z
    .object({
      // Block config.
      type: z.literal("token").openapi({
        description: "Discriminator for token blocks.",
        example: "token",
      }),
      title: nonBlankString("Token title must not be blank.")
        .max(maxTokenTitleChars)
        .openapi({
          description: "Short label shown above the highlighted value.",
          example: "Coupon code",
        }),
      content: nonBlankString("Token content must not be blank.")
        .max(maxTextCharsPerBlock)
        .openapi({
          description: "Value or instruction to highlight.",
          example: "LOREM IPSUM",
        }),
    })
    .strip()
    .openapi("TokenBlock");

export type TokenBlock = z.infer<ReturnType<typeof createTokenBlockSchema>>;
