import { createTokenBlockSchema, maxTokenTitleChars } from "./schema";
import { describe, expect, it } from "vitest";

const createSchema = () => createTokenBlockSchema(11);

describe("token block schema", () => {
  it("accepts and strips extra fields from valid token blocks", () => {
    const result = createSchema().parse({
      type: "token",
      title: "Code",
      content: "LOREM IPSUM",
      unknown: true,
    });

    expect(result).toEqual({
      type: "token",
      title: "Code",
      content: "LOREM IPSUM",
    });
  });

  it("rejects blank token titles", () => {
    const result = createSchema().safeParse({
      type: "token",
      title: "   ",
      content: "LOREM IPSUM",
    });

    expect(result.success).toBe(false);
  });

  it("rejects blank token content", () => {
    const result = createSchema().safeParse({
      type: "token",
      title: "Code",
      content: "\n\t",
    });

    expect(result.success).toBe(false);
  });

  it("rejects token titles over the fixed title limit", () => {
    const result = createSchema().safeParse({
      type: "token",
      title: "T".repeat(maxTokenTitleChars + 1),
      content: "LOREM IPSUM",
    });

    expect(result.success).toBe(false);
  });

  it("rejects token content over the configured text limit", () => {
    const result = createSchema().safeParse({
      type: "token",
      title: "Code",
      content: "123456789012",
    });

    expect(result.success).toBe(false);
  });
});
