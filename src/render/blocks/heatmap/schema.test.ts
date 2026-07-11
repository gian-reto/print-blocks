import {
  createHeatmapBlockSchema,
  maxHeatmapCells,
  maxHeatmapColumns,
  maxHeatmapLabelChars,
  maxHeatmapRows,
} from "./schema";
import { describe, expect, it } from "vitest";

const createSchema = () => createHeatmapBlockSchema(11);

describe("heatmap block schema", () => {
  it("accepts and strips extra fields from valid heatmap blocks", () => {
    const result = createSchema().parse({
      type: "heatmap",
      labels: ["Mon", "Tue", "Wed"],
      values: [
        [null, 3, 1],
        [0, 3, 2],
      ],
      unknown: true,
    });

    expect(result).toEqual({
      type: "heatmap",
      labels: ["Mon", "Tue", "Wed"],
      values: [
        [null, 3, 1],
        [0, 3, 2],
      ],
    });
  });

  it("accepts null cells", () => {
    const result = createSchema().parse({
      type: "heatmap",
      labels: ["A"],
      values: [[null]],
    });

    expect(result.values).toEqual([[null]]);
  });

  it("accepts zero cells", () => {
    const result = createSchema().parse({
      type: "heatmap",
      labels: ["A"],
      values: [[0]],
    });

    expect(result.values).toEqual([[0]]);
  });

  it("accepts empty labels", () => {
    const result = createSchema().parse({
      type: "heatmap",
      labels: [""],
      values: [[1]],
    });

    expect(result.labels).toEqual([""]);
  });

  it("rejects empty values", () => {
    const result = createSchema().safeParse({
      type: "heatmap",
      labels: ["A"],
      values: [],
    });

    expect(result.success).toBe(false);
  });

  it("rejects empty rows", () => {
    const result = createSchema().safeParse({
      type: "heatmap",
      labels: [],
      values: [[]],
    });

    expect(result.success).toBe(false);
  });

  it("rejects ragged rows", () => {
    const result = createSchema().safeParse({
      type: "heatmap",
      labels: ["A", "B"],
      values: [[1, 2], [3]],
    });

    expect(result.success).toBe(false);
  });

  it("rejects label count mismatches", () => {
    const result = createSchema().safeParse({
      type: "heatmap",
      labels: ["A"],
      values: [[1, 2]],
    });

    expect(result.success).toBe(false);
  });

  it("rejects negative cell values", () => {
    const result = createSchema().safeParse({
      type: "heatmap",
      labels: ["A"],
      values: [[-1]],
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-finite cell values", () => {
    const result = createSchema().safeParse({
      type: "heatmap",
      labels: ["A"],
      values: [[Number.POSITIVE_INFINITY]],
    });

    expect(result.success).toBe(false);
  });

  it("rejects too many rows", () => {
    const result = createSchema().safeParse({
      type: "heatmap",
      labels: ["A"],
      values: Array.from({ length: maxHeatmapRows + 1 }, () => [1]),
    });

    expect(result.success).toBe(false);
  });

  it("rejects too many columns", () => {
    const result = createSchema().safeParse({
      type: "heatmap",
      labels: Array.from({ length: maxHeatmapColumns + 1 }, (_, index) =>
        String(index),
      ),
      values: [Array.from({ length: maxHeatmapColumns + 1 }, () => 1)],
    });

    expect(result.success).toBe(false);
  });

  it("rejects too many cells", () => {
    const columnCount = Math.floor(maxHeatmapCells / maxHeatmapRows) + 1;
    const result = createSchema().safeParse({
      type: "heatmap",
      labels: Array.from({ length: columnCount }, (_, index) => String(index)),
      values: Array.from({ length: maxHeatmapRows }, () =>
        Array.from({ length: columnCount }, () => 1),
      ),
    });

    expect(result.success).toBe(false);
  });

  it("rejects labels over the fixed label limit", () => {
    const result = createSchema().safeParse({
      type: "heatmap",
      labels: ["L".repeat(maxHeatmapLabelChars + 1)],
      values: [[1]],
    });

    expect(result.success).toBe(false);
  });
});
