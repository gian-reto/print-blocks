import { createAreaChartBlockSchema } from "./schema";
import { describe, expect, it } from "vitest";

const createSchema = () => createAreaChartBlockSchema(32);

describe("area chart block schema", () => {
  it("accepts and strips extra fields from valid area chart blocks", () => {
    const result = createSchema().parse({
      type: "areaChart",
      series: { label: "Room", values: [19, 21, 20] },
      xLabels: ["08:00", "10:00", "12:00"],
      yMin: 18,
      yMax: 24,
      unknown: true,
    });

    expect(result).toEqual({
      type: "areaChart",
      series: { label: "Room", values: [19, 21, 20] },
      xLabels: ["08:00", "10:00", "12:00"],
      yMin: 18,
      yMax: 24,
    });
  });

  it("rejects blank series labels", () => {
    const result = createSchema().safeParse({
      type: "areaChart",
      series: { label: " ", values: [1, 2] },
    });

    expect(result.success).toBe(false);
  });

  it("rejects too few values", () => {
    const result = createSchema().safeParse({
      type: "areaChart",
      series: { label: "Room", values: [1] },
    });

    expect(result.success).toBe(false);
  });

  it("rejects mismatched x-label lengths", () => {
    const result = createSchema().safeParse({
      type: "areaChart",
      series: { label: "Room", values: [1, 2, 3] },
      xLabels: ["One", "Two"],
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid y-axis bounds", () => {
    const result = createSchema().safeParse({
      type: "areaChart",
      series: { label: "Room", values: [1, 2] },
      yMin: 3,
      yMax: 2,
    });

    expect(result.success).toBe(false);
  });
});
