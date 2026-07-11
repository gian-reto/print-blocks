import type { ImageToRasterOptions } from "@react-thermal-printer/image";
import { entriesOf } from "../../../util/entries-of";
import { transforms } from "@react-thermal-printer/image";
import { z } from "@hono/zod-openapi";

export const createImageBlockSchema = () =>
  z
    .object({
      type: z.literal("image").openapi({
        description: "Discriminator for image blocks.",
        example: "image",
      }),
      src: z.base64().min(1).openapi({
        description:
          "Base64-encoded image data. Remote URLs are not supported; Sharp must be able to decode the image format.",
        example:
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
      }),
      align: z.enum(["left", "center", "right"]).optional().openapi({
        description: "Horizontal alignment of the printed image.",
        example: "center",
      }),
      transforms: z
        .array(
          z.enum<readonly (keyof typeof transforms)[]>(
            entriesOf(transforms).map(([name]) => name),
          ),
        )
        .refine((items) => new Set(items).size === items.length, {
          message: "Image transforms must not contain duplicate values.",
        })
        .transform((value) => value.map((transform) => transforms[transform]))
        .optional()
        .openapi({
          description:
            "Image transforms to apply before printing. Currently only supports Floyd-Steinberg dithering.",
          example: ["floydSteinberg"],
        }),
      rgbToBlack: z
        .number()
        .int()
        .min(0)
        .max(255)
        .transform(
          (value: number): NonNullable<ImageToRasterOptions["rgbToBlack"]> =>
            ({ r, g, b, a }) =>
              a > 0 && (r + g + b) / 3 < value,
        )
        .optional()
        .openapi({
          description:
            "Optional black threshold for rasterizing pixels. Lower values print fewer black pixels; higher values print more.",
          example: 230,
        }),
    })
    .strip()
    .openapi("ImageBlock");

export type ImageBlock = z.infer<ReturnType<typeof createImageBlockSchema>>;
