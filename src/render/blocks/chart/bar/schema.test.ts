import { createBarChartBlockSchema } from "./schema";
import { describe, expect, it } from "vitest";

const createSchema = () => createBarChartBlockSchema(32);

describe("bar chart block schema", () => {
  it("accepts and strips extra fields from valid bar chart blocks", () => {
    const result = createSchema().parse({
      type: "barChart",
      items: [
        { label: "Mon", value: 12 },
        { label: "Tue", value: 18 },
      ],
      yMax: 20,
      unknown: true,
    });

    expect(result).toEqual({
      type: "barChart",
      items: [
        { label: "Mon", value: 12 },
        { label: "Tue", value: 18 },
      ],
      yMax: 20,
    });
  });

  it("rejects blank labels", () => {
    const result = createSchema().safeParse({
      type: "barChart",
      items: [{ label: " ", value: 1 }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative values", () => {
    const result = createSchema().safeParse({
      type: "barChart",
      items: [{ label: "Mon", value: -1 }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate item labels", () => {
    const result = createSchema().safeParse({
      type: "barChart",
      items: [
        { label: "Mon", value: 1 },
        { label: "Mon", value: 2 },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects yMax values below item values", () => {
    const result = createSchema().safeParse({
      type: "barChart",
      items: [{ label: "Mon", value: 10 }],
      yMax: 9,
    });

    expect(result.success).toBe(false);
  });
});
