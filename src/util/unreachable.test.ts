import { afterEach, describe, expect, it, vi } from "vitest";

import { unreachable } from "./unreachable";

describe("unreachable", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs the unreachable value", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const value = { type: "unknown" };

    unreachable(value as never);

    expect(error).toHaveBeenCalledWith(
      "Unreachable code reached. Value:",
      value,
    );
  });

  it("logs the provided message", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    const value = "unexpected";

    unreachable(value as never, "Unknown block type");

    expect(error).toHaveBeenCalledWith(
      "Unreachable code reached: Unknown block type. Value:",
      value,
    );
  });

  it("returns the provided value", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const value = { type: "unknown" };

    const result = unreachable(value as never);

    expect(result).toBe(value);
  });
});
