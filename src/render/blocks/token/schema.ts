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
      type: z.literal("token").openapi({ example: "token" }),
      title: nonBlankString("Token title must not be blank.")
        .max(maxTokenTitleChars)
        .openapi({
          example: "Coupon code",
        }),
      content: nonBlankString("Token content must not be blank.")
        .max(maxTextCharsPerBlock)
        .openapi({
          example: "LOREM IPSUM",
        }),
    })
    .strip()
    .openapi("TokenBlock");

export type TokenBlock = z.infer<ReturnType<typeof createTokenBlockSchema>>;
