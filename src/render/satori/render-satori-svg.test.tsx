import { describe, expect, it } from "vitest";
import { renderSatoriSvg, satoriFontFamilies } from ".";

import type { BlockRenderContext } from "../blocks/context";
import sharp from "sharp";

const context: BlockRenderContext = {
  imageSource: {
    maxImageInputPixels: 25_000_000,
    maxRemoteImageBytes: 5 * 1024 * 1024,
    remoteImageTimeoutMs: 5_000,
  },
  printerDotWidth: 384,
};

const getSvgMetadata = async (svg: string) =>
  await sharp(Buffer.from(svg, "utf8")).metadata();

describe("renderSatoriSvg", () => {
  it("renders width-only layouts with a positive computed height", async () => {
    const svg = await renderSatoriSvg({
      context,
      element: (
        <div
          style={{
            color: "#000",
            display: "flex",
            fontFamily: satoriFontFamilies.geistMono,
            fontSize: 24,
            padding: 8,
            width: "100%",
          }}
        >
          LOREM IPSUM
        </div>
      ),
    });
    const metadata = await getSvgMetadata(svg);

    expect(svg).toContain("<svg");
    expect(metadata.format).toBe("svg");
    expect(metadata.width).toBe(context.printerDotWidth);
    expect(metadata.height).toBeGreaterThan(0);
  });

  it("computes more height for wrapping content", async () => {
    const renderContent = async (content: string) => {
      const svg = await renderSatoriSvg({
        context: {
          ...context,
          printerDotWidth: 180,
        },
        element: (
          <div
            style={{
              color: "#000",
              display: "flex",
              fontFamily: satoriFontFamilies.geistMono,
              fontSize: 24,
              lineHeight: 1.2,
              padding: 8,
              width: "100%",
              wordBreak: "break-all",
            }}
          >
            {content}
          </div>
        ),
      });

      return await getSvgMetadata(svg);
    };

    const shortMetadata = await renderContent("LOREM IPSUM");
    const longMetadata = await renderContent("LOREM IPSUM-".repeat(8));

    expect(longMetadata.height).toBeGreaterThan(shortMetadata.height ?? 0);
  });
});
