import { describe, expect, it } from "vitest";
import { createPrintRequestSchema } from "./schema";

const createSchema = () =>
  createPrintRequestSchema({
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

  it("accepts br blocks", () => {
    const result = createSchema().parse({
      blocks: [{ type: "br" }],
    });

    expect(result).toEqual({
      blocks: [{ type: "br" }],
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
