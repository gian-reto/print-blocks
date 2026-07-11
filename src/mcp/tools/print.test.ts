import { describe, expect, it } from "vitest";

import { ImageRenderError } from "../../render/blocks/image/error";
import { createRenderFailureToolResult } from "./print";

describe("createRenderFailureToolResult", () => {
  it("surfaces actionable image render errors", () => {
    const result = createRenderFailureToolResult(
      new ImageRenderError(
        "IMAGE_SHARP_PROCESSING_ERROR",
        "Input buffer contains unsupported image format",
      ),
    );

    expect(result).toMatchObject({
      isError: true,
      structuredContent: {
        ok: false,
        printed: false,
        error: {
          code: "IMAGE_SHARP_PROCESSING_ERROR",
          message: "Input buffer contains unsupported image format",
        },
      },
    });
    expect(result.content[0]?.text).toContain("image rendering failed");
    expect(result.content[0]?.text).toContain("IMAGE_SHARP_PROCESSING_ERROR");
  });

  it("keeps unexpected render errors generic", () => {
    const result = createRenderFailureToolResult(new Error("secret detail"));

    expect(result).toMatchObject({
      isError: true,
      structuredContent: {
        ok: false,
        printed: false,
        error: {
          message: "Failed to render print job.",
        },
      },
    });
    expect(result.content[0]?.text).not.toContain("secret detail");
  });
});
