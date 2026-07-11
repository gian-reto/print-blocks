import { describe, expect, it } from "vitest";
import { createLineBlockSchema } from "./schema";

describe("line block schema", () => {
  it("accepts line blocks", () => {
    const result = createLineBlockSchema().parse({ type: "line" });

    expect(result).toEqual({ type: "line" });
  });

  it("accepts a custom line character", () => {
    const result = createLineBlockSchema().parse({
      type: "line",
      character: "=",
    });

    expect(result).toEqual({ type: "line", character: "=" });
  });

  it("strips extra fields", () => {
    const result = createLineBlockSchema().parse({
      type: "line",
      character: "=",
      unknown: true,
    });

    expect(result).toEqual({ type: "line", character: "=" });
  });

  it("rejects empty line characters", () => {
    const result = createLineBlockSchema().safeParse({
      type: "line",
      character: "",
    });

    expect(result.success).toBe(false);
  });

  it("rejects multiple-character line characters", () => {
    const result = createLineBlockSchema().safeParse({
      type: "line",
      character: "--",
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-line blocks", () => {
    const result = createLineBlockSchema().safeParse({ type: "text" });

    expect(result.success).toBe(false);
  });
});
