import type { ImageToRasterOptions } from "@react-thermal-printer/image";
import { entriesOf } from "../../../util/entries-of";
import { keys } from "remeda";
import sharp from "sharp";
import { transforms } from "@react-thermal-printer/image";
import { z } from "@hono/zod-openapi";

type CreateImageBlockSchemaOptions = {
  allowRemoteImageUrls: boolean;
};

export const remoteImageUrlSchema = z
  .url({
    protocol: /^https$/,
    hostname: z.regexes.domain,
    normalize: true,
  })
  .refine(
    (value) => {
      const url = new URL(value);

      return url.username === "" && url.password === "";
    },
    {
      message: "Remote image URLs must not include credentials.",
    },
  )
  .openapi({
    description:
      "HTTPS image URL with a public domain hostname. Direct IP addresses, plain HTTP, credentials, localhost-style names, and redirects are not allowed.",
    example: "https://example.com/logo.png",
  });

export const createImageBlockSchema = ({
  allowRemoteImageUrls,
}: CreateImageBlockSchemaOptions) =>
  z
    .strictObject({
      type: z.literal("image").openapi({
        description: "Discriminator for image blocks.",
        example: "image",
      }),
      data: z.base64().min(1).optional().openapi({
        description:
          "Base64-encoded image data. Provide exactly one of data or url. Sharp must be able to decode the image format.",
        example:
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
      }),
      url: remoteImageUrlSchema.optional(),
      align: z.enum(["left", "center", "right"]).optional().openapi({
        description: "Horizontal alignment of the printed image.",
        example: "center",
      }),
      fit: z
        .enum<readonly (keyof typeof sharp.fit)[]>(keys(sharp.fit))
        .default(sharp.fit.inside)
        .openapi({
          description:
            "Resize fit mode used when scaling the image to the printer width.",
          example: sharp.fit.inside,
        }),
      withoutEnlargement: z.boolean().default(true).openapi({
        description:
          "Do not enlarge image if it is already smaller than the printer width.",
        example: true,
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
    .superRefine((block, ctx) => {
      const hasData = block.data !== undefined;
      const hasUrl = block.url !== undefined;

      if (hasData === hasUrl) {
        ctx.addIssue({
          code: "custom",
          message: "Image blocks must include exactly one of data or url.",
          path: ["data"],
        });
      }

      if (hasUrl && !allowRemoteImageUrls) {
        ctx.addIssue({
          code: "custom",
          message: "Remote image URLs are disabled by server configuration.",
          path: ["url"],
        });
      }
    })
    .openapi("ImageBlock");

export type ImageBlock = z.infer<ReturnType<typeof createImageBlockSchema>>;
