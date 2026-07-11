import iconv from "iconv-lite";
import type { BarcodeType, TextFont } from "react-thermal-printer";
import { z } from "@hono/zod-openapi";

const barcodeFormatValues = [
  "UPC-A",
  "UPC-E",
  "JAN13",
  "JAN8",
  "CODE39",
  "ITF",
  "CODABAR",
  "CODE93",
  "CODE128",
  "GS1-128",
  "GS1 (DataBar Omnidirectional)",
  "GS1 (DataBar Truncated)",
  "GS1 (DataBar Limited)",
  "GS1 (DataBar Expanded)",
] as const satisfies readonly BarcodeType[];

const barcodeWidthSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
]);

const textFontValues = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "special-A",
  "special-B",
] as const satisfies readonly TextFont[];

export const createBarcodeBlockSchema = () =>
  z
    .object({
      type: z.literal("barcode").openapi({
        description: "Discriminator for barcode blocks.",
        example: "barcode",
      }),
      format: z.enum(barcodeFormatValues).openapi({
        description:
          "Barcode symbology. The selected format determines the allowed character set and length.",
        example: "CODE128",
      }),
      content: z
        .string()
        .min(1)
        .refine((content) => iconv.encode(content, "CP437").byteLength <= 256, {
          message:
            "Barcode content must be at most 256 bytes after CP437 encoding.",
        })
        .openapi({
          description:
            "Data to encode in the barcode. Must be at most 256 bytes after CP437 encoding; other character and length rules depend on the selected format.",
          example: "{B1234567890",
        }),
      align: z.enum(["left", "center", "right"]).optional().openapi({
        description: "Horizontal alignment of the printed barcode.",
        example: "center",
      }),
      hriPosition: z
        .enum(["none", "top", "bottom", "top-bottom"])
        .optional()
        .openapi({
          description:
            "Human-readable interpretation text position relative to the barcode.",
          example: "bottom",
        }),
      hriFont: z.enum(textFontValues).optional().openapi({
        description: "Font used for the human-readable interpretation text.",
        example: "A",
      }),
      width: barcodeWidthSchema.optional().openapi({
        description:
          "Width of the narrowest barcode bar in printer dots. Larger values produce wider barcodes.",
        example: 3,
      }),
      height: z.number().int().min(1).max(255).optional().openapi({
        description: "Height of the barcode in printer dots.",
        example: 162,
      }),
    })
    .refine((block) => {
      if (block.format === "CODE128") {
        // Ensure CODE128 content starts with a valid code set prefix (A, B, or C).
        return (["{A", "{B", "{C"] as const).some((prefix) =>
          block.content.startsWith(prefix),
        );
      }

      return true;
    })
    .strip()
    .openapi("BarcodeBlock");

export type BarcodeBlock = z.infer<ReturnType<typeof createBarcodeBlockSchema>>;
