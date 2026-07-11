import { describe, expect, it } from "vitest";

import { createImageBlockSchema } from "./schema";
import { transforms } from "@react-thermal-printer/image";
import { whitePixelPngBase64 } from "../../../test/fixtures/image";

const createSchema = () => createImageBlockSchema();

describe("image block schema", () => {
  it("accepts image blocks", () => {
    const result = createSchema().parse({
      type: "image",
      src: whitePixelPngBase64,
    });

    expect(result).toEqual({
      type: "image",
      src: whitePixelPngBase64,
    });
  });

  it("accepts all component options", () => {
    const result = createSchema().parse({
      type: "image",
      src: whitePixelPngBase64,
      align: "center",
      transforms: ["floydSteinberg"],
      rgbToBlack: 230,
    });

    expect(result).toEqual({
      type: "image",
      src: whitePixelPngBase64,
      align: "center",
      transforms: [transforms.floydSteinberg],
      rgbToBlack: expect.any(Function),
    });
    expect(result.rgbToBlack?.({ r: 0, g: 0, b: 0, a: 255 })).toBe(true);
    expect(result.rgbToBlack?.({ r: 255, g: 255, b: 255, a: 255 })).toBe(false);
  });

  it("strips extra fields", () => {
    const result = createSchema().parse({
      type: "image",
      src: whitePixelPngBase64,
      unknown: true,
    });

    expect(result).toEqual({
      type: "image",
      src: whitePixelPngBase64,
    });
  });

  it("rejects missing sources", () => {
    const result = createSchema().safeParse({ type: "image" });

    expect(result.success).toBe(false);
  });

  it("rejects empty sources", () => {
    const result = createSchema().safeParse({ type: "image", src: "" });

    expect(result.success).toBe(false);
  });

  it("rejects remote URLs", () => {
    const result = createSchema().safeParse({
      type: "image",
      src: "https://example.com/logo.png",
    });

    expect(result.success).toBe(false);
  });

  it("rejects data URLs", () => {
    const result = createSchema().safeParse({
      type: "image",
      src: `data:image/png;base64,${whitePixelPngBase64}`,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid base64 data", () => {
    const result = createSchema().safeParse({
      type: "image",
      src: "not valid base64",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid alignment", () => {
    const result = createSchema().safeParse({
      type: "image",
      src: whitePixelPngBase64,
      align: "top",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid transforms", () => {
    const result = createSchema().safeParse({
      type: "image",
      src: whitePixelPngBase64,
      transforms: ["unknown"],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate transforms", () => {
    const result = createSchema().safeParse({
      type: "image",
      src: whitePixelPngBase64,
      transforms: ["floydSteinberg", "floydSteinberg"],
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid rgbToBlack thresholds", () => {
    const result = createSchema().safeParse({
      type: "image",
      src: whitePixelPngBase64,
      rgbToBlack: 256,
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-image blocks", () => {
    const result = createSchema().safeParse({ type: "text" });

    expect(result.success).toBe(false);
  });
});
