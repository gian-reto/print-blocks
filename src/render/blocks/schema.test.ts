import { describe, expect, it } from "vitest";

import { createPrintRequestSchema } from "./schema";
import sharp from "sharp";
import { whitePixelPngBase64 } from "../../test/fixtures/image";

const createSchema = () =>
  createPrintRequestSchema({
    allowRemoteImageUrls: false,
    maxBlocksPerPrintJob: 2,
    maxTextCharsPerBlock: 5,
  });

describe("print request schema", () => {
  it("accepts and strips extra fields from valid print requests", () => {
    const result = createSchema().parse({
      blocks: [
        {
          type: "text",
          content: "Hello",
          align: "center",
          unknown: true,
        },
      ],
      anotherUnknown: true,
    });

    expect(result).toEqual({
      blocks: [
        {
          type: "text",
          content: "Hello",
          align: "center",
        },
      ],
    });
  });

  it("accepts barcode blocks", () => {
    const result = createSchema().parse({
      blocks: [
        {
          type: "barcode",
          format: "CODE128",
          content: "{B12345",
          align: "center",
        },
      ],
    });

    expect(result).toEqual({
      blocks: [
        {
          type: "barcode",
          format: "CODE128",
          content: "{B12345",
          align: "center",
        },
      ],
    });
  });

  it("accepts br blocks", () => {
    const result = createSchema().parse({
      blocks: [{ type: "br" }],
    });

    expect(result).toEqual({
      blocks: [{ type: "br" }],
    });
  });

  it("accepts image blocks", () => {
    const result = createSchema().parse({
      blocks: [{ type: "image", data: whitePixelPngBase64, align: "center" }],
    });

    expect(result).toEqual({
      blocks: [
        {
          type: "image",
          data: whitePixelPngBase64,
          align: "center",
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        },
      ],
    });
  });

  it("accepts line blocks", () => {
    const result = createSchema().parse({
      blocks: [{ type: "line", character: "=" }],
    });

    expect(result).toEqual({
      blocks: [{ type: "line", character: "=" }],
    });
  });

  it("accepts qrcode blocks", () => {
    const result = createSchema().parse({
      blocks: [{ type: "qrcode", content: "Hello", align: "center" }],
    });

    expect(result).toEqual({
      blocks: [{ type: "qrcode", content: "Hello", align: "center" }],
    });
  });

  it("accepts row blocks", () => {
    const result = createSchema().parse({
      blocks: [
        {
          type: "row",
          left: { content: "Item" },
          right: { content: "1.00", bold: true },
        },
      ],
    });

    expect(result).toEqual({
      blocks: [
        {
          type: "row",
          left: { content: "Item" },
          right: { content: "1.00", bold: true },
        },
      ],
    });
  });

  it("rejects empty block arrays", () => {
    const result = createSchema().safeParse({ blocks: [] });

    expect(result.success).toBe(false);
  });

  it("rejects too many blocks", () => {
    const result = createSchema().safeParse({
      blocks: [
        { type: "text", content: "One" },
        { type: "text", content: "Two" },
        { type: "text", content: "Tri" },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects unknown block types", () => {
    const result = createSchema().safeParse({
      blocks: [{ type: "unknown", content: "Hello" }],
    });

    expect(result.success).toBe(false);
  });
});
