import { createLineChartBlockSchema } from "./schema";
import { describe, expect, it } from "vitest";

const createSchema = () => createLineChartBlockSchema(32);

describe("line chart block schema", () => {
  it("accepts and strips extra fields from valid line chart blocks", () => {
    const result = createSchema().parse({
      type: "lineChart",
      series: [
        { label: "API", values: [120, 140, 110] },
        { label: "DB", values: [80, 90, 95] },
      ],
      xLabels: ["10:00", "10:05", "10:10"],
      yMin: 0,
      yMax: 200,
      unknown: true,
    });

    expect(result).toEqual({
      type: "lineChart",
      series: [
        { label: "API", values: [120, 140, 110] },
        { label: "DB", values: [80, 90, 95] },
      ],
      xLabels: ["10:00", "10:05", "10:10"],
      yMin: 0,
      yMax: 200,
    });
  });

  it("rejects blank series labels", () => {
    const result = createSchema().safeParse({
      type: "lineChart",
      series: [{ label: "   ", values: [1, 2] }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects mismatched series lengths", () => {
    const result = createSchema().safeParse({
      type: "lineChart",
      series: [
        { label: "API", values: [1, 2, 3] },
        { label: "DB", values: [1, 2] },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects mismatched x-label lengths", () => {
    const result = createSchema().safeParse({
      type: "lineChart",
      series: [{ label: "API", values: [1, 2, 3] }],
      xLabels: ["One", "Two"],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate series labels", () => {
    const result = createSchema().safeParse({
      type: "lineChart",
      series: [
        { label: "API", values: [1, 2] },
        { label: "API", values: [2, 3] },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid y-axis bounds", () => {
    const result = createSchema().safeParse({
      type: "lineChart",
      series: [{ label: "API", values: [1, 2] }],
      yMin: 10,
      yMax: 10,
    });

    expect(result.success).toBe(false);
  });
});
