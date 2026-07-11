import { describe, expect, it } from "vitest";

import { omitByValue } from "./omit-by-value";

describe("omitByValue", () => {
  it("omits keys whose values match the omitted value", () => {
    const result = omitByValue([2])({ a: 1, b: 2, c: 3 });

    expect(result).toEqual({ a: 1, c: 3 });
  });

  it("omits keys matching any omitted value", () => {
    const result = omitByValue([1, 3])({ a: 1, b: 2, c: 3 });

    expect(result).toEqual({ b: 2 });
  });

  it("returns a new object without mutating the original object", () => {
    const record = { a: 1, b: 2 };
    const result = omitByValue([1])(record);

    expect(result).toEqual({ b: 2 });
    expect(result).not.toBe(record);
    expect(record).toEqual({ a: 1, b: 2 });
  });

  it("keeps all keys when no values match", () => {
    const record = { a: 1, b: 2 };
    const result = omitByValue([3])(record);

    expect(result).toEqual({ a: 1, b: 2 });
  });

  it("can omit undefined values", () => {
    const result = omitByValue([undefined])({
      a: 1,
      b: undefined,
      c: false,
    });

    expect(result).toEqual({ a: 1, c: false });
  });

  it("can omit null values", () => {
    const result = omitByValue([null])({ a: 1, b: null, c: false });

    expect(result).toEqual({ a: 1, c: false });
  });

  it("returns an empty object when all values are omitted", () => {
    const result = omitByValue([1, 2, 3, undefined])({
      a: 1,
      b: 2,
      c: 3,
      d: undefined,
    });

    expect(result).toEqual({});
  });
});
