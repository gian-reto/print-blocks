import { describe, expect, it } from "vitest";

import { createQrCodeBlockSchema } from "./schema";

const createSchema = () => createQrCodeBlockSchema();

describe("qrcode block schema", () => {
  it("accepts qrcode blocks", () => {
    const result = createSchema().parse({
      type: "qrcode",
      content: "Hello",
    });

    expect(result).toEqual({ type: "qrcode", content: "Hello" });
  });

  it("accepts all component options", () => {
    const result = createSchema().parse({
      type: "qrcode",
      content: "Hello",
      align: "center",
      model: "model2",
      cellSize: 4,
      correction: "H",
    });

    expect(result).toEqual({
      type: "qrcode",
      content: "Hello",
      align: "center",
      model: "model2",
      cellSize: 4,
      correction: "H",
    });
  });

  it("strips extra fields", () => {
    const result = createSchema().parse({
      type: "qrcode",
      content: "Hello",
      unknown: true,
    });

    expect(result).toEqual({ type: "qrcode", content: "Hello" });
  });

  it("rejects missing content", () => {
    const result = createSchema().safeParse({ type: "qrcode" });

    expect(result.success).toBe(false);
  });

  it("rejects empty content", () => {
    const result = createSchema().safeParse({
      type: "qrcode",
      content: "",
    });

    expect(result.success).toBe(false);
  });

  it("accepts content at the byte limit", () => {
    const result = createSchema().safeParse({
      type: "qrcode",
      content: "x".repeat(500),
    });

    expect(result.success).toBe(true);
  });

  it("rejects content over the byte limit", () => {
    const result = createSchema().safeParse({
      type: "qrcode",
      content: "x".repeat(501),
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid alignment", () => {
    const result = createSchema().safeParse({
      type: "qrcode",
      content: "Hello",
      align: "top",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid models", () => {
    const result = createSchema().safeParse({
      type: "qrcode",
      content: "Hello",
      model: "model3",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid cell sizes", () => {
    const result = createSchema().safeParse({
      type: "qrcode",
      content: "Hello",
      cellSize: 9,
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid correction levels", () => {
    const result = createSchema().safeParse({
      type: "qrcode",
      content: "Hello",
      correction: "X",
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-qrcode blocks", () => {
    const result = createSchema().safeParse({ type: "text" });

    expect(result.success).toBe(false);
  });
});
