import { createRowBlockSchema, createRowTextCellSchema } from "./schema";
import { describe, expect, it } from "vitest";

const createSchema = () => createRowBlockSchema(5);
const createCellSchema = () => createRowTextCellSchema(5);

describe("row text cell schema", () => {
  it("accepts text cells without a type", () => {
    const result = createCellSchema().parse({
      content: "Hello",
      bold: true,
    });

    expect(result).toEqual({ content: "Hello", bold: true });
  });

  it("strips block-only and row-controlled fields", () => {
    const result = createCellSchema().parse({
      type: "text",
      content: "Hello",
      align: "center",
      inline: true,
      bold: true,
      unknown: true,
    });

    expect(result).toEqual({ content: "Hello", bold: true });
  });

  it("rejects empty text content", () => {
    const result = createCellSchema().safeParse({ content: "" });

    expect(result.success).toBe(false);
  });

  it("rejects text content over the configured limit", () => {
    const result = createCellSchema().safeParse({ content: "123456" });

    expect(result.success).toBe(false);
  });
});

describe("row block schema", () => {
  it("accepts row blocks", () => {
    const result = createSchema().parse({
      type: "row",
      left: { content: "Item" },
      right: { content: "1.00" },
    });

    expect(result).toEqual({
      type: "row",
      left: { content: "Item" },
      right: { content: "1.00" },
    });
  });

  it("accepts center, gap, and text formatting", () => {
    const result = createSchema().parse({
      type: "row",
      left: { content: "Item", bold: true },
      center: { content: "x2", underline: "1dot-thick" },
      right: { content: "1.00", size: { width: 2, height: 1 } },
      gap: 2,
    });

    expect(result).toEqual({
      type: "row",
      left: { content: "Item", bold: true },
      center: { content: "x2", underline: "1dot-thick" },
      right: { content: "1.00", size: { width: 2, height: 1 } },
      gap: 2,
    });
  });

  it("strips extra fields", () => {
    const result = createSchema().parse({
      type: "row",
      left: { content: "Item", unknown: true },
      right: { content: "1.00" },
      unknown: true,
    });

    expect(result).toEqual({
      type: "row",
      left: { content: "Item" },
      right: { content: "1.00" },
    });
  });

  it("rejects rows without left text", () => {
    const result = createSchema().safeParse({
      type: "row",
      right: { content: "1.00" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects rows without right text", () => {
    const result = createSchema().safeParse({
      type: "row",
      left: { content: "Item" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects plain string cells", () => {
    const result = createSchema().safeParse({
      type: "row",
      left: "Item",
      right: "1.00",
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty cell content", () => {
    const result = createSchema().safeParse({
      type: "row",
      left: { content: "" },
      right: { content: "1.00" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects cell content over the configured limit", () => {
    const result = createSchema().safeParse({
      type: "row",
      left: { content: "123456" },
      right: { content: "1.00" },
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative gaps", () => {
    const result = createSchema().safeParse({
      type: "row",
      left: { content: "Item" },
      right: { content: "1.00" },
      gap: -1,
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-row blocks", () => {
    const result = createSchema().safeParse({ type: "text" });

    expect(result.success).toBe(false);
  });
});
