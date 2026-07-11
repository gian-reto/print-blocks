import { describe, expect, it } from "vitest";

import { createBarcodeBlockSchema } from "./schema";

const createSchema = () => createBarcodeBlockSchema();

describe("barcode block schema", () => {
  it("accepts barcode blocks", () => {
    const result = createSchema().parse({
      type: "barcode",
      format: "CODE39",
      content: "HELLO",
    });

    expect(result).toEqual({
      type: "barcode",
      format: "CODE39",
      content: "HELLO",
    });
  });

  it("accepts all component options", () => {
    const result = createSchema().parse({
      type: "barcode",
      format: "CODE128",
      content: "{B123456",
      align: "center",
      hriPosition: "bottom",
      hriFont: "B",
      width: 3,
      height: 100,
    });

    expect(result).toEqual({
      type: "barcode",
      format: "CODE128",
      content: "{B123456",
      align: "center",
      hriPosition: "bottom",
      hriFont: "B",
      width: 3,
      height: 100,
    });
  });

  it("strips extra fields", () => {
    const result = createSchema().parse({
      type: "barcode",
      format: "CODE39",
      content: "HELLO",
      unknown: true,
    });

    expect(result).toEqual({
      type: "barcode",
      format: "CODE39",
      content: "HELLO",
    });
  });

  it("accepts content at the byte limit", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "CODE128",
      content: `{B${"x".repeat(254)}`,
    });

    expect(result.success).toBe(true);
  });

  it("accepts CODE128 content with code set A", () => {
    const result = createSchema().parse({
      type: "barcode",
      format: "CODE128",
      content: "{AABC123",
    });

    expect(result).toEqual({
      type: "barcode",
      format: "CODE128",
      content: "{AABC123",
    });
  });

  it("accepts CODE128 content with code set B", () => {
    const result = createSchema().parse({
      type: "barcode",
      format: "CODE128",
      content: "{BOrder-123",
    });

    expect(result).toEqual({
      type: "barcode",
      format: "CODE128",
      content: "{BOrder-123",
    });
  });

  it("accepts CODE128 content with code set C", () => {
    const result = createSchema().parse({
      type: "barcode",
      format: "CODE128",
      content: "{C123456",
    });

    expect(result).toEqual({
      type: "barcode",
      format: "CODE128",
      content: "{C123456",
    });
  });

  it("rejects missing format", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      content: "HELLO",
    });

    expect(result.success).toBe(false);
  });

  it("rejects missing content", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "CODE39",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty content", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "CODE39",
      content: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects content over the byte limit", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "CODE128",
      content: `{B${"x".repeat(255)}`,
    });

    expect(result.success).toBe(false);
  });

  it("rejects CODE128 content without a code set prefix", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "CODE128",
      content: "123456",
    });

    expect(result.success).toBe(false);
  });

  it("does not require a CODE128 code set prefix for other formats", () => {
    const result = createSchema().parse({
      type: "barcode",
      format: "CODE39",
      content: "123456",
    });

    expect(result).toEqual({
      type: "barcode",
      format: "CODE39",
      content: "123456",
    });
  });

  it("rejects invalid formats", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "INVALID",
      content: "HELLO",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid alignment", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "CODE39",
      content: "HELLO",
      align: "top",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid hri positions", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "CODE39",
      content: "HELLO",
      hriPosition: "left",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid hri fonts", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "CODE39",
      content: "HELLO",
      hriFont: "X",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid widths", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "CODE39",
      content: "HELLO",
      width: 7,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid heights", () => {
    const result = createSchema().safeParse({
      type: "barcode",
      format: "CODE39",
      content: "HELLO",
      height: 256,
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-barcode blocks", () => {
    const result = createSchema().safeParse({ type: "text" });

    expect(result.success).toBe(false);
  });
});
