import { createProgressBlockSchema, maxProgressSteps } from "./schema";
import { describe, expect, it } from "vitest";

const createSchema = () => createProgressBlockSchema(32);

describe("progress block schema", () => {
  it("accepts valid bar progress blocks", () => {
    const result = createSchema().parse({
      type: "progress",
      variant: "bar",
      value: 67,
      max: 100,
    });

    expect(result).toEqual({
      type: "progress",
      variant: "bar",
      value: 67,
      max: 100,
    });
  });

  it("rejects unknown fields", () => {
    const result = createSchema().safeParse({
      type: "progress",
      variant: "bar",
      value: 67,
      max: 100,
      unknown: true,
    });

    expect(result.success).toBe(false);
  });

  it("accepts explicit bar progress blocks", () => {
    const result = createSchema().parse({
      type: "progress",
      variant: "bar",
      value: 1,
      max: 4,
    });

    expect(result).toEqual({
      type: "progress",
      variant: "bar",
      value: 1,
      max: 4,
    });
  });

  it("accepts square steps progress blocks", () => {
    const result = createSchema().parse({
      type: "progress",
      variant: "steps",
      value: 4,
      max: 10,
      steps: 10,
      style: "squares",
    });

    expect(result).toEqual({
      type: "progress",
      variant: "steps",
      value: 4,
      max: 10,
      steps: 10,
      style: "squares",
    });
  });

  it("accepts circle steps progress blocks", () => {
    const result = createSchema().parse({
      type: "progress",
      variant: "steps",
      value: 6,
      max: 8,
      steps: 8,
      style: "circles",
    });

    expect(result).toEqual({
      type: "progress",
      variant: "steps",
      value: 6,
      max: 8,
      steps: 8,
      style: "circles",
    });
  });

  it("rejects negative values", () => {
    const result = createSchema().safeParse({
      type: "progress",
      variant: "bar",
      value: -1,
      max: 100,
    });

    expect(result.success).toBe(false);
  });

  it("rejects values greater than max", () => {
    const result = createSchema().safeParse({
      type: "progress",
      variant: "bar",
      value: 101,
      max: 100,
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-positive max values", () => {
    const result = createSchema().safeParse({
      type: "progress",
      variant: "bar",
      value: 0,
      max: 0,
    });

    expect(result.success).toBe(false);
  });

  it("rejects progress blocks without variants", () => {
    const result = createSchema().safeParse({
      type: "progress",
      value: 4,
      max: 10,
    });

    expect(result.success).toBe(false);
  });

  it("rejects steps on bar progress blocks", () => {
    const result = createSchema().safeParse({
      type: "progress",
      variant: "bar",
      value: 4,
      max: 10,
      steps: 10,
    });

    expect(result.success).toBe(false);
  });

  it("rejects style on bar progress blocks", () => {
    const result = createSchema().safeParse({
      type: "progress",
      variant: "bar",
      value: 4,
      max: 10,
      style: "circles",
    });

    expect(result.success).toBe(false);
  });

  it("rejects steps progress blocks without steps", () => {
    const result = createSchema().safeParse({
      type: "progress",
      variant: "steps",
      value: 4,
      max: 10,
      style: "squares",
    });

    expect(result.success).toBe(false);
  });

  it("rejects steps progress blocks without style", () => {
    const result = createSchema().safeParse({
      type: "progress",
      variant: "steps",
      value: 4,
      max: 10,
      steps: 10,
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-integer steps", () => {
    const result = createSchema().safeParse({
      type: "progress",
      variant: "steps",
      value: 4,
      max: 10,
      steps: 2.5,
      style: "squares",
    });

    expect(result.success).toBe(false);
  });

  it("rejects too many steps", () => {
    const result = createSchema().safeParse({
      type: "progress",
      variant: "steps",
      value: 4,
      max: 10,
      steps: maxProgressSteps + 1,
      style: "squares",
    });

    expect(result.success).toBe(false);
  });
});
