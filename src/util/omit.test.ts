import { describe, expect, it } from "vitest";
import { omit } from "./omit";

describe("omit", () => {
  it("omits specified keys from an object", () => {
    const result = omit(["a", "b"])({ a: 1, b: 2, c: 3 });

    expect(result).toEqual({ c: 3 });
  });

  it("returns a new object without mutating the original object", () => {
    const record = { a: 1, b: 2 };
    const result = omit(["a"])(record);

    expect(result).toEqual({ b: 2 });
    expect(result).not.toBe(record);
    expect(record).toEqual({ a: 1, b: 2 });
  });

  it("returns a copy when no keys are omitted", () => {
    const record = { a: 1 };
    const result = omit([])(record);

    expect(result).toEqual({ a: 1 });
    expect(result).not.toBe(record);
  });

  it("ignores omitted keys that are not present", () => {
    const result = omit(["missing"])({ a: 1 });

    expect(result).toEqual({ a: 1 });
  });

  it("supports symbol keys", () => {
    const key = Symbol("key");
    const result = omit([key])({ [key]: 1, a: 2 });

    expect(result).toEqual({ a: 2 });
  });
});
