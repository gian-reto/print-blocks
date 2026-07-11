import { describe, expect, it } from "vitest";
import { createPrintRequestSchema } from "./blocks/schema";
import { ImageRenderError } from "./blocks/image/error";
import { renderPrintJob, type PrinterRenderOptions } from "./render-print-job";
import { whitePixelPngBase64 } from "../test/fixtures/image";
import { supportedImageFormats } from "./blocks/image";

const options: PrinterRenderOptions = {
  type: "epson",
  width: 48,
  characterSet: "pc437_usa",
  imageSource: {
    maxImageInputPixels: 25_000_000,
    maxRemoteImageBytes: 5 * 1024 * 1024,
    remoteImageTimeoutMs: 5_000,
  },
};

const createSchema = () =>
  createPrintRequestSchema({
    allowRemoteImageUrls: false,
    maxBlocksPerPrintJob: 20,
    maxTextCharsPerBlock: 5_000,
  });

const transparentGifBase64 = "R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

describe("renderPrintJob", () => {
  it("renders a document containing all block types", async () => {
    const request = createSchema().parse({
      blocks: [
        {
          type: "barcode",
          format: "CODE128",
          content: "{B1234567890",
          align: "center",
          hriPosition: "bottom",
        },
        { type: "br" },
        {
          type: "image",
          data: whitePixelPngBase64,
          align: "center",
          fit: "inside",
          withoutEnlargement: true,
          transforms: ["floydSteinberg"],
          rgbToBlack: 230,
        },
        { type: "line", character: "=" },
        {
          type: "qrcode",
          content: "https://example.com",
          align: "center",
          model: "model2",
          cellSize: 4,
          correction: "M",
        },
        {
          type: "row",
          left: { content: "Item", bold: true },
          center: { content: "x2" },
          right: { content: "1.00", size: { width: 2, height: 1 } },
          gap: 1,
        },
        { type: "text", content: "Hello", align: "center" },
      ],
    });

    const result = await renderPrintJob(request.blocks, options);

    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.byteLength).toBeGreaterThan(0);
  });

  it("throws actionable image errors for invalid image data", async () => {
    const request = createSchema().parse({
      blocks: [
        {
          type: "image",
          data: Buffer.from("not an image").toString("base64"),
        },
      ],
    });

    await expect(renderPrintJob(request.blocks, options)).rejects.toMatchObject(
      {
        code: "IMAGE_SHARP_PROCESSING_ERROR",
        message: "Input buffer contains unsupported image format",
      },
    );
    await expect(
      renderPrintJob(request.blocks, options),
    ).rejects.toBeInstanceOf(ImageRenderError);
  });

  it("rejects unsupported image formats with an actionable error", async () => {
    const request = createSchema().parse({
      blocks: [
        {
          type: "image",
          data: transparentGifBase64,
        },
      ],
    });

    await expect(renderPrintJob(request.blocks, options)).rejects.toMatchObject(
      {
        code: "IMAGE_UNSUPPORTED_FORMAT",
        message: `Unsupported image format: gif. Supported image formats are: ${supportedImageFormats.join(", ")}.`,
      },
    );
  });
});
