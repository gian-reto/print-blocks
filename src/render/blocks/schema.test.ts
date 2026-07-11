import { describe, expect, it } from "vitest";

import { createPrintRequestSchema } from "./schema";
import sharp from "sharp";
import { whitePixelPngBase64 } from "../../test/fixtures/image";

const createSchema = () =>
  createPrintRequestSchema({
    allowRemoteImageUrls: false,
    maxBlocksPerPrintJob: 2,
    maxTextCharsPerBlock: 11,
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

  it("accepts area chart blocks", () => {
    const result = createSchema().parse({
      blocks: [
        {
          type: "areaChart",
          series: { label: "Room", values: [19, 21] },
        },
      ],
    });

    expect(result).toEqual({
      blocks: [
        {
          type: "areaChart",
          series: { label: "Room", values: [19, 21] },
        },
      ],
    });
  });

  it("accepts bar chart blocks", () => {
    const result = createSchema().parse({
      blocks: [
        {
          type: "barChart",
          items: [{ label: "Mon", value: 12 }],
        },
      ],
    });

    expect(result).toEqual({
      blocks: [
        {
          type: "barChart",
          items: [{ label: "Mon", value: 12 }],
        },
      ],
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

  it("accepts line chart blocks", () => {
    const result = createSchema().parse({
      blocks: [
        {
          type: "lineChart",
          series: [{ label: "API", values: [120, 140] }],
        },
      ],
    });

    expect(result).toEqual({
      blocks: [
        {
          type: "lineChart",
          series: [{ label: "API", values: [120, 140] }],
        },
      ],
    });
  });

  it("accepts progress blocks", () => {
    const result = createSchema().parse({
      blocks: [{ type: "progress", variant: "bar", value: 67, max: 100 }],
    });

    expect(result).toEqual({
      blocks: [{ type: "progress", variant: "bar", value: 67, max: 100 }],
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

  it("accepts stacked area chart blocks", () => {
    const result = createSchema().parse({
      blocks: [
        {
          type: "stackedAreaChart",
          series: [
            { label: "Solar", values: [5, 8] },
            { label: "Grid", values: [4, 3] },
          ],
        },
      ],
    });

    expect(result).toEqual({
      blocks: [
        {
          type: "stackedAreaChart",
          series: [
            { label: "Solar", values: [5, 8] },
            { label: "Grid", values: [4, 3] },
          ],
        },
      ],
    });
  });

  it("accepts token blocks", () => {
    const result = createSchema().parse({
      blocks: [
        {
          type: "token",
          title: "Code",
          content: "LOREM IPSUM",
        },
      ],
    });

    expect(result).toEqual({
      blocks: [
        {
          type: "token",
          title: "Code",
          content: "LOREM IPSUM",
        },
      ],
    });
  });

  it("accepts timeline blocks", () => {
    const result = createSchema().parse({
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "09:00", description: "Build started" },
            { label: "09:04", description: "Tests passed" },
          ],
        },
      ],
    });

    expect(result).toEqual({
      blocks: [
        {
          type: "timeline",
          items: [
            { label: "09:00", description: "Build started" },
            { label: "09:04", description: "Tests passed" },
          ],
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
