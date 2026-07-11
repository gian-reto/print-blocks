import { createStackedAreaChartBlockSchema } from "./schema";
import { describe, expect, it } from "vitest";

const createSchema = () => createStackedAreaChartBlockSchema(32);

describe("stacked area chart block schema", () => {
  it("accepts and strips extra fields from valid stacked area chart blocks", () => {
    const result = createSchema().parse({
      type: "stackedAreaChart",
      series: [
        { label: "Solar", values: [5, 8, 7] },
        { label: "Grid", values: [4, 3, 6] },
      ],
      xLabels: ["Mon", "Tue", "Wed"],
      yMax: 20,
      unknown: true,
    });

    expect(result).toEqual({
      type: "stackedAreaChart",
      series: [
        { label: "Solar", values: [5, 8, 7] },
        { label: "Grid", values: [4, 3, 6] },
      ],
      xLabels: ["Mon", "Tue", "Wed"],
      yMax: 20,
    });
  });

  it("rejects single-series stacked area charts", () => {
    const result = createSchema().safeParse({
      type: "stackedAreaChart",
      series: [{ label: "Solar", values: [1, 2] }],
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative values", () => {
    const result = createSchema().safeParse({
      type: "stackedAreaChart",
      series: [
        { label: "Solar", values: [1, -2] },
        { label: "Grid", values: [2, 3] },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects mismatched series lengths", () => {
    const result = createSchema().safeParse({
      type: "stackedAreaChart",
      series: [
        { label: "Solar", values: [1, 2, 3] },
        { label: "Grid", values: [1, 2] },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects mismatched x-label lengths", () => {
    const result = createSchema().safeParse({
      type: "stackedAreaChart",
      series: [
        { label: "Solar", values: [1, 2, 3] },
        { label: "Grid", values: [1, 2, 3] },
      ],
      xLabels: ["One", "Two"],
    });

    expect(result.success).toBe(false);
  });

  it("rejects duplicate series labels", () => {
    const result = createSchema().safeParse({
      type: "stackedAreaChart",
      series: [
        { label: "Solar", values: [1, 2] },
        { label: "Solar", values: [2, 3] },
      ],
    });

    expect(result.success).toBe(false);
  });

  it("rejects yMax values below stacked totals", () => {
    const result = createSchema().safeParse({
      type: "stackedAreaChart",
      series: [
        { label: "Solar", values: [5, 8] },
        { label: "Grid", values: [4, 3] },
      ],
      yMax: 10,
    });

    expect(result.success).toBe(false);
  });
});
