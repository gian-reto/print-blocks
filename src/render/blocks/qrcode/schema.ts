import iconv from "iconv-lite";
import { z } from "@hono/zod-openapi";

const qrCodeCellSizeSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
  z.literal(6),
  z.literal(7),
  z.literal(8),
]);

export const createQrCodeBlockSchema = () =>
  z
    .object({
      type: z.literal("qrcode").openapi({
        description: "Discriminator for QR code blocks.",
        example: "qrcode",
      }),
      content: z
        .string()
        .min(1)
        .refine((content) => iconv.encode(content, "CP437").byteLength <= 500, {
          message:
            "QR code content must be at most 500 bytes after CP437 encoding.",
        })
        .openapi({
          description:
            "Data to encode into the QR code. Must be at most 500 bytes after CP437 encoding.",
          example: "https://example.com",
        }),
      align: z.enum(["left", "center", "right"]).optional().openapi({
        description: "Horizontal alignment of the printed QR code.",
        example: "center",
      }),
      model: z.enum(["model1", "model2", "micro"]).optional().openapi({
        description:
          "QR code model. Use model2 for normal QR codes; model1 is legacy, and micro is only suitable for very small payloads.",
        example: "model2",
      }),
      cellSize: qrCodeCellSizeSchema.optional().openapi({
        description:
          "Size of each QR module in printer dots. Larger values print larger, easier-to-scan codes but require more paper width.",
        example: 4,
      }),
      correction: z.enum(["L", "M", "Q", "H"]).optional().openapi({
        description:
          "Error correction level. Higher levels improve damage tolerance but reduce data capacity and can increase the printed symbol size.",
        example: "M",
      }),
    })
    .strip()
    .openapi("QrCodeBlock");

export type QrCodeBlock = z.infer<ReturnType<typeof createQrCodeBlockSchema>>;
