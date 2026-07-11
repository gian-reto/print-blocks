import { describe, expect, it } from "vitest";
import { getPrinterDotWidth } from "./context";

describe("getPrinterDotWidth", () => {
  it("converts printer text width to printer dots", () => {
    expect(getPrinterDotWidth(32)).toBe(384);
    expect(getPrinterDotWidth(48)).toBe(576);
  });
});
