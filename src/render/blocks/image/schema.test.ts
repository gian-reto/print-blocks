import { describe, expect, it } from "vitest";

import { createImageBlockSchema } from "./schema";
import sharp from "sharp";
import { transforms } from "@react-thermal-printer/image";
import { whitePixelPngBase64 } from "../../../test/fixtures/image";

const createSchema = (allowRemoteImageUrls = false) =>
  createImageBlockSchema({ allowRemoteImageUrls });

describe("image block schema", () => {
  it("accepts image blocks", () => {
    const result = createSchema().parse({
      type: "image",
      data: whitePixelPngBase64,
    });

    expect(result).toEqual({
      type: "image",
      data: whitePixelPngBase64,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    });
  });

  it("accepts all component options", () => {
    const result = createSchema().parse({
      type: "image",
      data: whitePixelPngBase64,
      align: "center",
      fit: "cover",
      withoutEnlargement: false,
      transforms: ["floydSteinberg"],
      rgbToBlack: 230,
    });

    expect(result).toEqual({
      type: "image",
      data: whitePixelPngBase64,
      align: "center",
      fit: sharp.fit.cover,
      withoutEnlargement: false,
      transforms: [transforms.floydSteinberg],
      rgbToBlack: expect.any(Function),
    });
    expect(result.rgbToBlack?.({ r: 0, g: 0, b: 0, a: 255 })).toBe(true);
    expect(result.rgbToBlack?.({ r: 255, g: 255, b: 255, a: 255 })).toBe(false);
  });

  it("rejects extra fields", () => {
    const result = createSchema().safeParse({
      type: "image",
      data: whitePixelPngBase64,
      unknown: true,
    });

    expect(result.success).toBe(false);
  });

  it.each(Object.values(sharp.fit))("accepts sharp fit mode %s", (fit) => {
    const result = createSchema().parse({
      type: "image",
      data: whitePixelPngBase64,
      fit,
    });

    expect(result).toMatchObject({
      type: "image",
      data: whitePixelPngBase64,
      fit,
    });
  });

  it("rejects missing sources", () => {
    const result = createSchema().safeParse({ type: "image" });

    expect(result.success).toBe(false);
  });

  it("rejects empty sources", () => {
    const result = createSchema().safeParse({ type: "image", data: "" });

    expect(result.success).toBe(false);
  });

  it("accepts remote URLs when enabled", () => {
    const result = createSchema(true).parse({
      type: "image",
      url: "https://example.com/logo.png",
    });

    expect(result).toEqual({
      type: "image",
      url: "https://example.com/logo.png",
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    });
  });

  it("rejects remote URLs when disabled", () => {
    const result = createSchema().safeParse({
      type: "image",
      url: "https://example.com/logo.png",
    });

    expect(result.success).toBe(false);
  });

  it("rejects image blocks containing both data and url", () => {
    const result = createSchema(true).safeParse({
      type: "image",
      data: whitePixelPngBase64,
      url: "https://example.com/logo.png",
    });

    expect(result.success).toBe(false);
  });

  it("rejects plain HTTP URLs", () => {
    const result = createSchema(true).safeParse({
      type: "image",
      url: "http://example.com/logo.png",
    });

    expect(result.success).toBe(false);
  });

  it("rejects direct IP address URLs", () => {
    const result = createSchema(true).safeParse({
      type: "image",
      url: "https://127.0.0.1/logo.png",
    });

    expect(result.success).toBe(false);
  });

  it("rejects encoded direct IP address URLs", () => {
    const result = createSchema(true).safeParse({
      type: "image",
      url: "https://2130706433/logo.png",
    });

    expect(result.success).toBe(false);
  });

  it("rejects URLs with credentials", () => {
    const result = createSchema(true).safeParse({
      type: "image",
      url: "https://user:password@example.com/logo.png",
    });

    expect(result.success).toBe(false);
  });

  it("rejects data URLs", () => {
    const result = createSchema().safeParse({
      type: "image",
      data: `data:image/png;base64,${whitePixelPngBase64}`,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid base64 data", () => {
    const result = createSchema().safeParse({
      type: "image",
      data: "not valid base64",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid alignment", () => {
    const result = createSchema().safeParse({
      type: "image",
      data: whitePixelPngBase64,
      align: "top",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid fit modes", () => {
    const result = createSchema().safeParse({
      type: "image",
      data: whitePixelPngBase64,
      fit: "invalid",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid withoutEnlargement values", () => {
    const result = createSchema().safeParse({
      type: "image",
      data: whitePixelPngBase64,
      withoutEnlargement: "false",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid transforms", () => {
    const result = createSchema().safeParse({
      type: "image",
      data: whitePixelPngBase64,
      transforms: ["unknown"],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate transforms", () => {
    const result = createSchema().safeParse({
      type: "image",
      data: whitePixelPngBase64,
      transforms: ["floydSteinberg", "floydSteinberg"],
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid rgbToBlack thresholds", () => {
    const result = createSchema().safeParse({
      type: "image",
      data: whitePixelPngBase64,
      rgbToBlack: 256,
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-image blocks", () => {
    const result = createSchema().safeParse({ type: "text" });

    expect(result.success).toBe(false);
  });
});
