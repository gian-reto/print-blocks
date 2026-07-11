import { describe, expect, it } from "vitest";

import type { BlockRenderContext } from "../context";
import { renderHeatmapBlock } from "./component";
import { floydSteinbergDither } from "./dither";

const context = {
  imageSource: {
    maxImageInputPixels: 25_000_000,
    maxRemoteImageBytes: 5 * 1024 * 1024,
    remoteImageTimeoutMs: 5_000,
  },
  printerDotWidth: 576,
} satisfies BlockRenderContext;

describe("renderHeatmapBlock", () => {
  it("applies Floyd-Steinberg dithering to preserve grayscale shades", () => {
    const result = renderHeatmapBlock(
      {
        type: "heatmap",
        labels: ["Mon", "Tue"],
        values: [[1, 2]],
      },
      context,
    );

    expect(result.props.transforms).toEqual([floydSteinbergDither]);
  });
});
