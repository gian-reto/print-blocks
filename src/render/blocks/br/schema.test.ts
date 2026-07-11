import { describe, expect, it } from "vitest";
import { createBrBlockSchema } from "./schema";

describe("br block schema", () => {
  it("accepts br blocks", () => {
    const result = createBrBlockSchema().parse({ type: "br" });

    expect(result).toEqual({ type: "br" });
  });

  it("strips extra fields", () => {
    const result = createBrBlockSchema().parse({ type: "br", unknown: true });

    expect(result).toEqual({ type: "br" });
  });

  it("rejects non-br blocks", () => {
    const result = createBrBlockSchema().safeParse({ type: "text" });

    expect(result.success).toBe(false);
  });
});
