import { describe, expect, it } from "vitest";
import { createTextBlockSchema } from "./schema";

const createSchema = () => createTextBlockSchema(5);

describe("text block schema", () => {
  it("accepts and strips extra fields from valid text blocks", () => {
    const result = createSchema().parse({
      type: "text",
      content: "Hello",
      align: "center",
      unknown: true,
    });

    expect(result).toEqual({
      type: "text",
      content: "Hello",
      align: "center",
    });
  });

  it("allows newline content", () => {
    const result = createSchema().parse({
      type: "text",
      content: "A\nB",
    });

    expect(result.content).toBe("A\nB");
  });

  it("rejects empty text content", () => {
    const result = createSchema().safeParse({
      type: "text",
      content: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects text content over the configured limit", () => {
    const result = createSchema().safeParse({
      type: "text",
      content: "123456",
    });

    expect(result.success).toBe(false);
  });
});
